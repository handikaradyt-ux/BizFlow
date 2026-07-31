import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

// Layouts & Guards
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import RoleGuard from './RoleGuard';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProductsPage from '../pages/products/ProductsPage';
import CategoriesPage from '../pages/categories/CategoriesPage';
import CustomersPage from '../pages/customers/CustomersPage';
import CustomerDetailPage from '../pages/customers/CustomerDetailPage';
import TransactionsPage from '../pages/transactions/TransactionsPage';
import ReportsPage from '../pages/reports/ReportsPage';
import SettingsPage from '../pages/settings/SettingsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import NotFoundPage from '../pages/errors/NotFoundPage';
import UnauthorizedPage from '../pages/errors/UnauthorizedPage';

const AppRoutes = () => {
    const { fetchUser } = useAuthStore();

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
                    {/* Dashboard Layout Wrapper */}
                    <Route element={<DashboardLayout />}>
                        {/* Nested Dashboard Pages */}
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/customers" element={<CustomersPage />} />
                        <Route path="/customers/:id" element={<CustomerDetailPage />} />
                        <Route path="/transactions" element={<TransactionsPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        
                        {/* Admin Routes - only accessible if role === 'admin' */}
                        <Route element={<RoleGuard allowedRoles={['admin']} />}>
                            <Route path="/settings" element={<SettingsPage />} />
                        </Route>
                    </Route>
                </Route>
                
                {/* Error Pages */}
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="/403" element={<UnauthorizedPage />} />
                
                {/* Catch all fallback */}
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;