import { Loader2 } from 'lucide-react';

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    fullWidth = false,
    icon: Icon = null,
    className = '',
    onClick,
    type = 'button',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm border border-transparent',
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border border-transparent',
        outline: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 focus:ring-blue-500 shadow-sm',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm border border-transparent',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const classes = [
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || isLoading}
            onClick={onClick}
            {...props}
        >
            {isLoading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
            {!isLoading && Icon && <Icon className="-ml-1 mr-2 h-4 w-4" />}
            {children}
        </button>
    );
};
