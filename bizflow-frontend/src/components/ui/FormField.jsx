export const FormField = ({ label, error, helperText, required = false, children, className = '' }) => {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            {/* The actual input element (e.g., <Input />, <Select />) */}
            {children}

            {error && (
                <p className="text-sm text-red-600 font-medium mt-1">{error}</p>
            )}
            
            {helperText && !error && (
                <p className="text-sm text-gray-500 mt-1">{helperText}</p>
            )}
        </div>
    );
};
