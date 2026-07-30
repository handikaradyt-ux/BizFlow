import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ 
    size = 'md', 
    text, 
    fullscreen = false,
    overlay = false,
    className = '' 
}) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    const spinnerContent = (
        <div className={`flex flex-col justify-center items-center gap-3 ${className}`} role="status" aria-label="Loading">
            <Loader2 className={`animate-spin text-blue-600 ${sizes[size]}`} />
            {text && <span className="text-gray-500 font-medium text-sm">{text}</span>}
            <span className="sr-only">Loading...</span>
        </div>
    );

    if (fullscreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                {spinnerContent}
            </div>
        );
    }
    
    if (overlay) {
        return (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                {spinnerContent}
            </div>
        );
    }

    return spinnerContent;
};
