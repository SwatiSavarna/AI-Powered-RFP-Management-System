import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { API_PATHS } from '../../utils/apiPaths';
import { apiCall } from '../../utils/axiosInstance';
import { X } from 'lucide-react';

const VendorForm = ({ isOpen, onClose, onVendorCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        notes: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const newVendor = await apiCall('post', API_PATHS.VENDORS.CREATE_VENDORS, formData);
            toast.success(`${newVendor.name} added successfully!`);
            onVendorCreated(newVendor); 
            onClose(); 
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to create vendor.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Add New Vendor</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input label="Name" name="name" value={formData.name} onChange={handleChange} required />
                        <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                        <Input label="Contact Person/Number" name="contact" value={formData.contact} onChange={handleChange} />
                        <TextArea label="Notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition ${
                                isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {isLoading ? 'Saving...' : 'Create Vendor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const Input = ({ label, name, type = 'text', value, onChange, required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500">*</span>}</label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
    </div>
);

const TextArea = ({ label, name, value, onChange, rows }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
    </div>
);


export default VendorForm;