import { Card, CardHeader, CardContent } from '../../ui/Card';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { EmptyState } from '../../ui/EmptyState';
import { Activity } from 'lucide-react';
import { 
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

export const MonthlyTrendView = ({ data, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card><CardContent className="flex justify-center items-center h-80"><LoadingSpinner size="lg" /></CardContent></Card>
                <Card><CardContent className="flex justify-center items-center h-80"><LoadingSpinner size="lg" /></CardContent></Card>
            </div>
        );
    }

    if (error) {
        return <EmptyState title="Error Loading Data" description={error.message} icon={Activity} />;
    }

    if (!data || data.length === 0) {
        return <EmptyState title="No Data Found" description="Not enough data to display trends." icon={Activity} />;
    }

    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader title="Revenue Trend" />
                <CardContent className="h-80 pb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                                dataKey="month" 
                                tick={{ fontSize: 12 }} 
                                tickMargin={10} 
                            />
                            <YAxis 
                                tickFormatter={(val) => `Rp ${val / 1000000}M`}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip 
                                formatter={(value) => formatCurrency(value)}
                                cursor={{ fill: '#f3f4f6' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader title="Order Volume Trend" />
                <CardContent className="h-80 pb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                                dataKey="month" 
                                tick={{ fontSize: 12 }} 
                                tickMargin={10} 
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip 
                                cursor={{ stroke: '#cbd5e1' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Line 
                                type="monotone" 
                                dataKey="order_count" 
                                name="Orders" 
                                stroke="#3b82f6" 
                                strokeWidth={3} 
                                dot={{ r: 4, strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};
