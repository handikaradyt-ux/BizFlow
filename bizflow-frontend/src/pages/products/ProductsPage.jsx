import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Pencil, Trash2, PackageOpen, ImageOff, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../../components/ui/Card';
import { Table, TableHeader, TableHead, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { productService } from '../../services/productService';
import { ProductForm } from '../../components/products/ProductForm';
import { CategoryFilter } from '../../components/categories/CategoryFilter';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionError, setActionError] = useState(null);
    
    // Pagination state
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);
    const perPage = 10;
    
    // Filter state
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [status, setStatus] = useState('');

    // Modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Delete state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Reset pagination on filter change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, categoryId, status]);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = { 
                page, 
                per_page: perPage 
            };
            
            if (debouncedSearch) params.search = debouncedSearch;
            if (categoryId) params.category_id = categoryId;
            if (status) params.status = status;

            const data = await productService.getProducts(params);
            setProducts(data.data);
            setMeta(data.meta);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load products');
        } finally {
            setIsLoading(false);
        }
    }, [page, debouncedSearch, categoryId, status]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleResetFilters = () => {
        setSearch('');
        setDebouncedSearch('');
        setCategoryId('');
        setStatus('');
        setPage(1);
    };

    const handleAddClick = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        fetchProducts();
    };

    const handleDeleteClick = (product) => {
        setActionError(null);
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        setActionError(null);
        
        try {
            await productService.deleteProduct(productToDelete.id);
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
            fetchProducts();
        } catch (err) {
            setActionError(err.response?.data?.message || 'Failed to delete product.');
            setIsDeleteModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const getStatusVariant = (prodStatus) => {
        if (prodStatus === 'active') return 'success';
        return 'danger';
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(p => p - 1);
    };

    const handleNextPage = () => {
        if (meta && page < meta.last_page) setPage(p => p + 1);
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Products" 
                subtitle="Manage all products in your inventory."
            />

            {(error || actionError) && (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg" role="alert">
                    <span className="font-medium">Error:</span> {error || actionError}
                </div>
            )}

            <Card>
                <CardContent noPadding>
                    {/* Action Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center p-5 border-b border-gray-100 gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
                            <div className="relative w-full sm:w-64">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search size={18} className="text-gray-400" />
                                </div>
                                <Input 
                                    placeholder="Search name or SKU..." 
                                    className="pl-10"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            
                            <CategoryFilter 
                                className="w-full sm:w-40" 
                                value={categoryId} 
                                onChange={(e) => setCategoryId(e.target.value)}
                            />

                            <Select 
                                className="w-full sm:w-40"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Select>

                            <Button variant="ghost" icon={RefreshCcw} onClick={handleResetFilters} title="Reset Filters" className="w-full sm:w-auto whitespace-nowrap">
                                Reset
                            </Button>
                        </div>

                        <div className="flex w-full md:w-auto">
                            <Button variant="primary" icon={Plus} className="w-full md:w-auto whitespace-nowrap" onClick={handleAddClick}>
                                Add Product
                            </Button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="p-12">
                            <LoadingSpinner text="Loading products..." />
                        </div>
                    ) : products.length === 0 ? (
                        <EmptyState 
                            icon={PackageOpen}
                            title="No products found"
                            description={search || categoryId || status ? "Try adjusting your filters or search query." : "Get started by adding a new product to your inventory database."}
                            action={
                                <Button variant="primary" icon={Plus} onClick={handleAddClick}>
                                    Add Product
                                </Button>
                            }
                        />
                    ) : (
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableHead>Image</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Selling Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </tr>
                            </TableHeader>
                            <tbody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded object-cover border border-gray-200" />
                                            ) : (
                                                <div className="w-10 h-10 rounded bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
                                                    <ImageOff size={16} />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm text-gray-600">{product.sku}</TableCell>
                                        <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                                        <TableCell>{product.category_name || '-'}</TableCell>
                                        <TableCell>Rp {Number(product.selling_price).toLocaleString('id-ID')}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(product.status)} className="capitalize">
                                                {product.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="sm" className="p-1.5" title="Edit" onClick={() => handleEditClick(product)}>
                                                <Pencil size={18} />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50" title="Delete" onClick={() => handleDeleteClick(product)}>
                                                <Trash2 size={18} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </CardContent>
                
                {!isLoading && meta && meta.total > 0 && (
                    <CardFooter className="justify-between flex-col sm:flex-row">
                        <span className="text-sm text-gray-500 mb-4 sm:mb-0">
                            Showing <span className="font-medium text-gray-900">{meta.from || 0}</span> to <span className="font-medium text-gray-900">{meta.to || 0}</span> of <span className="font-medium text-gray-900">{meta.total}</span> entries
                        </span>
                        
                        <div className="inline-flex rounded-md shadow-sm">
                            <button 
                                onClick={handlePrevPage}
                                disabled={page <= 1}
                                className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <div className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-blue-600 z-10 flex items-center">
                                Page {page} of {meta.last_page || 1}
                            </div>
                            <button 
                                onClick={handleNextPage}
                                disabled={!meta || page >= meta.last_page}
                                className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md border-l-0 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </CardFooter>
                )}
            </Card>

            <Modal 
                isOpen={isFormOpen} 
                onClose={() => setIsFormOpen(false)}
                title={editingProduct ? "Edit Product" : "Add New Product"}
            >
                <ProductForm 
                    product={editingProduct} 
                    onSuccess={handleFormSuccess} 
                    onCancel={() => setIsFormOpen(false)} 
                />
            </Modal>

            <ConfirmDialog 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Product"
                description="Are you sure you want to delete this product? Deleting cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive={true}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default ProductsPage;
