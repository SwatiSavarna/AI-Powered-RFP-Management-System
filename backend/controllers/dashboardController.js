

const RFP = require('../models/RFP'); 
const Vendor = require('../models/Vendor'); 


exports.getDashboardSummary = async (req, res) => {
    try {
       
        const totalRFPs = await RFP.countDocuments();

      
        const activeVendors = await Vendor.countDocuments();

      
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    
        const rfpsSentLastMonth = await RFP.countDocuments({
         
            updatedAt: { $gte: oneMonthAgo } 
        });


       
        const comparisonReady = await RFP.countDocuments({
           
            proposals: { $exists: true, $not: { $size: 0 } } 
        });

        
        res.json({
            totalRFPs: totalRFPs,
            activeVendors: activeVendors,
            rfpsSentLastMonth: rfpsSentLastMonth,
            comparisonReady: comparisonReady,
        });

    } catch (error) {
        console.error("Error fetching dashboard summary:", error);
        res.status(500).json({ error: "Failed to fetch dashboard summary data." });
    }
};