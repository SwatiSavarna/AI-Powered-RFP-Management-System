import React, { useState, useEffect } from 'react';
import { FileText, Users, Send, BarChart2, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_PATHS } from '../../utils/apiPaths';
import { apiCall } from '../../utils/axiosInstance';

const DASHBOARD_API_PATHS = {
    GET_SUMMARY: '/api/dashboard/summary',
};


const Dashboard = () => {
    const [summaryData, setSummaryData] = useState({
        totalRFPs: 0,
        activeVendors: 0,
        rfpsSentLastMonth: 0,
        comparisonReady: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const data = await apiCall('get', DASHBOARD_API_PATHS.GET_SUMMARY);
                
               
                setSummaryData({
                    totalRFPs: data.totalRFPs,
                    activeVendors: data.activeVendors,
                    rfpsSentLastMonth: data.rfpsSentLastMonth,
                    comparisonReady: data.comparisonReady,
                });

            } catch (error) {
                console.error("Failed to fetch dashboard summary:", error);
                toast.error("Could not load dashboard data. Please check the API.");
                
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []); 

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="ml-3 text-lg text-gray-600">Loading Dashboard Data...</p>
            </div>
        );
    }
    
    
    const { totalRFPs, activeVendors, rfpsSentLastMonth, comparisonReady } = summaryData;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">
                RFP Management Overview
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                
                
                <DashboardCard 
                    icon={FileText}
                    title="Total RFPs"
                    value={totalRFPs} 
                    description="Total requests created."
                    color="bg-indigo-500"
                />

                
                <DashboardCard 
                    icon={Users}
                    title="Active Vendors"
                    value={activeVendors} 
                    description="Vendors available for contact."
                    color="bg-green-500"
                />

               
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Quick Actions</h2>
                <div className="bg-white p-6 pt-1 rounded-lg shadow-lg">
                    <ul className="mt-4 space-y-2 text-indigo-600 font-medium">
                        <li><a href="/rfp-list/new" className="hover:underline flex items-center"><Plus size={18} className="mr-2"/> Create a New RFP</a></li>
                        <li><a href="/rfp-list" className="hover:underline flex items-center"><FileText size={18} className="mr-2"/> View All Active RFPs</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

// Reusable Dashboard Card Component (remains the same)
const DashboardCard = ({ icon: Icon, title, value, description, color }) => (
    <div className={`p-5 rounded-xl text-white shadow-xl ${color} transition duration-300 hover:shadow-2xl`}>
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{title}</h3>
            <Icon size={24} className="opacity-70" />
        </div>
        <p className="text-4xl font-bold mt-2">{value}</p>
        <p className="text-sm opacity-90 mt-1">{description}</p>
    </div>
);

export default Dashboard;