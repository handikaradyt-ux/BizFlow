import { NavLink } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, path }) => {
    return (
        <li>
            {/* 
                NavLink automatically provides an 'isActive' boolean 
                to its className callback when the current URL matches 'to' 
            */}
            <NavLink
                to={path}
                className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                }
            >
                {Icon && <Icon className="w-5 h-5 mr-3 flex-shrink-0" />}
                <span>{label}</span>
            </NavLink>
        </li>
    );
};

export default SidebarItem;
