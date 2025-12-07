import React, { useState } from 'react'; 
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Plus, Users, BarChart2, Menu, X } from "lucide-react"; 

export const NAVIGATION_MENU = [
    { id: "dashboard", path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "rfp-list", path: "/rfp-list", name: "RFP List", icon: FileText },
    { id: "rfp-list/new", path: "/rfp-list/new", name: "New RFP", icon: Plus },
    { id: "vendors", path: "/vendors", name: "Vendors", icon: Users },
    { id: "reports", path: "/reports", name: "Reports", icon: BarChart2 },
];

const Sidebar = () => {
    
    const [isMobileOpen, setIsMobileOpen] = useState(false); 

    const toggleSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    return (
        <>
           
            <div className="sm:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                    aria-label="Toggle navigation"
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            
            <div 
                className={`
                    flex flex-col w-64 h-full bg-gray-800 text-white shadow-xl
                    // Desktop/Tablet: Always visible (flex)
                    sm:flex sm:relative sm:translate-x-0 
                    // Mobile: Fixed, positioned off-screen initially (-translate-x-full)
                    fixed top-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
                `}
            >
               
                <div className="flex items-center justify-center h-16 border-b border-gray-700">
                    <h1 className="text-xl font-bold tracking-wider text-indigo-400">RFP Manager</h1>
                </div>

                
                <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
                    {NAVIGATION_MENU.map((item) => { 
                        
                        const isExactMatch = item.path === '/rfp-list';

                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                onClick={toggleSidebar} 
                                {...(isExactMatch ? { end: true } : {})}
                                
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 
                                    ${isActive 
                                        ? 'bg-indigo-600 text-white shadow-md' 
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
            
            
            {isMobileOpen && (
                <div 
                    onClick={toggleSidebar}
                    className="fixed inset-0 bg-black opacity-50 z-30 sm:hidden"
                ></div>
            )}
        </>
    );
};

export default Sidebar;