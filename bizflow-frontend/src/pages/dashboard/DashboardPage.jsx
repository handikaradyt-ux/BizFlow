import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Skeleton, TableSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { dashboardService } from '../../services/dashboardService';
import { 
    Package, 
    Tags, 
    Users, 
    ShoppingCart,
    Banknote,
    AlertTriangle,
    BarChart3
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

const formatCurrency = (value) => `Rp ${Number(value).toLocaleString('id-ID')}`;

const StatCard = ({ title, value, icon: Icon, colorClass, isLoading, error }) => (
    <Card>
        <CardContent className="flex items-center justify-between p-6">
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                {isLoading ? (
                    <Skeleton type="text" className="w-1/2 h-8" />
                ) : error ? (
                    <p className="text-sm text-red-500">Failed to load</p>
                ) : (
                    <h4 className="text-3xl font-bold text-gray-900">{value}</h4>
                )}
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                <Icon size={24} />
            </div>
        </CardContent>
    </Card>
);

const DashboardPage = () => {
    const { user } = useAuthStore();
    
    const [summary, setSummary] = useState(null);
    const [trends, setTrends] = useState([]);
    const [recent, setRecent] = useState([]);
    const [lowStock, setLowStock] = useState([]);

    const [loading, setLoading] = useState({ summary: true, trends: true, recent: true, lowStock: true });
    const [error, setError] = useState({ summary: null, trends: null, recent: null, lowStock: null });

    useEffect(() => {
        const fetchDashboardData = async () => {
            // Fetch Summary
            dashboardService.getSummary()
                .then(res => setSummary(res.data))
                .catch(err => setError(prev => ({ ...prev, summary: err.message })))
                .finally(() => setLoading(prev => ({ ...prev, summary: false })));

            // Fetch Trends
            dashboardService.getMonthlyTrends()
                .then(res => setTrends(res.data))
                .catch(err => setError(prev => ({ ...prev, trends: err.message })))
                .finally(() => setLoading(prev => ({ ...prev, trends: false })));

            // Fetch Recent Transactions
            dashboardService.getRecentTransactions({ limit: 5 })
                .then(res => setRecent(res.data))
                .catch(err => setError(prev => ({ ...prev, recent: err.message })))
                .finally(() => setLoading(prev => ({ ...prev, recent: false })));

            // Fetch Low Stock
            dashboardService.getLowStock()
                .then(res => setLowStock(res.data))
                .catch(err => setError(prev => ({ ...prev, lowStock: err.message })))
                .finally(() => setLoading(prev => ({ ...prev, lowStock: false })));
        };

        fetchDashboardData();
    }, []);

    const getStatusVariant = (status) => {
        if (status === 'completed') return 'success';
        if (status === 'pending') return 'warning';
        if (status === 'cancelled') return 'danger';
        return 'neutral';
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title={`Welcome back, ${user?.name || 'Administrator'}!`}
                subtitle="Here is what's happening with your business today."
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            />

            {/* SECTION 1: Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value={summary ? formatCurrency(summary.total_revenue) : 0} 
                    icon={Banknote} 
                    colorClass="bg-emerald-100 text-emerald-600" 
                    isLoading={loading.summary}
                    error={error.summary}
                />
                <StatCard 
                    title="Total Orders" 
                    value={summary?.total_orders || 0} 
                    icon={ShoppingCart} 
                    colorClass="bg-blue-100 text-blue-600" 
                    isLoading={loading.summary}
                    error={error.summary}
                />
                <StatCard 
                    title="Total Products" 
                    value={summary?.total_products || 0} 
                    icon={Package} 
                    colorClass="bg-purple-100 text-purple-600" 
                    isLoading={loading.summary}
                    error={error.summary}
                />
                <StatCard 
                    title="Total Customers" 
                    value={summary?.total_customers || 0} 
                    icon={Users} 
                    colorClass="bg-amber-100 text-amber-600" 
                    isLoading={loading.summary}
                    error={error.summary}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Chart & Recent Transactions) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Monthly Revenue Chart */}
                    <Card>
                        <CardHeader title="Monthly Revenue Trend" />
                        <CardContent className="h-80 p-4">
                            {loading.trends ? (
                                <div className="h-full w-full flex items-center justify-center">
                                    <Skeleton type="card" className="h-full w-full" />
                                </div>
                            ) : error.trends ? (
                                <div className="h-full w-full flex items-center justify-center text-red-500">
                                    Failed to load chart data: {error.trends}
                                </div>
                            ) : trends.length === 0 ? (
                                <EmptyState icon={BarChart3} title="No Data" description="No revenue data available." />
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trends} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis 
                                            dataKey="month" 
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: '#6b7280', fontSize: 12 }}
                                        />
                                        <YAxis 
                                            tickFormatter={(value) => `Rp ${value / 1000000}M`}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: '#6b7280', fontSize: 12 }}
                                            width={80}
                                        />
                                        <Tooltip 
                                            formatter={(value) => [formatCurrency(value), 'Revenue']}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="revenue" 
                                            stroke="#10b981" 
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Transactions */}
                    <Card>
                        <CardHeader title="Recent Transactions" />
                        <CardContent noPadding>
                            {loading.recent ? (
                                <div className="p-6"><TableSkeleton rows={5} /></div>
                            ) : error.recent ? (
                                <div className="p-6 text-red-500">Failed to load recent transactions: {error.recent}</div>
                            ) : recent.length === 0 ? (
                                <div className="p-6"><EmptyState icon={ShoppingCart} title="No Transactions" description="No recent transactions found." /></div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-3 font-medium">Invoice</th>
                                                <th className="px-6 py-3 font-medium">Customer</th>
                                                <th className="px-6 py-3 font-medium">Cashier</th>
                                                <th className="px-6 py-3 font-medium text-right">Total</th>
                                                <th className="px-6 py-3 font-medium">Status</th>
                                                <th className="px-6 py-3 font-medium">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {recent.map((tx, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-6 py-3 font-semibold text-gray-900">{tx.invoice_number}</td>
                                                    <td className="px-6 py-3 text-gray-600">{tx.customer_name}</td>
                                                    <td className="px-6 py-3 text-gray-600">{tx.cashier}</td>
                                                    <td className="px-6 py-3 text-right font-medium text-gray-900">{formatCurrency(tx.grand_total)}</td>
                                                    <td className="px-6 py-3">
                                                        <Badge variant={getStatusVariant(tx.status)} className="capitalize">
                                                            {tx.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-3 text-gray-500 text-xs">{new Date(tx.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (Low Stock) */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="h-full flex flex-col">
                        <CardHeader title="Low Stock Alerts" />
                        <CardContent className="flex-1 overflow-y-auto">
                            {loading.lowStock ? (
                                <div className="space-y-4">
                                    <Skeleton type="text" className="w-full h-16" />
                                    <Skeleton type="text" className="w-full h-16" />
                                    <Skeleton type="text" className="w-full h-16" />
                                </div>
                            ) : error.lowStock ? (
                                <div className="text-red-500">Failed to load low stock alerts: {error.lowStock}</div>
                            ) : lowStock.length === 0 ? (
                                <EmptyState icon={Package} title="Stock is Good" description="No products are currently low on stock." />
                            ) : (
                                <div className="space-y-4">
                                    {lowStock.map((item) => (
                                        <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl border border-red-100 bg-red-50/50">
                                            <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
                                                <AlertTriangle size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate" title={item.name}>{item.name}</p>
                                                <p className="text-xs font-mono text-gray-500 mt-0.5">{item.sku}</p>
                                                <div className="flex items-center gap-2 mt-2 text-xs font-medium">
                                                    <span className="text-red-600">Stock: {item.stock}</span>
                                                    <span className="text-gray-400">|</span>
                                                    <span className="text-gray-500">Min: {item.minimum_stock}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;