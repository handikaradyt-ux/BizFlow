import { 
    LayoutDashboard, 
    Tags, 
    Package, 
    Users, 
    ShoppingCart, 
    BarChart3, 
    Settings, 
    LogOut,
    CircleDollarSign
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import SidebarGroup from './SidebarGroup';

// Centralized Menu Configuration Array
const menuConfig = [
    {
        label: null, // No label for the top-level items
        items: [
            { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
        ]
    },
    {
        label: 'Master Data',
        items: [
            { label: 'Categories', path: '/categories', icon: Tags },
            { label: 'Products', path: '/products', icon: Package },
            { label: 'Customers', path: '/customers', icon: Users }
        ]
    },
    {
        label: 'Transactions',
        items: [
            { label: 'Sales POS', path: '/transactions', icon: ShoppingCart }
        ]
    },
    {
        label: 'Reports',
        items: [
            { label: 'Sales Report', path: '/reports', icon: BarChart3 }
        ]
    },
    {
        label: 'Settings',
        items: [
            { label: 'App Settings', path: '/settings', icon: Settings }
        ]
    }
];

const Sidebar = () => {
    const { logout } = useAuthStore();

    return (
        <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col flex-shrink-0 sticky top-0 shadow-lg">
            {/* Branding area */}
            <div className="h-16 flex items-center justify-center border-b border-gray-800">
                <div className="flex items-center space-x-2">
                    <CircleDollarSign className="w-6 h-6 text-blue-500" />
                    <h1 className="text-xl font-bold tracking-wider">BizFlow POS</h1>
                </div>
            </div>
            
            {/* Scrollable Navigation */}
            {/* Added custom scrollbar styles implicitly by letting it overflow natively. 
                Tailwind scrollbar hiding plugins could be added later if needed. */}
            <nav className="flex-1 overflow-y-auto py-6 px-3">
                {menuConfig.map((group, index) => (
                    <SidebarGroup 
                        key={index} 
                        label={group.label} 
                        items={group.items} 
                    />
                ))}
            </nav>

            {/* Pinned Logout Button */}
            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2.5 rounded-md text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
