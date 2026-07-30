const AuthLayout = ({ children, title = 'BizFlow POS' }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Left Column: Branding Section (Hidden on Mobile) */}
            <div className="hidden md:flex md:w-1/2 bg-gray-900 text-white flex-col justify-center items-center p-12">
                <div className="max-w-md">
                    {/* Logo Placeholder */}
                    <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-8 shadow-lg">
                        <span className="text-3xl font-bold tracking-tight">BF</span>
                    </div>
                    
                    <h1 className="text-4xl font-bold mb-6 tracking-tight">{title}</h1>
                    
                    <p className="text-lg text-gray-300 leading-relaxed">
                        The ultimate point-of-sale system for your growing business. Manage your products, track sales, and analyze real-time reports all in one intuitive platform.
                    </p>
                </div>
            </div>

            {/* Right Column: Authentication Card Area */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    {/* The specific auth form (Login/Register/Forgot Password) is injected here */}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;