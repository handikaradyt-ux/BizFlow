import useAuthStore from '../../store/authStore';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';

import { 
    Package, 
    Tags, 
    Users, 
    ShoppingCart,
    Plus,
    UserPlus,
    Banknote
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <Card>
        <CardContent className="flex items-center justify-between p-6">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h4 className="text-3xl font-bold text-gray-900">{value}</h4>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                <Icon size={24} />
            </div>
        </CardContent>
    </Card>
);

const DashboardPage = () => {
    const { user } = useAuthStore();

    return (
        <div className="space-y-6">
            <PageHeader 
                title={`Welcome back, ${user?.name || 'Administrator'}!`}
                subtitle="Here is what's happening with your business today."
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            />

            {/* SECTION 2: Statistic cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Products" 
                    value="120" 
                    icon={Package} 
                    colorClass="bg-blue-100 text-blue-600" 
                />
                <StatCard 
                    title="Total Categories" 
                    value="15" 
                    icon={Tags} 
                    colorClass="bg-emerald-100 text-emerald-600" 
                />
                <StatCard 
                    title="Total Customers" 
                    value="84" 
                    icon={Users} 
                    colorClass="bg-purple-100 text-purple-600" 
                />
                <StatCard 
                    title="Today's Transactions" 
                    value="32" 
                    icon={ShoppingCart} 
                    colorClass="bg-amber-100 text-amber-600" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader title="Sales Overview" />
                            <CardContent className="h-64 flex items-center justify-center bg-gray-50 m-4 mt-0 rounded border border-dashed border-gray-300">
                                <p className="text-gray-500 font-medium">Chart will be implemented later</p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader title="Revenue Trend" />
                            <CardContent className="h-64 flex items-center justify-center bg-gray-50 m-4 mt-0 rounded border border-dashed border-gray-300">
                                <p className="text-gray-500 font-medium">Chart will be implemented later</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader title="Quick Actions" />
                        <CardContent className="flex flex-wrap gap-4">
                            <Button icon={Plus} className="bg-blue-600 text-white hover:bg-blue-700">
                                Add Product
                            </Button>
                            <Button icon={UserPlus} className="bg-emerald-600 text-white hover:bg-emerald-700">
                                Add Customer
                            </Button>
                            <Button icon={Banknote} className="bg-purple-600 text-white hover:bg-purple-700">
                                New Transaction
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <CardHeader title="Recent Activities" />
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex relative">
                                    <div className="w-2.5 h-2.5 mt-1 rounded-full bg-blue-500 absolute -left-[5px]"></div>
                                    <div className="border-l-2 border-gray-200 pl-4 pb-2 ml-0">
                                        <p className="text-sm font-semibold text-gray-800">Product added</p>
                                        <p className="text-sm text-gray-500 mt-1">Wireless Mouse (SKU-102)</p>
                                        <p className="text-xs text-gray-400 mt-1.5 font-medium">10 mins ago</p>
                                    </div>
                                </div>
                                <div className="flex relative">
                                    <div className="w-2.5 h-2.5 mt-1 rounded-full bg-emerald-500 absolute -left-[5px]"></div>
                                    <div className="border-l-2 border-gray-200 pl-4 pb-2 ml-0">
                                        <p className="text-sm font-semibold text-gray-800">Customer registered</p>
                                        <p className="text-sm text-gray-500 mt-1">John Doe (john@example.com)</p>
                                        <p className="text-xs text-gray-400 mt-1.5 font-medium">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex relative">
                                    <div className="w-2.5 h-2.5 mt-1 rounded-full bg-purple-500 absolute -left-[5px]"></div>
                                    <div className="border-l-2 border-transparent pl-4 pb-0 ml-0">
                                        <p className="text-sm font-semibold text-gray-800">Transaction completed</p>
                                        <p className="text-sm text-gray-500 mt-1">Order #INV-2023001 ($145.00)</p>
                                        <p className="text-xs text-gray-400 mt-1.5 font-medium">5 hours ago</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;