import { Table } from '../../ui/Table';
import { Badge } from '../../ui/Badge';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { EmptyState } from '../../ui/EmptyState';
import { FileText } from 'lucide-react';
import { Card, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';

export const SalesReportView = ({ data, isLoading, error, page, setPage }) => {
    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex justify-center items-center h-64">
                    <LoadingSpinner size="lg" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return <EmptyState title="Error Loading Data" description={error.message} icon={FileText} />;
    }

    if (!data || !data.data || data.data.length === 0) {
        return <EmptyState title="No Sales Found" description="Try adjusting your filters to see more results." icon={FileText} />;
    }

    const { data: rows, meta } = data;

    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'danger';
            case 'refunded': return 'info';
            default: return 'gray';
        }
    };

    const columns = [
        { key: 'invoice_number', label: 'Invoice' },
        { key: 'transaction_date', label: 'Date', render: (val) => formatDate(val) },
        { key: 'customer', label: 'Customer' },
        { key: 'cashier', label: 'Cashier' },
        { key: 'subtotal', label: 'Subtotal', render: (val) => formatCurrency(val) },
        { key: 'tax', label: 'Tax', render: (val) => formatCurrency(val) },
        { key: 'grand_total', label: 'Grand Total', render: (val) => formatCurrency(val) },
        { key: 'status', label: 'Status', render: (val) => <Badge variant={getStatusColor(val)}>{val.charAt(0).toUpperCase() + val.slice(1)}</Badge> },
    ];

    return (
        <Card>
            <Table columns={columns} data={rows} keyExtractor={(row) => row.invoice_number} />
            
            {/* Pagination Controls */}
            {meta && meta.last_page > 1 && (
                <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {((meta.current_page - 1) * meta.per_page) + 1} to {Math.min(meta.current_page * meta.per_page, meta.total)} of {meta.total} results
                    </p>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={meta.current_page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={meta.current_page === meta.last_page}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
};
