import React, { useState, useEffect, } from 'react';
import { FaCalendarAlt, FaTag, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import { apiCall } from '../../utils/axiosInstance';
import { formatDate } from '../../utils/dateUtils';

const RFPDetail = () => {
    const { id } = useParams();
    const [rfp, setRfp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            setError("No RFP ID provided.");
            setLoading(false);
            return;
        }

        const fetchRFP = async () => {
            try {


                const responseData = await apiCall('get', API_PATHS.RFP.GET_RFP(id));


                setRfp(responseData.rfp || responseData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching RFP details:", err);
                setError(`Failed to load RFP ${id}.`);
                toast.error("Could not fetch RFP details.");
                setLoading(false);
            }
        };

        fetchRFP();
    }, [id]);

    if (loading) {
        return <div className="p-8 text-center text-lg font-semibold text-gray-600">Loading RFP details...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600 font-medium border border-red-200 bg-red-50 rounded-lg max-w-md mx-auto">{error}</div>;
    }

    if (!rfp) {
        return <div className="p-8 text-center text-gray-600">RFP not found.</div>;
    }


    const getStatusColor = (status) => {
        if (status === 'Open') return 'bg-green-100 text-green-800';
        if (status === 'In Review') return 'bg-yellow-100 text-yellow-800';
        if (status === 'Closed') return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{rfp.title}</h1>

            <div className="bg-white p-6 rounded-lg shadow-xl">

                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">RFP Overview</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                    {rfp.description || 'No detailed description available. View the analysis results below.'}
                </p>


                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2"> Proposals</h2>
                <p className="text-gray-500 italic">

                </p>

                <div className="mt-4">
                    <button
                        onClick={() => navigate(`/rfp-list/${id}/proposals`)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        View Vendor Proposals &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RFPDetail;