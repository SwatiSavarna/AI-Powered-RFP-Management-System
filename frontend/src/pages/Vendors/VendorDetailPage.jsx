import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUserCircle, FaEnvelope, FaPhone, FaFileAlt } from 'react-icons/fa';
import { API_PATHS } from '../../utils/apiPaths';
import { apiCall } from '../../utils/axiosInstance'; 

const VendorDetailPage = () => {
    const { id } = useParams(); 
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setError("No Vendor ID specified.");
            setLoading(false);
            return;
        }

        const fetchVendor = async () => {
            try {
                
                const responseData = await apiCall('get', API_PATHS.VENDORS.GET_VENDOR(id)); 
                setVendor(responseData.vendor || responseData); 
                setLoading(false);
            } catch (err) {
                console.error("Error fetching vendor details:", err);
                setError("Failed to load vendor details.");
                toast.error("Could not fetch vendor details.");
                setLoading(false);
            }
        };

        fetchVendor();
    }, [id]); 

    if (loading) {
        return <div className="p-8 text-center text-lg font-semibold text-gray-600">Loading Vendor Details...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600">{error}</div>;
    }
    
    
    if (!vendor) {
         return <div className="p-8 text-center text-gray-600">Vendor not found.</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <FaUserCircle className="mr-3 text-indigo-600" /> Vendor Details: {vendor.name}
            </h2>
            
            <div className="bg-white p-6 rounded-lg shadow-xl space-y-4">
                
                <div className="border p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 mb-1">Contact Information</p>
                    <div className="space-y-2">
                        <p className="flex items-center text-lg font-semibold text-gray-800">
                            <FaEnvelope className="mr-2 text-indigo-500"/> {vendor.email || 'N/A'}
                        </p>
                        <p className="flex items-center text-lg font-semibold text-gray-800">
                            <FaPhone className="mr-2 text-indigo-500"/> {vendor.contact || 'N/A'}
                        </p>
                    </div>
                </div>

                
                <div className="border p-4 rounded-lg bg-gray-50">
                    <p className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                        <FaFileAlt className="mr-2"/> Notes
                    </p>
                    <p className="text-gray-700 italic">{vendor.notes || 'No notes available for this vendor.'}</p>
                </div>
                
              

            </div>

        </div>
    );
};

export default VendorDetailPage;