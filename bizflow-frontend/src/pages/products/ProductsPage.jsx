import { Search, Filter, Plus, Pencil, Trash2, PackageOpen } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../../components/ui/Card';
import { Table, TableHeader, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';

const DUMMY_PRODUCTS = [
    { id: 1, name: 'Laptop Pro X', category: 'Electronics', price: 12000000, stock: 15, status: 'In Stock' },
    { id: 2, name: 'Smartphone Z', category: 'Electronics', price: 7500000, stock: 20, status: 'In Stock' },
    { id: 3, name: 'Office Chair', category: 'Furniture', price: 1200000, stock: 5, status: 'Low Stock' },
    { id: 4, name: 'Mechanical Keyboard', category: 'Accessories', price: 1800000, stock: 0, status: 'Out of Stock' },
    { id: 5, name: 'USB-C Hub Adapter', category: 'Accessories', price: 450000, stock: 120, status: 'In Stock' },
];

const ProductsPage = () => {
    const products = DUMMY_PRODUCTS;

    const getStatusVariant = (status) => {
        if (status === 'In Stock') return 'success';
        if (status === 'Low Stock') return 'warning';
        return 'danger';
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Products" 
                subtitle="Manage all products in your inventory."
            />

            <Card>
                <CardContent noPadding>
                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center p-5 border-b border-gray-100 gap-4">
                        <div className="relative w-full sm:w-80">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <Input 
                                placeholder="Search products..." 
                                className="pl-10"
                            />
                        </div>

                        <div className="flex items-center space-x-3 w-full sm:w-auto">
                            <Button variant="outline" icon={Filter} className="w-full sm:w-auto">
                                Filter
                            </Button>
                            <Button variant="primary" icon={Plus} className="w-full sm:w-auto">
                                Add Product
                            </Button>
                        </div>
                    </div>

                    {products.length === 0 ? (
                        <EmptyState 
                            icon={PackageOpen}
                            title="No products found"
                            description="Get started by adding a new product to your inventory database."
                            action={
                                <Button variant="primary" icon={Plus}>
                                    Add Product
                                </Button>
                            }
                        />
                    ) : (
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </tr>
                            </TableHeader>
                            <tbody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                                        <TableCell>{product.category}</TableCell>
                                        <TableCell>Rp {product.price.toLocaleString('id-ID')}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(product.status)}>
                                                {product.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="sm" className="p-1.5" title="Edit">
                                                <Pencil size={18} />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50" title="Delete">
                                                <Trash2 size={18} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </CardContent>
                
                {products.length > 0 && (
                    <CardFooter className="justify-between flex-col sm:flex-row">
                        <span className="text-sm text-gray-500 mb-4 sm:mb-0">
                            Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">5</span> of <span className="font-medium text-gray-900">24</span> entries
                        </span>
                        
                        <div className="inline-flex rounded-md shadow-sm">
                            <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 transition-colors">Previous</button>
                            <button className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 transition-colors z-10">1</button>
                            <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 border-l-0 hover:bg-gray-50 transition-colors">2</button>
                            <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 border-l-0 hover:bg-gray-50 transition-colors">3</button>
                            <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md border-l-0 hover:bg-gray-50 transition-colors">Next</button>
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
};

export default ProductsPage;
