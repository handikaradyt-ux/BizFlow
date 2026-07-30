import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import useAuthStore from '../../store/authStore';

// Helper function to format path into a readable title dynamically
const getPageTitle = (pathname) => {
    // Remove leading slash and split
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return 'Dashboard';
    
    // Take the first part, replace hyphens with spaces, capitalize first letter
    const title = parts[0].replace(/-/g, ' ');
    return title.charAt(0).toUpperCase() + title.slice(1);
};

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Determine current page title dynamically from route
    const title = getPageTitle(location.pathname);

    // Handle clicking outside to close the dropdown menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        // Log out via Zustand store
        logout();
        // Redirect to login explicitly via React Router
        navigate('/login', { replace: true });
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 flex-shrink-0">
            {/* Dynamic Page Title */}
            <div className="flex items-center">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h2>
            </div>
            
            {/* User Profile Area */}
            <div className="flex items-center relative" ref={dropdownRef}>
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 focus:outline-none p-1.5 rounded-md hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                >
                    {/* User Info (Name + Role) */}
                    <div className="flex flex-col items-end mr-1">
                        <span className="text-sm font-semibold text-gray-800 leading-none mb-1">
                            {user?.name || 'User'}
                        </span>
                        <span className="text-xs text-gray-500 capitalize leading-none font-medium">
                            {user?.role || 'user'}
                        </span>
                    </div>
                    
                    {/* Avatar Placeholder */}
                    <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                        <User size={18} strokeWidth={2.5} />
                    </div>
                    
                    {/* Dropdown chevron */}
                    <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute top-14 right-0 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1.5 z-50">
                        <Link 
                            to="/profile" 
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <User size={16} className="mr-3" />
                            Profile
                        </Link>
                        
                        <Link 
                            to="/settings" 
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <Settings size={16} className="mr-3" />
                            Settings
                        </Link>
                        
                        <div className="border-t border-gray-100 my-1.5"></div>
                        
                        <button 
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                        >
                            <LogOut size={16} className="mr-3" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
