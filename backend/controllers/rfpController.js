const RFP = require('../models/RFP');
const client = require('../libs/ollamaClient');
const { runModel,generateRFPResponse } = require("../libs/ollamaClient");

async function extractStructuredRFP(nlText) {
    const prompt = `
You are an information extraction system. Parse the RFP text and extract structured data.

TEXT:
"""${nlText}"""

Return JSON strictly in this format:

{
"title": "Short, descriptive title",
"client": null,
"items": [
 {
 "name": "Generic Product Type (e.g., Laptops, Monitors)",
 "brand": "Specific Brand (e.g., HP, Dell)",
 "qty": 0,
 "unit": "pieces",
 "specs": {
"ram": "16GB",
 "display_size": "15 inch", 
 "other_specific_key": "value" 
 }
 }
],
"delivery_time": "10 days",
"budget": "100000",
"payment_terms": "Net 30",
"warranty": "3 years",
"summary": "Concise summary of the RFP"
}

RULES:
- Return valid JSON only, no comments or extra text.
- Always use double quotes.
- If value not found, use the JSON 'null' keyword. **(CRITICAL: DO NOT insert explanatory phrases or notes, use null)**
- The "name" field should be the generic product type (e.g., "Laptops", "Monitors").
- The "brand" field should capture specific brands (e.g., "HP", "Dell"). Use 'null' if no brand is mentioned.
- The "specs" object must be a flexible map for all quantifiable attributes (e.g., RAM, screen size, resolution, processor).
- Extract multiple items if mentioned.
- "items" must be an array.
`;

    
    const output = await runModel(prompt);

 
    let cleanOutput = output.trim();
    
   
    cleanOutput = cleanOutput.replace(/```json\s*|```/g, '').trim();

  
    cleanOutput = cleanOutput.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '').trim();
    
    
    cleanOutput = cleanOutput.replace(/,\s*([\]}])/g, '$1');
    
 
    const match = cleanOutput.match(/\{[\s\S]*\}/);
    if (match) {
        cleanOutput = match[0];
    } else {
        return { error: "JSON block not found in response after cleaning", raw: output };
    }
    

    try {
        
        return JSON.parse(cleanOutput);
    } catch (e) {
        
        console.error("Final JSON Parsing Failed:", e.message, "\nCleaned Output Was:\n", cleanOutput, "\nRaw Output Was:\n", output);
        return { error: "Final JSON parsing failed", raw: output, clean: cleanOutput };
    }
}


exports.createRFP = async (req, res) => {
try {
 const { nlText } = req.body;
 if (!nlText) return res.status(400).json({ error: "nlText required" });

 const aiResponse = await extractStructuredRFP(nlText);

 if (aiResponse.error) 
 return res.status(500).json({ error: "AI extraction failed", details: aiResponse });

 const {
 title,
 client,
 summary,
 budget,
 delivery_time,
payment_terms,
 warranty,
items
 } = aiResponse;

 
 const structuredItems = items ? items.map(item => ({
 name: item.name, 
        brand: item.brand, 
 qty: item.qty,
 unit: item.unit,
 specs: item.specs || null 
 })) : [];


 const rfp = new RFP({
 title: title || nlText.slice(0, 60),
 description: nlText,
 structured: {
 client,
summary,
 budget,
 delivery_time,
 payment_terms,
 warranty,
 items: structuredItems 
 }
 });

 await rfp.save();
 return res.json({ success: true, data: rfp });

} catch (err) {
console.log(err);
 return res.status(500).json({ error: err.message });
}
};


exports.getRFP = async (req, res) => {
const rfp = await RFP.findById(req.params.id).populate('vendorsSent').lean();
if (!rfp) return res.status(404).json({ error: 'not found' });
res.json(rfp);
};




exports.listAllRFPs = async (req, res) => {
    try {
        const rfps = await RFP.find({}); 
        res.status(200).json({ 
            success: true, 
            rfps 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching RFPs", error: error.message });
    }
};

