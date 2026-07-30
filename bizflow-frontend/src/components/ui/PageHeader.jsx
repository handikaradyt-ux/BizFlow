export const PageHeader = ({ title, subtitle, action, className = '' }) => {
    return (
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${className}`}>
            <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h1>
                {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {action && (
                <div className="flex w-full sm:w-auto">
                    {action}
                </div>
            )}
        </div>
    );
};
