import { forwardRef } from 'react';

export const Textarea = forwardRef(({ className = '', hasError = false, rows = 3, ...props }, ref) => {
    const baseClasses = 'w-full bg-white border text-gray-900 text-sm rounded-md focus:outline-none focus:ring-1 block p-2.5 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 resize-y';
    const borderClasses = hasError 
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';

    return (
        <textarea 
            ref={ref}
            rows={rows}
            className={`${baseClasses} ${borderClasses} ${className}`}
            {...props}
        />
    );
});

Textarea.displayName = 'Textarea';
