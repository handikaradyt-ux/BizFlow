import { TrendingUp, ShoppingBag, DollarSign, Activity } from 'lucide-react';
import { Card, CardContent } from '../../ui/Card';
import { Skeleton } from '../../ui/Skeleton';
import { EmptyState } from '../../ui/EmptyState';

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
    <Card>
        <CardContent className="flex flex-col justify-center p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h4 className="text-3xl font-bold text-gray-900">{value}</h4>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                    <Icon size={24} />
                </div>
            </div>
            {subtitle && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-500">{subtitle}</p>
                </div>
            )}
        </CardContent>
    </Card>
);

export const RevenueReportView = ({ data, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <Card key={i}><CardContent className="p-6 h-32"><Skeleton className="h-full w-full" /></CardContent></Card>
                ))}
            </div>
        );
    }

    if (error) {
        return <EmptyState title="Error Loading Data" description={error.message} icon={Activity} />;
    }

    if (!data) return null;

    const { total_revenue, total_orders, average_order_value, comparison } = data;

    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    const renderChange = (percent) => {
        const isPos = percent >= 0;
        const color = isPos ? 'text-emerald-600' : 'text-red-600';
        const sign = isPos ? '+' : '';
        return <span className={`${color} font-bold`}>{sign}{percent}% vs prev period</span>;
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value={formatCurrency(total_revenue)} 
                    icon={TrendingUp} 
                    colorClass="bg-emerald-100 text-emerald-600"
                    subtitle={renderChange(comparison?.revenue_change_percent || 0)}
                />
                <StatCard 
                    title="Total Orders" 
                    value={total_orders.toLocaleString()} 
                    icon={ShoppingBag} 
                    colorClass="bg-amber-100 text-amber-600"
                    subtitle={renderChange(comparison?.order_change_percent || 0)}
                />
                <StatCard 
                    title="Average Order Value" 
                    value={formatCurrency(average_order_value)} 
                    icon={DollarSign} 
                    colorClass="bg-blue-100 text-blue-600" 
                />
            </div>
        </div>
    );
};
