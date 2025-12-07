import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { API_PATHS } from '../../utils/apiPaths';
import { apiCall } from '../../utils/axiosInstance';
import { formatDate } from '../../utils/dateUtils';


const RFPListPage = () => {
    const [rfps, setRfps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchRfps = async () => {
            try {

                const responseData = await apiCall('get', API_PATHS.RFP.GET_ALL_RFPS);
                setRfps(responseData.rfps || responseData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching RFPs:", err);
                const errorMessage = err.response?.data?.message || "Failed to load RFP list. Please try again.";
                setError(errorMessage);
                toast.error("Could not fetch RFPs.");
                setLoading(false);
            }
        };

        fetchRfps();
    }, []);


    const handleViewRFP = (id) => {
        navigate(`/rfp-list/${id}`);
    };

    const handleNewRFP = () => {
        navigate('/rfp-list/new');
    };


    if (loading) {
        return (
            <div className="p-6 text-center text-lg font-semibold text-gray-600">
                Loading RFPs...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-600 font-medium border border-red-200 bg-red-50 rounded-lg">
                Error: {error}
            </div>
        );
    }


    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">RFP List</h2>
                <button
                    onClick={handleNewRFP}
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150"
                >
                    <FaPlus className="mr-2" />
                    New RFP
                </button>
            </div>

            {rfps.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-lg shadow-md">
                    <p className="text-xl text-gray-500 mb-4">No RFPs found.</p>
                    <p className="text-gray-400">Click 'New RFP' to create your first Request for Proposal.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {rfps.map((rfp) => (
                                <tr key={rfp._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rfp.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rfp.status === 'Open' ? 'bg-green-100 text-green-800' :
                                                rfp.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {rfp.status}
                                        </span>
                                    </td>
                                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate ? formatDate(rfp.dueDate) : new Date(rfp.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rfp.createdBy || 'Admin'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleViewRFP(rfp._id)}
                                            className="text-indigo-600 hover:text-indigo-900 ml-3 transition duration-150"
                                            title="View Details"
                                        >
                                            <FaEye className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RFPListPage;