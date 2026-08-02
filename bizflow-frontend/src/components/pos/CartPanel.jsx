import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Select } from '../ui/Select';
import { customerService } from '../../services/customerService';
import useCartStore from '../../store/cartStore';

const TAX_RATE = 0.10;

const fmt = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;

export const CartPanel = ({ onCheckout, isSubmitting = false }) => {
    const { items, customerId, increaseQty, decreaseQty, removeItem, clearCart, setCustomer } = useCartStore();
    const [customers, setCustomers] = useState([]);

    // Load customers for the selector
    useEffect(() => {
        customerService.getCustomers()
            .then((res) => setCustomers(res.data || []))
            .catch(() => {});
    }, []);

    // Compute estimated totals — clearly client-side only, backend recalculates on submit
    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const tax = subtotal * TAX_RATE;
    const grandTotal = subtotal + tax;

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-5 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 text-base flex items-center gap-2">
                    <ShoppingCart size={18} className="text-blue-600" />
                    Shopping Cart
                    {items.length > 0 && (
                        <span className="ml-auto text-xs bg-blue-600 text-white rounded-full px-2 py-0.5">
                            {items.length}
                        </span>
                    )}
                </h2>
            </div>

            {/* Customer selector */}
            <div className="px-5 py-3 border-b border-gray-100">
                <label className="block text-xs font-medium text-gray-500 mb-1">Customer (Optional)</label>
                <Select
                    value={customerId ?? ''}
                    onChange={(e) => setCustomer(e.target.value ? Number(e.target.value) : null)}
                    disabled={isSubmitting}
                >
                    <option value="">Walk-in Customer</option>
                    {customers.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
                    ))}
                </Select>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
                {items.length === 0 ? (
                    <EmptyState
                        icon={ShoppingCart}
                        title="Cart is empty"
                        description="Click a product on the left to add it to the cart."
                    />
                ) : (
                    items.map((item) => (
                        <div
                            key={item.product.id}
                            className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                                    {item.product.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {fmt(item.unitPrice)} / unit
                                </p>
                                <p className="text-sm font-bold text-blue-600 mt-1">
                                    {fmt(item.unitPrice * item.quantity)}
                                </p>
                            </div>

                            <div className="flex flex-col items-end gap-2 shrink-0">
                                {/* Quantity controls */}
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => decreaseQty(item.product.id)}
                                        disabled={isSubmitting}
                                        className="w-7 h-7 rounded-md border border-gray-300 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                                    >
                                        <Minus size={12} />
                                    </button>
                                    <span className="w-8 text-center text-sm font-semibold text-gray-800">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => increaseQty(item.product.id)}
                                        disabled={isSubmitting}
                                        className="w-7 h-7 rounded-md border border-gray-300 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                                    >
                                        <Plus size={12} />
                                    </button>
                                </div>

                                {/* Remove button */}
                                <button
                                    onClick={() => removeItem(item.product.id)}
                                    disabled={isSubmitting}
                                    className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                    title="Remove item"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Estimated totals */}
            {items.length > 0 && (
                <div className="p-5 border-t border-gray-100 space-y-2 bg-gray-50">
                    <p className="text-xs font-medium text-amber-600 uppercase tracking-wide mb-2">
                        ⚠ Estimated Totals (for reference only)
                    </p>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Estimated Subtotal</span>
                        <span className="font-medium text-gray-900">{fmt(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Estimated Tax (10%)</span>
                        <span className="font-medium text-gray-900">{fmt(tax)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                        <span>Estimated Grand Total</span>
                        <span className="text-blue-600">{fmt(grandTotal)}</span>
                    </div>

                    <div className="flex gap-2 pt-3">
                        <Button
                            variant="ghost"
                            className="flex-1 text-sm"
                            onClick={clearCart}
                            disabled={isSubmitting}
                        >
                            Clear Cart
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1 text-sm"
                            onClick={onCheckout}
                            disabled={items.length === 0 || isSubmitting}
                            isLoading={isSubmitting}
                        >
                            {isSubmitting ? 'Processing...' : 'Checkout'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
