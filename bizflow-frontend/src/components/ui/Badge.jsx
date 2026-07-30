export const Badge = ({ children, variant = 'neutral', className = '' }) => {
    const variants = {
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        warning: 'bg-amber-50 text-amber-700 border border-amber-200',
        danger: 'bg-red-50 text-red-700 border border-red-200',
        info: 'bg-blue-50 text-blue-700 border border-blue-200',
        neutral: 'bg-gray-50 text-gray-700 border border-gray-200',
    };

    const classes = [
        'px-2.5 py-1 text-xs font-semibold rounded-md inline-flex items-center',
        variants[variant] || variants.neutral,
        className,
    ].filter(Boolean).join(' ');

    return (
        <span className={classes}>
            {children}
        </span>
    );
};
