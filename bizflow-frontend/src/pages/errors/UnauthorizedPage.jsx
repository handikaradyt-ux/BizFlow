import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 border-4 border-red-100">
                <ShieldAlert size={48} className="text-red-600" />
            </div>
            
            <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight mb-4">403</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-500 max-w-md mb-8">
                You do not have permission to access this page. Please contact your administrator if you believe this is a mistake.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium shadow-sm"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Go Back
                </button>
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                    <Home size={18} className="mr-2" />
                    Dashboard
                </button>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
