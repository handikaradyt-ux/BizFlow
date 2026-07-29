import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const RoleGuard = ({ allowedRoles }) => {
    const { user, isInitialized, isLoading } = useAuthStore();

    if (!isInitialized || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-gray-500 font-medium">Verifying access...</div>
            </div>
        );
    }

    // Check if the current user's role is included in the allowedRoles array
    const hasRole = user && allowedRoles.includes(user.role);
    
    // If they have permission, let them through. If not, bounce them back to the dashboard.
    return hasRole ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default RoleGuard;
