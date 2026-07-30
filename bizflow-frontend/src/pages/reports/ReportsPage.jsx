import { BarChart3, TrendingUp, Users, ShoppingBag, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';

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

const ReportsPage = () => {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Reports" 
                subtitle="Analytics and business performance metrics."
                action={
                    <Button variant="primary" icon={Download}>
                        Export Data
                    </Button>
                }
            />

            {/* Report Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Sales" value="1,245" icon={ShoppingBag} colorClass="bg-blue-100 text-blue-600" />
                <StatCard title="Revenue" value="Rp 84.5M" icon={TrendingUp} colorClass="bg-emerald-100 text-emerald-600" />
                <StatCard title="Orders" value="384" icon={BarChart3} colorClass="bg-amber-100 text-amber-600" />
                <StatCard title="Customers" value="218" icon={Users} colorClass="bg-purple-100 text-purple-600" />
            </div>

            {/* Chart Placeholders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader title="Sales Over Time" />
                    <CardContent className="h-72 flex items-center justify-center bg-gray-50 m-5 mt-0 rounded border border-dashed border-gray-300">
                        <p className="text-gray-500 font-medium">Chart will be implemented later</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader title="Top Selling Products" />
                    <CardContent className="h-72 flex items-center justify-center bg-gray-50 m-5 mt-0 rounded border border-dashed border-gray-300">
                        <p className="text-gray-500 font-medium">Chart will be implemented later</p>
                    </CardContent>
                </Card>
            </div>
            
            {/* Recent Reports List */}
            <Card>
                <CardHeader title="Recent Reports" />
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors gap-4">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mr-4 flex-shrink-0">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Monthly Sales Summary - July 2026</h4>
                                    <p className="text-sm text-gray-500 mt-0.5">Generated on July 30, 2026</p>
                                </div>
                            </div>
                            <Button variant="ghost" icon={Download} className="text-blue-600 hover:text-blue-800 w-full sm:w-auto">
                                Download PDF
                            </Button>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors gap-4">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mr-4 flex-shrink-0">
                                    <FileSpreadsheet size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Inventory Status Report</h4>
                                    <p className="text-sm text-gray-500 mt-0.5">Generated on July 25, 2026</p>
                                </div>
                            </div>
                            <Button variant="ghost" icon={Download} className="text-blue-600 hover:text-blue-800 w-full sm:w-auto">
                                Download Excel
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReportsPage;
