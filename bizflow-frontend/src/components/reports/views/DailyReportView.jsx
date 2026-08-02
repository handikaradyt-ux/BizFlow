import { Card, CardHeader, CardContent } from '../../ui/Card';
import { Table } from '../../ui/Table';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { EmptyState } from '../../ui/EmptyState';
import { CalendarDays } from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer 
} from 'recharts';

export const DailyReportView = ({ data, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="space-y-6">
                <Card><CardContent className="flex justify-center items-center h-72"><LoadingSpinner size="lg" /></CardContent></Card>
                <Card><CardContent className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></CardContent></Card>
            </div>
        );
    }

    if (error) {
        return <EmptyState title="Error Loading Data" description={error.message} icon={CalendarDays} />;
    }

    if (!data || data.length === 0) {
        return <EmptyState title="No Data Found" description="Try adjusting your date range." icon={CalendarDays} />;
    }

    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    const formatDateStr = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const columns = [
        { key: 'date', label: 'Date', render: (val) => formatDateStr(val) },
        { key: 'orders', label: 'Orders' },
        { key: 'revenue', label: 'Revenue', render: (val) => formatCurrency(val) },
    ];

    // Format data for chart (short dates)
    const chartData = data.map(d => ({
        ...d,
        shortDate: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader title="Daily Revenue Chart" />
                <CardContent className="h-72 pb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="shortDate" tick={{ fontSize: 12 }} />
                            <YAxis 
                                tickFormatter={(val) => `Rp ${val / 1000000}M`}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip 
                                formatter={(value) => formatCurrency(value)}
                                labelFormatter={(label) => `Date: ${label}`}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#10b981" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorRevenue)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader title="Daily Breakdown" />
                <Table columns={columns} data={data} keyExtractor={(row) => row.date} />
            </Card>
        </div>
    );
};
