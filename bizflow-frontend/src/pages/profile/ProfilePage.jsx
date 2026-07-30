import useAuthStore from '../../store/authStore';
import { Card, CardContent } from '../../components/ui/Card';
import { User, Mail, Shield, Calendar, Edit } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const ProfilePage = () => {
    const { user } = useAuthStore();

    return (
        <div className="space-y-6">
            <PageHeader 
                title="My Profile" 
                subtitle="Manage your account information and preferences."
            />
            
            <Card className="max-w-3xl">
                <CardContent className="p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                        {/* Avatar */}
                        <div className="w-32 h-32 bg-blue-50 border-4 border-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0 shadow-sm">
                            <User size={64} strokeWidth={1.5} />
                        </div>
                        
                        {/* User Details */}
                        <div className="flex-1 w-full space-y-6 text-center sm:text-left">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">{user?.name || 'Administrator'}</h2>
                                <p className="text-gray-500 mt-2 flex items-center justify-center sm:justify-start">
                                    <Shield size={16} className="mr-2 text-blue-600" />
                                    <Badge variant="info" className="capitalize">
                                        {user?.role || 'user'}
                                    </Badge>
                                </p>
                            </div>
                            
                            <div className="space-y-4 pt-5 border-t border-gray-100">
                                <div className="flex items-center justify-center sm:justify-start text-gray-700">
                                    <Mail size={18} className="mr-3 text-gray-400" />
                                    <span className="font-medium">{user?.email || 'admin@bizflow.test'}</span>
                                </div>
                                <div className="flex items-center justify-center sm:justify-start text-gray-700">
                                    <Calendar size={18} className="mr-3 text-gray-400" />
                                    <span className="font-medium">Member since: July 2026</span>
                                </div>
                            </div>
                            
                            <div className="pt-6">
                                <Button variant="outline" icon={Edit} className="w-full sm:w-auto">
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;
