export const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, title, actions, className = '' }) => {
    if (title || actions) {
        return (
            <div className={`px-6 py-4 border-b border-gray-100 flex items-center justify-between ${className}`}>
                {title && <CardTitle>{title}</CardTitle>}
                {actions && <div className="flex items-center space-x-2">{actions}</div>}
                {children}
            </div>
        );
    }
    
    return (
        <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
            {children}
        </div>
    );
};

export const CardTitle = ({ children, className = '' }) => {
    return (
        <h3 className={`text-lg font-semibold text-gray-800 ${className}`}>
            {children}
        </h3>
    );
};

export const CardContent = ({ children, className = '', noPadding = false }) => {
    return (
        <div className={`${noPadding ? '' : 'px-6 py-4'} flex-1 ${className}`}>
            {children}
        </div>
    );
};

export const CardFooter = ({ children, className = '' }) => {
    return (
        <div className={`px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center ${className}`}>
            {children}
        </div>
    );
};
