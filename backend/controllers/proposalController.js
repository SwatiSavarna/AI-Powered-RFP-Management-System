const Proposal = require('../models/Proposal'); 

exports.getProposalById = async (req, res) => {
    try {
        const proposalId = req.params.id;
        
       
        const proposal = await Proposal.findById(proposalId)
                                       .populate('vendor') 
                                       .populate('rfp')    
                                       .lean();

        if (!proposal) {
            return res.status(404).json({ success: false, message: 'Proposal not found' });
        }

        res.status(200).json({ success: true, proposal: proposal });

    } catch (error) {
        console.error("Error fetching proposal:", error);
        res.status(500).json({ success: false, message: 'Server error while fetching proposal', error: error.message });
    }
};