import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import RoleGuard from './RoleGuard';

const AppRoutes = () => {
    const { fetchUser, token } = useAuthStore();

    useEffect(() => {
        // Trigger fetchUser on app startup to rehydrate user state 
        // if a token exists in localStorage
        fetchUser();
    }, [fetchUser]);

    return (
        <BrowserRouter>
            <Routes>
                {/* Guest Routes - only accessible if NOT logged in */}
                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                </Route>
                
                {/* Protected Routes - only accessible if logged in */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Admin Routes - only accessible if role === 'admin' */}
                    <Route element={<RoleGuard allowedRoles={['admin']} />}>
                        {/* Example admin route */}
                        <Route path="/settings" element={<div className="p-6">Admin Settings Page</div>} />
                    </Route>
                </Route>
                
                {/* Catch all fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;