import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_PATHS } from '../../utils/apiPaths';
import { apiCall } from '../../utils/axiosInstance';
import { Plus, Send, Mail, User, Phone, Clipboard, Loader2 } from 'lucide-react';
import VendorForm from '../../components/Vendors/VendorForm';
import SendRFPModal from '../../components/Vendors/SendRFPModal';

const VendorsPage = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSendRFPModalOpen, setIsSendRFPModalOpen] = useState(false);

    const navigate = useNavigate();


    const fetchVendors = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiCall('get', API_PATHS.VENDORS.GET_ALL_VENDORS);
            setVendors(data.vendors || data);
        } catch (error) {
            toast.error("Failed to load vendors.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVendors();
    }, [fetchVendors]);


    const handleVendorCreated = (newVendor) => {
        setVendors(prev => [...prev, newVendor]);
    };

    const handleRFPModalClose = () => {
        setIsSendRFPModalOpen(false);
    }


    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="ml-3 text-lg text-gray-600">Loading Vendors...</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Vendor Management</h1>


                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                    <button
                        onClick={() => setIsSendRFPModalOpen(true)}
                        className="flex items-center justify-center px-4 py-2 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 transition w-full sm:w-auto"
                    >
                        <Send size={18} className="mr-2" />
                        Send RFP
                    </button>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition w-full sm:w-auto"
                    >
                        <Plus size={18} className="mr-2" />
                        Add Vendor
                    </button>
                </div>
            </header>


            <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
                {vendors.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        <User size={48} className="mx-auto mb-3" />
                        <p>No vendors found. Click 'Add Vendor' to get started.</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {vendors.map((vendor) => (
                                <tr key={vendor._id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                                        <User size={16} className="mr-2 text-indigo-500" />
                                        {vendor.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Mail size={16} className="inline mr-2 text-red-400" />
                                        {vendor.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Phone size={16} className="inline mr-2 text-blue-400" />
                                        {vendor.contact || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                                        <Clipboard size={16} className="inline mr-2 text-yellow-500" />
                                        {vendor.notes || 'None'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => navigate(`/vendors/${vendor._id}`)}
                                            className="text-indigo-600 hover:text-indigo-900 transition"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>


            <VendorForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onVendorCreated={handleVendorCreated}
            />

            <SendRFPModal
                isOpen={isSendRFPModalOpen}
                onClose={handleRFPModalClose}
                vendors={vendors}
            />
        </div>
    );
};

export default VendorsPage;