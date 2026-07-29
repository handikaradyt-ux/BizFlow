import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = () => {
    const { isAuthenticated, isInitialized, isLoading } = useAuthStore();
    const location = useLocation();

    // Prevent premature redirects while we are validating the user's session
    if (!isInitialized || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-gray-500 font-medium">Loading session...</div>
            </div>
        );
    }

    // If authenticated, render the child routes (Dashboard, etc.)
    // Otherwise, redirect to login, preserving the location they tried to access
    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default ProtectedRoute;
