const Proposal = require('../models/Proposal');
const RFP = require('../models/RFP');
const { runModel } = require('../libs/ollamaClient'); 




function scoreValue(required, offered, weight = 1) {
    
    if (!required || !offered) return 1 * weight;
    const numRequired = Number(required);
    const numOffered = Number(offered);
    if (isNaN(numRequired) || isNaN(numOffered)) return 1 * weight;
    
    
    const diff = numOffered - numRequired; 

    if (diff <= 0) return 5 * weight; 
    if (diff <= 0.05 * numRequired) return 4 * weight; 
    if (diff <= 0.10 * numRequired) return 3 * weight; 
    if (diff <= 0.20 * numRequired) return 2 * weight; 
    return 1 * weight; // Much higher
}


function scoreDelivery(requiredDays, offeredDays) {
    
    if(!offeredDays) return 1;
    const numRequiredDays = Number(requiredDays);
    const numOfferedDays = Number(offeredDays);
    if (isNaN(numRequiredDays) || isNaN(numOfferedDays)) return 1;

    const d = numOfferedDays - numRequiredDays; 

    if(d<=0) return 5; 
    if(d<=3) return 4;
    if(d<=7) return 3;
    if(d<=14) return 2;
    return 1;
}

function scoreItemMatch(rfpItems = [], proposalItems = []) {
   
    if(!Array.isArray(rfpItems) || !Array.isArray(proposalItems)) return 1;

    const req = rfpItems.map(a=>a.name?.toLowerCase()).filter(Boolean);
    const off = proposalItems.map(a=>a.name?.toLowerCase()).filter(Boolean);

    const matches = req.filter(x=>off.includes(x)).length;
    const missing = req.length - matches;
    
   
    return [5,4,3,2,1][Math.min(missing,4)]; 
}



function calculateProposalScore(rfp, proposal) {
   
    const rfpStruct = rfp.structured || rfp; 

    return {
        vendor: proposal.vendor, 
        
        priceScore: scoreValue(rfpStruct.budget, proposal.parsed?.total_price), 
        
        deliveryScore: scoreDelivery(rfpStruct.delivery_time, proposal.parsed?.delivery_time),
       
        warrantyScore: scoreValue(rfpStruct.warrantyMonths, proposal.warrantyMonths), 
       
        itemScore: scoreItemMatch(rfpStruct.items, proposal.parsed?.line_items) 
    };
}




async function askRecommendation(rfp, scores){
    const prompt = `
Evaluate vendors based on the following scores (1-5, higher = better).
The goal is to recommend the best vendor.
RFP Requirements: ${JSON.stringify(rfp.structured || rfp)}
Vendor Scores: ${JSON.stringify(scores)}

Suggest the single best vendor strictly in valid JSON format.
Return **ONLY** valid JSON:
{
 "winnerVendorId": "Vendor's unique ID from the scores array (e.g., '60c72b12f91b8d0015a9b7a4')",
 "explanation": "A brief, compelling reason based on the provided scores.",
 "scoreOutof5": "The average score (1-5) of the winning proposal."
}
`;

    const ai = await runModel(prompt);
    
    try { 
        
        return JSON.parse(ai); 
    } catch {}

    
    const match = ai?.match(/\{[\s\S]*\}/);
    if(match) {
        try {
            return JSON.parse(match[0]);
        } catch(e) {
            console.error("Failed to parse extracted JSON block:", e);
        }
    }
    
    const best = scores.sort((a,b)=>{
      
        const scoreA = (a.priceScore+a.deliveryScore+a.warrantyScore+a.itemScore) / 4;
        const scoreB = (b.priceScore+b.deliveryScore+b.warrantyScore+b.itemScore) / 4;
        return scoreB - scoreA; 
    })[0];

   
    if (best) {
        return {
            winnerVendorId: best.vendor?._id || best.vendor,
            explanation:`AI Fallback — Highest average score vendor selected.`,
            scoreOutof5: best.score.toFixed(2) 
        };
    }

    return { winnerVendorId: null, explanation: "No scores available.", scoreOutof5: "N/A" };
}



async function evaluateVendors(req, res) {
    try {
        
        const rfpId = req.params.id; 

       
        const rfp = await RFP.findById(rfpId).lean();
      
        const proposals = await Proposal.find({ rfp: rfpId }).populate('vendor').lean(); 

        if (!rfp) {
            return res.status(404).json({ message: "RFP not found." });
        }
        if (proposals.length === 0) {
            
            return res.status(200).json({ 
                message: "No proposals found for this RFP. Cannot compare.",
                proposals: [],
                aiRecommendation: { winnerVendorId: null, explanation: "No proposals to evaluate.", scoreOutof5: "N/A" } 
            });
        }

       
        const scored = proposals.map(p => {
            const s = calculateProposalScore(rfp, p);
        
            s.score = Number(((s.priceScore + s.deliveryScore + s.warrantyScore + s.itemScore) / 4).toFixed(2));
            return s;
        });

        
        const ai = await askRecommendation(rfp, scored);

        return res.json({
            proposals: scored,
            aiRecommendation: ai
        });

    } catch (e) {
        console.error("🚫 Evaluate Vendors Error:", e);
        return res.status(500).json({ message: "Server error" });
    }
}


async function listProposalsForRFP(req, res) {
    const proposals = await Proposal.find({ rfp: req.params.id }).populate('vendor').lean();
    res.json(proposals);
};


module.exports = { evaluateVendors, listProposalsForRFP };