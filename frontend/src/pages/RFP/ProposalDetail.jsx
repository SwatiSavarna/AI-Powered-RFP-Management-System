import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaMoneyBillWave, FaTruck, FaClock, FaClipboardList } from 'react-icons/fa';
import { API_PATHS } from '../../utils/apiPaths';
import { apiCall } from '../../utils/axiosInstance';

const ProposalDetail = () => {
    const { rfpId, proposalId } = useParams();
    const [proposal, setProposal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!proposalId) {
            setError("No Proposal ID provided.");
            setLoading(false);
            return;
        }

        const fetchProposal = async () => {
            try {

                const responseData = await apiCall('get', API_PATHS.PROPOSALS.GET_PROPOSAL(proposalId));
                setProposal(responseData.proposal);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching proposal details:", err);
                setError("Failed to load proposal details.");
                toast.error("Could not fetch proposal.");
                setLoading(false);
            }
        };

        fetchProposal();
    }, [proposalId]);

    if (loading) return <div className="p-8 text-center text-lg font-semibold text-gray-600">Loading Proposal...</div>;
    if (error) return <div className="p-8 text-center text-red-600 font-medium">{error}</div>;
    if (!proposal) return <div className="p-8 text-center text-gray-600">Proposal not found.</div>;


    const vendorName = proposal.vendor?.name || 'Unknown Vendor';
    const parsedData = proposal.parsed || {};
    const totalPrice = parsedData.total_price ? `${parsedData.currency || '$'}${parsedData.total_price}` : 'N/A';

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Proposal from {vendorName}</h1>
            <p className="text-gray-500 mb-6">Submitted for RFP ID: {rfpId}</p>

            <div className="bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-semibold text-indigo-600 mb-4 border-b pb-2 flex items-center">
                    <FaClipboardList className="mr-2" /> Summary & Financials
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                        <p className="text-sm font-medium text-green-700 flex items-center mb-1"><FaMoneyBillWave className="mr-2" /> Total Quote</p>
                        <p className="text-3xl font-bold text-green-900">{totalPrice}</p>
                    </div>


                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                        <p className="text-sm font-medium text-blue-700 flex items-center mb-1"><FaTruck className="mr-2" /> Delivery Time</p>
                        <p className="text-xl font-semibold text-blue-900">{parsedData.delivery_time || 'Not specified'}</p>
                    </div>


                    <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                        <p className="text-sm font-medium text-yellow-700 flex items-center mb-1"><FaClock className="mr-2" /> Payment Terms</p>
                        <p className="text-xl font-semibold text-yellow-900">{parsedData.payment_terms || 'N/A'}</p>
                    </div>


                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                        <p className="text-sm font-medium text-gray-700 flex items-center mb-1">Warranty</p>
                        <p className="text-xl font-semibold text-gray-900">{parsedData.warranty || 'None provided'}</p>
                    </div>
                </div>



                <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Vendor Notes</h3>
                <p className="text-gray-700 italic border p-3 rounded-lg">{parsedData.notes || 'No specific notes were included in the proposal.'}</p>
            </div>
        </div>
    );
};

export default ProposalDetail;