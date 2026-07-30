import SidebarItem from './SidebarItem';

const SidebarGroup = ({ label, items }) => {
    return (
        <div className="mb-6">
            {/* Render a group label if provided (e.g., "MASTER DATA") */}
            {label && (
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {label}
                </h3>
            )}
            
            {/* Map over the group items and render SidebarItem components */}
            <ul className="space-y-1">
                {items.map((item, index) => (
                    <SidebarItem
                        key={index}
                        icon={item.icon}
                        label={item.label}
                        path={item.path}
                    />
                ))}
            </ul>
        </div>
    );
};

export default SidebarGroup;
