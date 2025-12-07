import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { API_PATHS } from '../../utils/apiPaths';
import { apiCall } from '../../utils/axiosInstance'; 

const NewRFPPage = () => {
    
    const [nlText, setNlText] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!nlText.trim()) {
            toast.error("Please paste the RFP text into the editor.");
            return;
        }

        setLoading(true);
        
        try {
           
            const response = await apiCall('post', API_PATHS.RFP.CREATE_RFPS, {
                nlText: nlText.trim()
            });
            
            toast.success("RFP Text Submitted and Analysis Started!");
            
         
            const newRfpId = response.data?._id; 
            
            if (newRfpId) {
                
                navigate(`/rfp-list/${newRfpId}`);
            } else {
                 throw new Error("RFP ID not found in response.");
            }

        } catch (error) {
            console.error('RFP creation failed:', error);
           
            toast.error(`Failed to create RFP. ${error.response?.data?.error || error.message || 'Server error.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaEdit className="mr-3 text-indigo-600" /> Enter New RFP Text
            </h2>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl">
                
                
                <p className="text-gray-600 mb-6 border-l-4 border-indigo-400 pl-3 py-1 bg-indigo-50">
                    Paste the entire text content of your Request for Proposal (RFP) below. 
                    The system will analyze the text and extract structured data.
                </p>

                
                <div className="mb-6">
                    <label htmlFor="rfp-text" className="block text-sm font-medium text-gray-700 mb-2">
                        RFP Document Text
                    </label>
                    <textarea
                        id="rfp-text"
                        rows="15"
                        value={nlText}
                        onChange={(e) => setNlText(e.target.value)}
                        placeholder="Paste the full RFP document text here..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm"
                        required
                    />
                </div>

               
                <div className="pt-5">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                            loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150`}
                    >
                        {loading ? (
                            'Analyzing and Creating RFP...'
                        ) : (
                            <>
                                <FaPaperPlane className="mr-2 h-4 w-4" />
                                Submit RFP Text for Analysis
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewRFPPage;