import useAuthStore from '../../store/authStore';

const DashboardPage = () => {
    const { user, logout } = useAuthStore();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                        <button
                            onClick={logout}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-md transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                    
                    <p className="text-gray-600 mb-6">Welcome back, {user?.name || 'User'}!</p>
                    
                    <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
                        <h3 className="font-semibold text-gray-700 mb-3">Your Profile Details</h3>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium text-gray-800 w-16 inline-block">Name:</span> 
                                {user?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium text-gray-800 w-16 inline-block">Email:</span> 
                                {user?.email}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium text-gray-800 w-16 inline-block">Role:</span> 
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                    {user?.role || 'user'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;