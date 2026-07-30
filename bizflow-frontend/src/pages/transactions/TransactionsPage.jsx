import { Search, Plus, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../../components/ui/Card';
import { Table, TableHeader, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

const DUMMY_TRANSACTIONS = [
    { id: 1, invoice: 'INV-1001', customer: 'Alice Smith', total: 15000000, payment: 'Credit Card', date: '2026-07-30', status: 'Completed' },
    { id: 2, invoice: 'INV-1002', customer: 'Walk-in Customer', total: 450000, payment: 'Cash', date: '2026-07-30', status: 'Completed' },
    { id: 3, invoice: 'INV-1003', customer: 'Bob Jones', total: 2500000, payment: 'Bank Transfer', date: '2026-07-29', status: 'Pending' },
    { id: 4, invoice: 'INV-1004', customer: 'Diana Prince', total: 1200000, payment: 'Credit Card', date: '2026-07-29', status: 'Completed' },
    { id: 5, invoice: 'INV-1005', customer: 'Walk-in Customer', total: 800000, payment: 'Cash', date: '2026-07-28', status: 'Refunded' },
];

const TransactionsPage = () => {
    
    const getStatusVariant = (status) => {
        if (status === 'Completed') return 'success';
        if (status === 'Pending') return 'warning';
        return 'neutral';
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Transactions" 
                subtitle="View and manage all sales transactions."
            />
            
            <Card>
                <CardContent noPadding>
                    <div className="flex flex-col sm:flex-row justify-between items-center p-5 border-b border-gray-100 gap-4">
                        <div className="relative w-full sm:w-80">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <Input 
                                placeholder="Search transactions..." 
                                className="pl-10" 
                            />
                        </div>
                        <div className="flex w-full sm:w-auto">
                            <Button variant="primary" icon={Plus} className="w-full sm:w-auto">
                                New Transaction
                            </Button>
                        </div>
                    </div>
                    
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </tr>
                        </TableHeader>
                        <tbody>
                            {DUMMY_TRANSACTIONS.map(tx => (
                                <TableRow key={tx.id}>
                                    <TableCell className="font-semibold text-gray-900">{tx.invoice}</TableCell>
                                    <TableCell className="text-gray-700">{tx.customer}</TableCell>
                                    <TableCell className="font-medium text-gray-900">Rp {tx.total.toLocaleString('id-ID')}</TableCell>
                                    <TableCell className="text-gray-500">{tx.payment}</TableCell>
                                    <TableCell className="text-gray-500">{tx.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(tx.status)}>
                                            {tx.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="sm" className="p-1.5" title="View details">
                                            <Eye size={18} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </tbody>
                    </Table>
                </CardContent>
                
                <CardFooter className="justify-between flex-col sm:flex-row">
                    <span className="text-sm text-gray-500 mb-4 sm:mb-0">
                        Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">5</span> of <span className="font-medium text-gray-900">5</span> entries
                    </span>
                    <div className="inline-flex rounded-md shadow-sm">
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 transition-colors">Previous</button>
                        <button className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 transition-colors z-10">1</button>
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md border-l-0 hover:bg-gray-50 transition-colors">Next</button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default TransactionsPage;
