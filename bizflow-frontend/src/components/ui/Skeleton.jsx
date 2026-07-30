export const Skeleton = ({ className = '', type = 'text', width, height, rounded }) => {
    const baseClasses = 'animate-pulse bg-gray-200';
    
    const typeClasses = {
        text: 'h-4 w-3/4 rounded',
        avatar: 'h-12 w-12 rounded-full',
        card: 'h-48 w-full rounded-lg',
        tableRow: 'h-10 w-full rounded mb-2 last:mb-0'
    };

    const customStyles = {
        ...(width && { width }),
        ...(height && { height }),
        ...(rounded && { borderRadius: rounded })
    };

    return (
        <div 
            className={`${baseClasses} ${!width && !height ? typeClasses[type] : ''} ${className}`} 
            style={Object.keys(customStyles).length > 0 ? customStyles : undefined}
            aria-hidden="true"
        />
    );
};

export const TableSkeleton = ({ rows = 5, className = '' }) => {
    return (
        <div className={`w-full ${className}`}>
            {Array.from({ length: rows }).map((_, i) => (
                <Skeleton key={i} type="tableRow" />
            ))}
        </div>
    );
};

export const CardSkeleton = ({ className = '' }) => {
    return (
        <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
            <Skeleton type="avatar" className="mb-4" />
            <Skeleton type="text" className="w-1/2 mb-2" />
            <Skeleton type="text" className="w-full mb-1" />
            <Skeleton type="text" className="w-3/4" />
        </div>
    );
};
