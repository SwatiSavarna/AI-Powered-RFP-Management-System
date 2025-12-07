const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const Proposal = require('../models/Proposal');
const Vendor = require('../models/Vendor');
const RFP = require('../models/RFP');
const { runModel } = require("../libs/ollamaClient");

const imapConfig = {
 imap: {
 user: process.env.IMAP_USER,
 password: process.env.IMAP_PASS,
 host: process.env.IMAP_HOST,
 port: Number(process.env.IMAP_PORT || 993),
 tls: true,
tlsOptions: { rejectUnauthorized: false },
 authTimeout: 3000
 }
};


async function parseProposalWithAI(emailText) {
 const prompt = `
Extract proposal and return STRICT JSON:
{
 "total_price": null,
 "currency": "",
 "delivery_time": "",
 "payment_terms": "",
 "warranty": "",
 "line_items": [],
 "notes": ""
}
From text below:
"""${emailText}"""
Return ONLY JSON.
`;

 const result = await runModel(prompt);

 // Parse JSON safely
 try { return JSON.parse(result); }
 catch {
 const match = result.match(/\{[\s\S]*\}/);
 if (match) return JSON.parse(match[0]);
 throw new Error("JSON parse failed from AI output");
 }
}


async function processMail() {
 let connection;
 try {
 connection = await imaps.connect(imapConfig);
 await connection.openBox('INBOX');

 // FIX 1: Relax search criteria for better testing. 
    // Searching for 'ALL' emails received since the start of today.
 const searchCriteria = ['ALL', ['SINCE', new Date().toISOString().substring(0, 10)]]; 
const fetchOptions = { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)',''], markSeen: true };
    
 const results = await connection.search(searchCriteria, fetchOptions);
    console.log(`Found ${results.length} emails to process.`); // Added log for visibility

 for (const res of results) {
 const raw = res.parts.find(p => p.which === '');
 const parsed = await simpleParser(raw.body);
 const text = (parsed.text || parsed.html || '').toString();
 
 // try to find vendor by from email
 const fromAddr = (parsed.from && parsed.from.value && parsed.from.value[0] && parsed.from.value[0].address) || '';
 const vendor = await Vendor.findOne({ email: fromAddr });
      
      if (!vendor) {
          console.log(`Skipping email from ${fromAddr}: Vendor not recognized.`);
          continue; // Guard clause: Skip processing if the vendor is not in your DB
      }

 // try to associate with an RFP: by subject containing "RFP: <title>" or scan for matching title in body
let rfp = null;
// FIX 2: Clean up subject line (remove Re:, Fwd:)
const subject = (parsed.subject || '').replace(/\s*(Re:|Fwd:)\s*/gi, '').trim(); 

 if (subject.includes('RFP:')) {
 const title = subject.split('RFP:')[1].trim();
 // Use $regex for partial title matching, case insensitive
 rfp = await RFP.findOne({ title: { $regex: new RegExp(title, 'i') } }); 
 }
      
if (!rfp) {
 // fallback: attempt to find an RFP whose title appears in body
 const allRfps = await RFP.find();
rfp = allRfps.find(r => (text + subject).toLowerCase().includes((r.title || '').toLowerCase()));
 }

      // FIX 3: Check if a proposal already exists for this RFP and Vendor to prevent duplicates
      if (rfp && vendor) {
          const existingProposal = await Proposal.findOne({ rfp: rfp._id, vendor: vendor._id });
          if (existingProposal) {
              console.log(`Skipping email: Proposal already exists for RFP ${rfp.title} from Vendor ${vendor.name}`);
              continue; 
          }
      }

// parse proposal
 const parsedProposal = await parseProposalWithAI(text);
      
      const proposal = new Proposal({
 rfp: rfp ? rfp._id : null,
 vendor: vendor?._id || null,
 rawEmail: text,
 parsed: parsedProposal
 });
 await proposal.save();
 console.log('Saved proposal from', fromAddr, 'for rfp', rfp? rfp.title : 'unknown');
 }
 await connection.end();
 } catch (e) {
 console.error('Email worker error', e);
 if (connection) try { await connection.end(); } catch(e) {}
 }
}

let timer = null;
exports.start = () => {
 const interval = Number(process.env.POLL_INTERVAL_SECS || 60) * 1000;
 // run immediately then at interval
 processMail();
 timer = setInterval(processMail, interval);
};
exports.stop = () => { if (timer) clearInterval(timer); };