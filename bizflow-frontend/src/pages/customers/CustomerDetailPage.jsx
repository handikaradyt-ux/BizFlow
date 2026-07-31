import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, ShoppingCart, DollarSign, ReceiptText } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { customerService } from '../../services/customerService';

const CustomerDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [customer, setCustomer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCustomer = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await customerService.getCustomer(id);
            setCustomer(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load customer details');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCustomer();
    }, [fetchCustomer]);

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <LoadingSpinner text="Loading customer profile..." />
            </div>
        );
    }

    if (error || !customer) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/customers')}>
                    Back to Customers
                </Button>
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg">
                    <span className="font-medium">Error:</span> {error || 'Customer not found'}
                </div>
            </div>
        );
    }

    const { summary, transactions } = customer;
    
    const getStatusVariant = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'danger';
            default: return 'gray';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="sm" className="p-2" onClick={() => navigate('/customers')} title="Back">
                    <ArrowLeft size={20} />
                </Button>
                <PageHeader 
                    title="Customer Details" 
                    subtitle={`Viewing profile for ${customer.name}`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                                {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                                <p className="text-sm text-gray-500">Customer ID: #{customer.id}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3 text-gray-600">
                                <Phone size={18} className="mt-0.5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Phone</p>
                                    <p className="text-sm">{customer.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-gray-600">
                                <Mail size={18} className="mt-0.5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Email</p>
                                    <p className="text-sm">{customer.email || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-gray-600">
                                <MapPin size={18} className="mt-0.5 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Address</p>
                                    <p className="text-sm">{customer.address || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Metrics */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <ShoppingCart size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                    <h4 className="text-2xl font-bold text-gray-900">
                                        {summary?.order_count || 0}
                                    </h4>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <DollarSign size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Lifetime Spend</p>
                                    <h4 className="text-2xl font-bold text-gray-900">
                                        Rp {(summary?.lifetime_spend || 0).toLocaleString('id-ID')}
                                    </h4>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Transaction History Table */}
                    <Card>
                        <div className="p-5 border-b border-gray-100">
                            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <ReceiptText size={18} className="text-gray-400" />
                                Transaction History
                            </h3>
                        </div>
                        <CardContent noPadding>
                            {!transactions || transactions.length === 0 ? (
                                <EmptyState 
                                    icon={ReceiptText}
                                    title="No transactions yet"
                                    description="This customer hasn't made any purchases."
                                />
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <tr>
                                            <TableHead>Invoice ID</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Status</TableHead>
                                        </tr>
                                    </TableHeader>
                                    <tbody>
                                        {transactions.map(trx => (
                                            <TableRow key={trx.id}>
                                                <TableCell className="font-medium text-gray-900">#{trx.id}</TableCell>
                                                <TableCell className="text-gray-500">
                                                    {new Date(trx.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    Rp {Number(trx.grand_total).toLocaleString('id-ID')}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusVariant(trx.status)} className="capitalize">
                                                        {trx.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailPage;
