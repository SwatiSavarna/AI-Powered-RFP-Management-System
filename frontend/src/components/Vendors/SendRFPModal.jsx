import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_PATHS } from '../../utils/apiPaths';
import { apiCall } from '../../utils/axiosInstance';
import { Mail, Clipboard, X, Send, Loader2 } from 'lucide-react';


const ModalWrapper = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};


const SendRFPModal = ({ isOpen, onClose, vendors }) => {
   
    const [rfpOptions, setRfpOptions] = useState([]); 
    
    const [selectedRfpId, setSelectedRfpId] = useState('');
    const [selectedVendorIds, setSelectedVendorIds] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [rfpLoading, setRfpLoading] = useState(false);


   
    useEffect(() => {
        if (!isOpen) {
          
            setSelectedRfpId('');
            setSelectedVendorIds([]);
            setRfpOptions([]);
            return;
        }

        const fetchRfps = async () => {
            setRfpLoading(true);
            try {
                const data = await apiCall('get', API_PATHS.RFP.GET_ALL_RFPS);
               
                const rfpsArray = Array.isArray(data) ? data : data.rfps || data.data || [];
                
             
                setRfpOptions(rfpsArray); 
                
                if (rfpsArray.length > 0) {
                    setSelectedRfpId(rfpsArray[0]._id);
                }
            } catch (error) {
                toast.error("Failed to load RFPs.");
            } finally {
                setRfpLoading(false);
            }
        };

        fetchRfps();
    }, [isOpen]); 


    const handleVendorToggle = (vendorId) => {
        setSelectedVendorIds(prev =>
            prev.includes(vendorId)
                ? prev.filter(id => id !== vendorId)
                : [...prev, vendorId]
        );
    };

    const handleSendRFP = async () => {
        if (!selectedRfpId || selectedVendorIds.length === 0) {
            return toast.error("Please select an RFP and at least one vendor.");
        }

        setLoading(true);
        try {
            const payload = {
                rfpId: selectedRfpId,
                vendorIds: selectedVendorIds,
            };

            
            const response = await apiCall('post', API_PATHS.VENDORS.SEND_RFPS, payload);

            toast.success(response.message || "RFP successfully sent!");
            onClose(); 
        } catch (error) {
            console.error("Error sending RFP:", error);
            toast.error(error.message || "Failed to send RFP. Check server logs.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} title="Send RFP to Vendors">
            <div className="space-y-6">

                
                <div>
                    <label htmlFor="rfp-select" className="block text-sm font-medium text-gray-700 mb-1">
                        <Clipboard size={16} className="inline mr-1 text-indigo-500" /> Select RFP:
                    </label>
                    {rfpLoading ? (
                        <div className="flex items-center text-gray-500">
                            <Loader2 size={16} className="animate-spin mr-2" /> Loading RFPs...
                        </div>
                    ) : rfpOptions.length === 0 ? (
                        <p className="text-red-500 text-sm">No RFPs available. Please create one first.</p>
                    ) : (
                        <select
                            id="rfp-select"
                            value={selectedRfpId}
                            onChange={(e) => setSelectedRfpId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={loading}
                        >
                            
                            {rfpOptions.map((rfp) => ( 
                                <option key={rfp._id} value={rfp._id}>
                                    {rfp.title}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

               
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail size={16} className="inline mr-1 text-green-500" /> Select Vendors ({selectedVendorIds.length} selected):
                    </label>
                    <div className="max-h-40 overflow-y-auto border p-3 rounded-lg bg-gray-50">
                        {vendors.length === 0 ? (
                             <p className="text-sm text-gray-500">No vendors found.</p>
                        ) : (
                            vendors.map((vendor) => (
                                <div key={vendor._id} className="flex items-center justify-between py-1 border-b last:border-b-0">
                                    <span className="text-sm text-gray-800">{vendor.name} ({vendor.email})</span>
                                    <input
                                        type="checkbox"
                                        checked={selectedVendorIds.includes(vendor._id)}
                                        onChange={() => handleVendorToggle(vendor._id)}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        disabled={loading}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>

               
                <button
                    onClick={handleSendRFP}
                    className={`w-full flex items-center justify-center px-4 py-2 text-white font-medium rounded-lg shadow-md transition ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    disabled={loading || rfpOptions.length === 0}
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin mr-2" /> Sending...
                        </>
                    ) : (
                        <>
                            <Send size={18} className="mr-2" /> Send RFP Email
                        </>
                    )}
                </button>
            </div>
        </ModalWrapper>
    );
};

export default SendRFPModal;