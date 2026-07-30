export const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => {
    return (
        <div className={`flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center ${className}`}>
            {Icon && (
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 border border-gray-100 shadow-sm">
                    <Icon size={32} className="text-gray-400 sm:w-10 sm:h-10" aria-hidden="true" />
                </div>
            )}
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h3>
            {description && (
                <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-sm sm:max-w-md mx-auto">
                    {description}
                </p>
            )}
            {action && (
                <div className="mt-8">
                    {action}
                </div>
            )}
        </div>
    );
};
