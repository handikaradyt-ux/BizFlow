import { Search, Filter, Plus, Pencil, Trash2, PackageOpen } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableHead, TableRow, TableCell } from '../../components/ui/Table';

// 5 Static dummy rows representing the future API response
const DUMMY_PRODUCTS = [
    { id: 1, name: 'Laptop Pro X', category: 'Electronics', price: 12000000, stock: 15, status: 'In Stock' },
    { id: 2, name: 'Smartphone Z', category: 'Electronics', price: 7500000, stock: 20, status: 'In Stock' },
    { id: 3, name: 'Office Chair', category: 'Furniture', price: 1200000, stock: 5, status: 'Low Stock' },
    { id: 4, name: 'Mechanical Keyboard', category: 'Accessories', price: 1800000, stock: 0, status: 'Out of Stock' },
    { id: 5, name: 'USB-C Hub Adapter', category: 'Accessories', price: 450000, stock: 120, status: 'In Stock' },
];

const ProductsPage = () => {
    // In Phase 5, this will be replaced with: const { products, isLoading } = useProductStore();
    const products = DUMMY_PRODUCTS;

    return (
        <div className="space-y-6">
            {/* 1. Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Products</h1>
                <p className="text-gray-600 mt-1">Manage all products in your inventory.</p>
            </div>

            <Card>
                <CardContent className="p-0">
                    {/* 2. Action Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center p-5 border-b border-gray-100 gap-4">
                        {/* Left: Search input (UI placeholder) */}
                        <div className="relative w-full sm:w-80">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 transition-colors shadow-sm"
                            />
                        </div>

                        {/* Right: Filter & Add Actions (UI placeholder) */}
                        <div className="flex items-center space-x-3 w-full sm:w-auto">
                            <button className="flex items-center justify-center px-4 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium w-full sm:w-auto shadow-sm">
                                <Filter size={16} className="mr-2" />
                                Filter
                            </button>
                            <button className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium w-full sm:w-auto shadow-sm">
                                <Plus size={16} className="mr-2 flex-shrink-0" />
                                Add Product
                            </button>
                        </div>
                    </div>

                    {/* 3. Products Table & 5. Empty State */}
                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                                <PackageOpen size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-sm text-center">
                                Get started by adding a new product to your inventory database.
                            </p>
                            <button className="mt-6 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
                                <Plus size={16} className="mr-2" />
                                Add Product
                            </button>
                        </div>
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
                                        <TableCell>
                                            Rp {product.price.toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                                                product.status === 'In Stock' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                product.status === 'Low Stock' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                'bg-red-50 text-red-700 border border-red-200'
                                            }`}>
                                                {product.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                                                <Pencil size={18} />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </tbody>
                        </Table>
                    )}

                    {/* 4. Pagination Footer */}
                    {products.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-t border-gray-100 bg-white rounded-b-lg">
                            <span className="text-sm text-gray-500 mb-4 sm:mb-0">
                                Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">5</span> of <span className="font-medium text-gray-900">24</span> entries
                            </span>
                            
                            <div className="inline-flex rounded-md shadow-sm">
                                <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 transition-colors">
                                    Previous
                                </button>
                                <button className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 transition-colors z-10">
                                    1
                                </button>
                                <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 border-l-0 hover:bg-gray-50 transition-colors">
                                    2
                                </button>
                                <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 border-l-0 hover:bg-gray-50 transition-colors">
                                    3
                                </button>
                                <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md border-l-0 hover:bg-gray-50 transition-colors">
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductsPage;
