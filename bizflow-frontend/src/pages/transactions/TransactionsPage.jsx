import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { ProductPicker } from '../../components/pos/ProductPicker';
import { CartPanel } from '../../components/pos/CartPanel';
import { InvoiceModal } from '../../components/pos/InvoiceModal';
import { transactionService } from '../../services/transactionService';
import useCartStore from '../../store/cartStore';

const TransactionsPage = () => {
    const { items, customerId, clearCart } = useCartStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Invoice Modal state
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);

    const handleCheckout = async () => {
        if (items.length === 0 || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Prepare payload (only customer_id and items with product_id & quantity)
            const payload = {
                customer_id: customerId || null,
                items: items.map((item) => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                })),
            };

            // 2. Send transaction to backend
            const response = await transactionService.createTransaction(payload);
            const createdTransactionId = response.data?.id;

            if (createdTransactionId) {
                // 3. Fetch full invoice data from GET /api/transactions/{id}/invoice
                const invoiceResponse = await transactionService.getInvoice(createdTransactionId);
                setInvoiceData(invoiceResponse.data);
                setIsInvoiceOpen(true);
            }

            // 4. Reset cart state and trigger product list / stock refresh
            clearCart();
            setRefreshKey((prev) => prev + 1);
        } catch (err) {
            console.error('Checkout failed', err);
            
            // Format error message
            if (err.response?.status === 422) {
                const responseData = err.response.data;
                if (responseData.errors) {
                    const firstErrKey = Object.keys(responseData.errors)[0];
                    const firstErrMsg = responseData.errors[firstErrKey]?.[0];
                    setError(responseData.message ? `${responseData.message} ${firstErrMsg || ''}` : (firstErrMsg || 'Validation error'));
                } else {
                    setError(responseData.message || 'Validation failed. Please check your cart items.');
                }
            } else {
                setError(err.response?.data?.message || 'Transaction failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full space-y-0 -m-6">
            {/* Page heading */}
            <div className="px-6 pt-6 pb-4 flex-shrink-0">
                <PageHeader
                    title="Point of Sale (Transactions)"
                    subtitle="Select products, build your cart, and proceed to checkout."
                />

                {/* Error Banner */}
                {error && (
                    <div className="mt-3 p-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-xl flex items-center justify-between" role="alert">
                        <div>
                            <span className="font-semibold">Checkout Error:</span> {error}
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="text-xs font-semibold underline ml-4 hover:text-red-900"
                        >
                            Dismiss
                        </button>
                    </div>
                )}
            </div>

            {/* Two-column POS layout */}
            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden border-t border-gray-200 bg-gray-50 min-h-0">
                {/* LEFT — Product Picker */}
                <div className="flex-1 flex flex-col overflow-hidden lg:border-r lg:border-gray-200 bg-white">
                    <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Products
                        </h2>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <ProductPicker refreshKey={refreshKey} />
                    </div>
                </div>

                {/* RIGHT — Cart Panel */}
                <div className="flex-shrink-0 lg:w-96 flex flex-col overflow-hidden border-t lg:border-t-0 border-gray-200 bg-white">
                    <CartPanel onCheckout={handleCheckout} isSubmitting={isSubmitting} />
                </div>
            </div>

            {/* Invoice Modal */}
            <InvoiceModal
                isOpen={isInvoiceOpen}
                onClose={() => setIsInvoiceOpen(false)}
                invoice={invoiceData}
            />
        </div>
    );
};

export default TransactionsPage;
