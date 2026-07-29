import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const GuestRoute = () => {
    const { isAuthenticated, isInitialized, isLoading } = useAuthStore();

    // Prevent premature redirects while validating session
    if (!isInitialized || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-gray-500 font-medium">Loading session...</div>
            </div>
        );
    }

    // If NOT authenticated, allow them to view guest routes (e.g., Login)
    // If authenticated, bounce them to the dashboard automatically
    return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default GuestRoute;
