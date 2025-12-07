import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Dashboard from './pages/Dashboard/Dashboard'
import MainLayout from './components/Layout/MainLayout'
import RFPListPage from './pages/RFP/RFPListPage'
import NewRFPPage from './pages/RFP/NewRFPPage'
import RFPDetail from './pages/RFP/RFPDetail'
import VendorsPage from './pages/Vendors/VendorsPage'
import ProposalListPage from './pages/RFP/ProposalListPage'
import ProposalDetail from './pages/RFP/ProposalDetail'
// import RFPComparisonReportPage from './pages/Reports/ReportsPage'
import VendorDetailPage from './pages/Vendors/VendorDetailPage';
import ReportsPage from './pages/Reports/ReportsPage'

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>


                    <Route path="/" element={<ProtectedRoute />}>

                        <Route element={<MainLayout />}>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="rfp-list" element={<RFPListPage />} />
                            <Route path="rfp-list/new" element={<NewRFPPage />} />
                            <Route path="rfp-list/:id" element={<RFPDetail />} />
                            <Route path="/rfp-list/:rfpId/proposals"element={<ProposalListPage />} />
                            <Route path="/rfp-list/:rfpId/proposals/:proposalId" element={<ProposalDetail />} />
                            <Route path="/vendors/:id" element={<VendorDetailPage />} />
                            <Route path="vendors" element={<VendorsPage />} />
                            <Route path="reports" element={<ReportsPage />} />
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        </Route>
                    </Route>


                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>

            <Toaster
                toastOptions={{
                    className: "",
                    style: {
                        fontSize: "13px",
                    },
                }}
            />
        </AuthProvider>
    )
}

export default App