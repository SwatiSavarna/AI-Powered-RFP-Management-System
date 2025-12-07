// const Vendor = require('../models/Vendor');
// const RFP = require('../models/RFP');
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT || 587),
//   secure: process.env.SMTP_PORT==465,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

// exports.createVendor = async (req, res) => {
//   const v = new Vendor(req.body);
//   await v.save();
//   res.json(v);
// };

// exports.listVendors = async (req, res) => {
//   const vs = await Vendor.find().lean();
//   res.json(vs);
// };

// function rfpToEmailContent(rfp) {
//   return `
// RFP: ${rfp.title}

// Description:
// ${rfp.description}

// Structured:
// ${JSON.stringify(rfp.structured, null, 2)}

// Please reply to this email with your proposal including price, delivery time, warranty, and any line-item pricing.
// `;
// }

// exports.sendRFP = async (req, res) => {
//   try {
//     const { rfpId, vendorIds } = req.body;
//     const rfp = await RFP.findById(rfpId);
//     if (!rfp) return res.status(404).json({ error: 'RFP not found' });

//     const vendors = await Vendor.find({ _id: { $in: vendorIds } });
//     for (const vendor of vendors) {
//       await transporter.sendMail({
//         from: process.env.FROM_EMAIL,
//         to: vendor.email,
//         subject: `RFP: ${rfp.title}`,
//         text: rfpToEmailContent(rfp),
//       });
//     }

//     // record that we sent to these vendors
//     rfp.vendorsSent = [...new Set([...(rfp.vendorsSent || []), ...vendorIds])];
//     await rfp.save();

//     res.json({ ok: true, sentTo: vendors.map(v => v.email) });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: e.message });
//   }
// };







const Vendor = require('../models/Vendor');
const RFP = require('../models/RFP');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
 host: process.env.SMTP_HOST,
 port: Number(process.env.SMTP_PORT || 587),
 secure: process.env.SMTP_PORT==465,
auth: {
 user: process.env.SMTP_USER,
 pass: process.env.SMTP_PASS
 }
});

exports.createVendor = async (req, res) => {
 const v = new Vendor(req.body);
 await v.save();
res.json(v);
};

exports.listVendors = async (req, res) => {
 const vs = await Vendor.find().lean();
 res.json(vs);
};

// function rfpToEmailContent(rfp) {
//  return `
// RFP: ${rfp.title}

// Description:
// ${rfp.description}

// Structured:
// ${JSON.stringify(rfp.structured, null, 2)}

// Please reply to this email with your proposal including price, delivery time, warranty, and any line-item pricing.
// `;
// }



function rfpToEmailContent(rfp) {
    const s = rfp.structured;
    
    // --- Format Line Items ---
    const itemDetails = s.items.map((item, index) => {
        let specsList = '';
        // Convert specs object {key: value} into a formatted string list
        if (item.specs && Object.keys(item.specs).length > 0) {
            specsList = Object.entries(item.specs)
                .map(([key, value]) => `    - ${key}: ${value}`)
                .join('\n');
        }
        
        return `
Item ${index + 1}: ${item.name}
  - Brand/Model: ${item.brand || 'Any'}
  - Quantity: ${item.qty} ${item.unit || 'units'}
  - Specifications:
${specsList || '    - None specified'}
`;
    }).join('\n');

    // --- Assemble the final professional email body ---
    return `
Dear Vendor,

We are issuing this Request for Proposal (RFP) titled: ${rfp.title}


1. SUMMARY & BACKGROUND

${s.summary || 'The full description is available below.'}


2. REQUIRED GOODS/SERVICES

${itemDetails.trim()}


3. KEY COMMERCIAL TERMS


- Estimated Budget: ${s.budget || 'N/A'}
- Required Delivery Time: ${s.delivery_time || 'N/A'}
- Payment Terms: ${s.payment_terms || 'N/A'}
- Warranty Requirement: ${s.warranty || 'N/A'}

---
4. ORIGINAL DESCRIPTION (For reference)

${rfp.description}


5. ACTION REQUIRED

Please submit your detailed proposal by replying to this email. Your proposal MUST include:
1. Total price and currency.
2. Itemized line-item pricing (matching the required goods above).
3. Confirmation of delivery time, payment terms, and warranty.

Thank you.
`;
}

exports.sendRFP = async (req, res) => {
 try {
 let { rfpId, vendorIds } = req.body;
    
    // --- FIX START ---
    // 1. Check if vendorIds is a string that needs parsing (common issue with JSON body parsing)
    if (typeof vendorIds === 'string') {
        try {
            // Attempt to parse the string back into a JavaScript array
            vendorIds = JSON.parse(vendorIds);
        } catch (e) {
            // If parsing fails, log error and return a specific message
            console.error("Failed to parse vendorIds string:", e);
            return res.status(400).json({ error: "Invalid format for vendorIds. Must be an array of IDs." });
        }
    }

    // 2. Ensure vendorIds is an array before proceeding
    if (!Array.isArray(vendorIds)) {
        return res.status(400).json({ error: "vendorIds must be an array." });
    }
    // --- FIX END ---
    
 const rfp = await RFP.findById(rfpId);
 if (!rfp) return res.status(404).json({ error: 'RFP not found' });

 const vendors = await Vendor.find({ _id: { $in: vendorIds } });
 
    if (vendors.length === 0) {
        return res.status(404).json({ error: 'No valid vendors found with the provided IDs.' });
    }
    
    // Sending the emails (rest of the logic remains correct)
 for (const vendor of vendors) {
 await transporter.sendMail({
 from: process.env.FROM_EMAIL,
 to: vendor.email,
 subject: `RFP: ${rfp.title}`,
 text: rfpToEmailContent(rfp),
 });
 }

 // record that we sent to these vendors
    // The vendorIds here is now guaranteed to be a clean array of IDs (or empty)
 rfp.vendorsSent = [...new Set([...(rfp.vendorsSent || []), ...vendorIds])];
 await rfp.save();

 res.json({ ok: true, sentTo: vendors.map(v => v.email) });
 } catch (e) {
 console.error(e);
 // Catching the underlying Mongoose error in case the IDs were malformed (not the JSON string issue)
 res.status(500).json({ error: e.message });
 }
};





exports.getVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id).lean();
        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }
        // Return the vendor data
        res.status(200).json({ success: true, vendor }); 
    } catch (err) {
        console.error("Error fetching vendor:", err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};