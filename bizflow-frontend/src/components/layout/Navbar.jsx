import useAuthStore from '../../store/authStore';

const Navbar = () => {
    const { user, logout } = useAuthStore();

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
            <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            </div>
            
            <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                    {user?.name || 'Administrator'}
                </span>
                <button 
                    onClick={logout}
                    className="text-sm px-3 py-1.5 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition-colors"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Navbar;
