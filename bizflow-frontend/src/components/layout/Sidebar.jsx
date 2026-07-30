import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
            {/* Logo area */}
            <div className="h-16 flex items-center justify-center border-b border-gray-800">
                <h1 className="text-xl font-bold tracking-wider">BizFlow POS</h1>
            </div>
            
            {/* Navigation links placeholder */}
            <nav className="flex-1 py-4">
                <ul className="space-y-1 px-3">
                    <li>
                        <Link to="/dashboard" className="block px-3 py-2 rounded-md bg-gray-800 text-white font-medium">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white font-medium transition-colors">
                            Products
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white font-medium transition-colors">
                            Categories
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white font-medium transition-colors">
                            Customers
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white font-medium transition-colors">
                            Transactions
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white font-medium transition-colors">
                            Reports
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white font-medium transition-colors">
                            Settings
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
