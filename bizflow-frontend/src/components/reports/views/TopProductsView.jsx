import { Table } from '../../ui/Table';
import { Card, CardContent } from '../../ui/Card';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { EmptyState } from '../../ui/EmptyState';
import { Package } from 'lucide-react';

export const TopProductsView = ({ data, isLoading, error }) => {
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
        return <EmptyState title="Error Loading Data" description={error.message} icon={Package} />;
    }

    if (!data || data.length === 0) {
        return <EmptyState title="No Products Found" description="Try adjusting your date range." icon={Package} />;
    }

    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    const columns = [
        { key: 'rank', label: 'Rank', render: (_, row, index) => `#${index + 1}` },
        { key: 'product_name', label: 'Product Name' },
        { key: 'sku', label: 'SKU' },
        { key: 'quantity_sold', label: 'Quantity Sold', render: (val) => val.toLocaleString() },
        { key: 'revenue', label: 'Revenue Generated', render: (val) => formatCurrency(val) },
    ];

    return (
        <Card>
            <Table columns={columns} data={data} keyExtractor={(row) => row.sku} />
        </Card>
    );
};
