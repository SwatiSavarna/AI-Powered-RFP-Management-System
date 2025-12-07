import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100">
          
            <Sidebar />

            
            <div className="flex-1 flex flex-col overflow-hidden">
                
                <header className="flex items-center justify-between h-16 bg-white border-b border-gray-200 shadow-md px-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        
                        RFP Management Dashboard
                    </h2>
                   
                </header>

               
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;