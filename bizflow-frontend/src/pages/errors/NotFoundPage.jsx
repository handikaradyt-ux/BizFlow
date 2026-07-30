import { useNavigate } from 'react-router-dom';
import { SearchX, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 border-4 border-blue-100">
                <SearchX size={48} className="text-blue-600" />
            </div>
            
            <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
            <p className="text-gray-500 max-w-md mb-8">
                Oops! The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
            </p>
            
            <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
                <ArrowLeft size={18} className="mr-2" />
                Back to Dashboard
            </button>
        </div>
    );
};

export default NotFoundPage;
