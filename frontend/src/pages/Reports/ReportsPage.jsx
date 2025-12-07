import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaChartBar, FaSearch, FaTrophy, FaExclamationTriangle } from 'react-icons/fa';
import { API_PATHS } from '../../utils/apiPaths'; 
import { apiCall } from '../../utils/axiosInstance'; 

const ReportsPage = () => { 
    const [allRfps, setAllRfps] = useState([]); 
    const [selectedRfpId, setSelectedRfpId] = useState(''); 
    const [comparisonData, setComparisonData] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

   
    useEffect(() => {
        const fetchRfpsForDropdown = async () => {
            try {
                
                const responseData = await apiCall('get', API_PATHS.RFP.GET_ALL_RFPS); 
               
                setAllRfps(responseData.rfps || responseData.data || responseData); 
            } catch (err) {
                console.error("Error fetching RFP list for dropdown:", err);
                toast.error("Could not load RFPs for selection (Check /api/rfps backend route).");
                setError("Failed to load RFPs for selection.");
            }
        };
        fetchRfpsForDropdown();
    }, []);

    
    const fetchComparisonReport = async (rfpId) => {
        if (!rfpId) return;

        setLoading(true);
        setComparisonData(null);
        setError(null);

        try {
            
            const responseData = await apiCall(
                'post',
                API_PATHS.RFP.COMPARE_RFPS(rfpId) 
            );

            
            if (responseData.message && responseData.proposals?.length === 0) {
                 toast.error(responseData.message);
                 setComparisonData(responseData);
                 return;
            }

            setComparisonData(responseData);
            toast.success("Comparison Report Generated!");

        } catch (err) {
            const errorMessage = err.message || "Comparison failed. Server error.";
            console.error("Comparison failed:", err);
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    const handleRfpSelection = (e) => {
        const id = e.target.value;
        setSelectedRfpId(id);
        if (id) {
            fetchComparisonReport(id);
        } else {
            setComparisonData(null);
            setError(null);
        }
    };

    const selectedRfpTitle = allRfps.find(r => r._id === selectedRfpId)?.title;
    
    
    const allScoredProposals = comparisonData?.proposals;
    const aiRecommendation = comparisonData?.aiRecommendation;
    
    
    const winningProposal = allScoredProposals?.find(p => p.vendor?._id === aiRecommendation?.winnerVendorId);

    const bestVendor = winningProposal 
        ? {
            
            name: winningProposal.vendor.name, 
            score: winningProposal.score,      
            explanation: aiRecommendation?.explanation 
        }
        : null;

    
    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <FaChartBar className="mr-3 text-indigo-600" /> RFP Comparison Report
            </h2>
            
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex items-center space-x-4">
                <FaSearch className="text-gray-500" />
                <label htmlFor="rfp-select" className="text-lg font-medium text-gray-700">Select RFP:</label>
                <select
                    id="rfp-select"
                    value={selectedRfpId}
                    onChange={handleRfpSelection}
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                    <option value="">-- Choose an RFP --</option>
                    {allRfps.map(rfp => (
                        <option key={rfp._id} value={rfp._id}>
                            {rfp.title}
                        </option>
                    ))}
                </select>
            </div>

            {loading && (
                <div className="p-8 text-center text-lg font-semibold text-indigo-600">Generating report...</div>
            )}

            {error && (
                <div className="p-4 text-center text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
                    <FaExclamationTriangle className="mr-2"/> {error}
                </div>
            )}

           
            {selectedRfpId && comparisonData && (
                <div className="bg-white p-8 rounded-lg shadow-xl">
                    <h3 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-4">
                        Report: {selectedRfpTitle}
                    </h3>

                    
                    {bestVendor ? (
                        <div className="bg-green-100 p-6 rounded-xl border-2 border-green-400 mb-6 flex items-center space-x-4">
                            <FaTrophy className="text-green-600 h-10 w-10 flex-shrink-0" />
                            <div>
                                <p className="text-lg font-medium text-green-700">Recommended Vendor (Best Overall Score):</p>
                                <p className="text-3xl font-bold text-green-900">{bestVendor.name}</p>
                                <p className="text-lg text-green-800 mt-1">Score: {bestVendor.score.toFixed(2)}</p>
                                <p className="text-sm italic text-green-700 mt-2">Reason: {bestVendor.explanation}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 text-center text-yellow-800 bg-yellow-100 rounded-lg">
                            No sufficient proposal data to generate a detailed recommendation.
                        </div>
                    )}
                    
                    
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Detailed Scorecard (Heuristic Scores)</h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Quote</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Time</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allScoredProposals?.map((proposal) => (
                                    <tr key={proposal.vendor?._id || Math.random()} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {proposal.vendor?.name || 'Unnamed Vendor'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
                                            {proposal.score ? proposal.score.toFixed(2) : "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {proposal.parsed?.currency || '$'}{proposal.parsed?.total_price || 'N/A'}
                                        </td> 
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {proposal.parsed?.delivery_time || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!selectedRfpId && !loading && (
                <div className="text-center p-10 bg-white rounded-lg shadow-md">
                    <p className="text-xl text-gray-500">Please select an RFP from the dropdown above to view the vendor comparison report.</p>
                </div>
            )}
        </div>
    );
};

export default ReportsPage;







// import React, { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { FaChartBar, FaSearch, FaTrophy, FaExclamationTriangle } from 'react-icons/fa';

// import { API_PATHS } from '../../utils/apiPaths';
// import { apiCall } from '../../utils/axiosInstance'; 

// const ReportsPage = () => { 
//     const [allRfps, setAllRfps] = useState([]); 
//     const [selectedRfpId, setSelectedRfpId] = useState(''); 
//     const [comparisonData, setComparisonData] = useState(null); 
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     // --- Step 1: Fetch All RFPs for Dropdown ---
//     useEffect(() => {
//         const fetchRfpsForDropdown = async () => {
//             try {
//                 // Ensure the /api/rfps route returns an array of RFP objects with _id and title
//                 const responseData = await apiCall('get', API_PATHS.RFP.GET_ALL_RFPS); 
//                 // Assuming data is an array or nested under a key like 'rfps'
//                 setAllRfps(responseData.rfps || responseData.data || responseData); 
//             } catch (err) {
//                 console.error("Error fetching RFP list for dropdown:", err);
//                 toast.error("Could not load RFPs for selection (Check /api/rfps backend route).");
//                 setError("Failed to load RFPs for selection.");
//             }
//         };
//         fetchRfpsForDropdown();
//     }, []);

//     // --- Step 2: FIXED Comparison Fetcher (Relies ONLY on URL ID) ---
//     const fetchComparisonReport = async (rfpId) => {
//         if (!rfpId) return;

//         setLoading(true);
//         setComparisonData(null);
//         setError(null);

//         try {
//             // THE FIX: Explicitly pass 'undefined' as the payload.
//             // This ensures the POST request sends NO body, aligning with the fixed backend controller.
//             const responseData = await apiCall(
//                 'post',
//                 API_PATHS.RFP.COMPARE_RFPS(rfpId), // ID is in the URL
//                 undefined // Explicitly pass undefined for the request body
//             );

//             // Check for the "No proposals found" scenario handled by the backend
//             if (responseData.message && responseData.proposals?.length === 0) {
//                  toast.error(responseData.message);
//                  setComparisonData(responseData);
//                  return;
//             }

//             setComparisonData(responseData);
//             toast.success("Comparison Report Generated!");

//         } catch (err) {
//             console.error("Comparison failed:", err);
//             // Handle errors like 404/500 from the comparison endpoint
//             setError("Comparison failed. Check console for details.");
//             toast.error("Comparison failed. Server error.");
//         } finally {
//             setLoading(false);
//         }
//     };


//     const handleRfpSelection = (e) => {
//         const id = e.target.value;
//         setSelectedRfpId(id);
//         if (id) {
//             fetchComparisonReport(id);
//         } else {
//             setComparisonData(null);
//             setError(null);
//         }
//     };

//     const selectedRfpTitle = allRfps.find(r => r._id === selectedRfpId)?.title;
    
//     // --- Data Extraction and Preparation based on your backend structure ---
//     const allScoredProposals = comparisonData?.proposals;
//     const aiRecommendation = comparisonData?.aiRecommendation;
    
//     // Determine the winning vendor from the AI recommendation
//     const winningProposal = allScoredProposals?.find(p => p.vendor?._id === aiRecommendation?.winnerVendorId);

//     const bestVendor = winningProposal 
//         ? {
//             // Note: vendor is populated on the Proposal object, giving access to .name
//             name: winningProposal.vendor.name, 
//             score: winningProposal.score,      
//             explanation: aiRecommendation?.explanation 
//         }
//         : null;

//     // --- Render Logic (No changes needed here, only data access consistency) ---
//     return (
//         <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
//             <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
//                 <FaChartBar className="mr-3 text-indigo-600" /> RFP Comparison Report
//             </h2>
            
//             {/* RFP Selection Dropdown */}
//             <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex items-center space-x-4">
//                 <FaSearch className="text-gray-500" />
//                 <label htmlFor="rfp-select" className="text-lg font-medium text-gray-700">Select RFP:</label>
//                 <select
//                     id="rfp-select"
//                     value={selectedRfpId}
//                     onChange={handleRfpSelection}
//                     className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
//                 >
//                     <option value="">-- Choose an RFP --</option>
//                     {allRfps.map(rfp => (
//                         <option key={rfp._id} value={rfp._id}>
//                             {rfp.title}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             {loading && (
//                 <div className="p-8 text-center text-lg font-semibold text-indigo-600">Generating report...</div>
//             )}

//             {error && (
//                 <div className="p-4 text-center text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
//                     <FaExclamationTriangle className="mr-2"/> {error}
//                 </div>
//             )}

//             {/* Display Comparison Data */}
//             {selectedRfpId && comparisonData && (
//                 <div className="bg-white p-8 rounded-lg shadow-xl">
//                     <h3 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-4">
//                         Report: {selectedRfpTitle}
//                     </h3>

//                     {/* Best Vendor Highlight */}
//                     {bestVendor ? (
//                         <div className="bg-green-100 p-6 rounded-xl border-2 border-green-400 mb-6 flex items-center space-x-4">
//                             <FaTrophy className="text-green-600 h-10 w-10 flex-shrink-0" />
//                             <div>
//                                 <p className="text-lg font-medium text-green-700">Recommended Vendor (Best Overall Score):</p>
//                                 <p className="text-3xl font-bold text-green-900">{bestVendor.name}</p>
//                                 <p className="text-lg text-green-800 mt-1">Score: {bestVendor.score.toFixed(2)}</p>
//                                 <p className="text-sm italic text-green-700 mt-2">Reason: {bestVendor.explanation}</p>
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="p-4 text-center text-yellow-800 bg-yellow-100 rounded-lg">
//                             No sufficient proposal data to generate a detailed recommendation.
//                         </div>
//                     )}
                    
//                     {/* Detailed Scorecard Table */}
//                     <h4 className="text-xl font-semibold text-gray-800 mb-4">Detailed Scorecard (Heuristic Scores)</h4>
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Quote</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Time</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {allScoredProposals?.map((proposal) => (
//                                     <tr key={proposal.vendor?._id || Math.random()} className="hover:bg-gray-50">
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                             {proposal.vendor?.name || 'Unnamed Vendor'}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
//                                             {proposal.score ? proposal.score.toFixed(2) : "N/A"}

//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                             {proposal.parsed?.currency || '$'}{proposal.parsed?.total_price || 'N/A'}
//                                         </td> 
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                             {proposal.parsed?.delivery_time || 'N/A'}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             )}

//             {!selectedRfpId && !loading && (
//                 <div className="text-center p-10 bg-white rounded-lg shadow-md">
//                     <p className="text-xl text-gray-500">Please select an RFP from the dropdown above to view the vendor comparison report.</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ReportsPage;