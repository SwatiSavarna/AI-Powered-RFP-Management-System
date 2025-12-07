import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaFileAlt } from 'react-icons/fa';
import { API_PATHS } from '../../utils/apiPaths';
import { apiCall } from '../../utils/axiosInstance';

const ProposalListPage = () => {
    const { rfpId } = useParams();
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        if (!rfpId) {
            setError("No RFP ID specified.");
            setLoading(false);
            return;
        }

        const fetchProposals = async () => {
            try {
                const responseData = await apiCall('get', API_PATHS.RFP.GET_PROPOSALS_FOR_RFPS(rfpId));
                setProposals(responseData.proposals || responseData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching proposals:", err);
                setError("Failed to load vendor proposals.");
                toast.error("Could not fetch proposals.");
                setLoading(false);
            }
        };

        fetchProposals();
    }, [rfpId]);

    if (loading) {
        return <div className="p-8 text-center text-lg font-semibold text-gray-600">Loading Proposals...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600">{error}</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Vendor Proposals for RFP: {rfpId}</h2>

            {proposals.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-lg shadow-md">
                    <p className="text-xl text-gray-500 mb-4">No proposals received yet for this RFP.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {proposals.map((proposal) => (
                        <div key={proposal._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center hover:shadow-lg transition duration-200">
                            <div className="flex items-center">
                                <FaFileAlt className="text-indigo-500 mr-4 h-6 w-6" />
                                <div>
                                    <p className="font-semibold text-gray-900">{proposal.vendor?.name || proposal.vendorName || 'Unnamed Vendor'}</p>
                                   
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(`/rfp-list/${rfpId}/proposals/${proposal._id}`)}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-1.5 px-3 rounded text-sm transition"
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProposalListPage;