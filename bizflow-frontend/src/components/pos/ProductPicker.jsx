import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, PackageOpen, ImageOff } from 'lucide-react';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { productService } from '../../services/productService';
import useCartStore from '../../store/cartStore';

export const ProductPicker = ({ refreshKey = 0 }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const addItem = useCartStore((s) => s.addItem);

    // Debounce search 400ms
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = { per_page: 50, status: 'active' };
            if (debouncedSearch) params.search = debouncedSearch;
            const res = await productService.getProducts(params);
            setProducts(res.data || []);
        } catch {
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts, refreshKey]);

    const handleAdd = (product) => {
        if (product.status !== 'active') return;
        addItem(product);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Search bar */}
            <div className="p-4 border-b border-gray-100">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search size={16} className="text-gray-400" />
                    </div>
                    <Input
                        placeholder="Search products..."
                        className="pl-9 text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Product grid */}
            <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                    <div className="py-10">
                        <LoadingSpinner text="Loading products..." />
                    </div>
                ) : products.length === 0 ? (
                    <EmptyState
                        icon={PackageOpen}
                        title="No products found"
                        description="Try a different search term."
                    />
                ) : (
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                        {products.map((product) => {
                            const inactive = product.status !== 'active' || product.stock <= 0;
                            return (
                                <button
                                    key={product.id}
                                    onClick={() => handleAdd(product)}
                                    disabled={inactive}
                                    title={inactive ? 'Unavailable' : `Add ${product.name}`}
                                    className={`
                                        relative flex flex-col text-left rounded-xl border p-3 gap-2 transition-all
                                        ${inactive
                                            ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50'
                                            : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 cursor-pointer active:scale-95'
                                        }
                                    `}
                                >
                                    {/* Product image or placeholder */}
                                    <div className="w-full aspect-square rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <ImageOff size={28} className="text-gray-300" />
                                        )}
                                    </div>

                                    {/* Product info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-mono text-gray-400 truncate">{product.sku}</p>
                                        <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">{product.name}</p>
                                        <p className="text-sm font-bold text-blue-600 mt-1">
                                            Rp {Number(product.selling_price).toLocaleString('id-ID')}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs text-gray-500">Stok: {product.stock}</span>
                                            {!inactive && (
                                                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                                    <Plus size={12} />
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Out of stock badge */}
                                    {product.stock <= 0 && (
                                        <span className="absolute top-2 right-2">
                                            <Badge variant="danger" className="text-xs">Out of Stock</Badge>
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
