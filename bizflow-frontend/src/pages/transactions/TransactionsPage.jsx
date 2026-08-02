import { PageHeader } from '../../components/ui/PageHeader';
import { ProductPicker } from '../../components/pos/ProductPicker';
import { CartPanel } from '../../components/pos/CartPanel';

const TransactionsPage = () => {
    // Checkout handler will be wired in later session
    const handleCheckout = undefined;

    return (
        <div className="flex flex-col h-full space-y-0 -m-6">
            {/* Page heading */}
            <div className="px-6 pt-6 pb-4 flex-shrink-0">
                <PageHeader
                    title="Point of Sale (Transactions)"
                    subtitle="Select products, build your cart, and view estimated totals."
                />
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
                        <ProductPicker />
                    </div>
                </div>

                {/* RIGHT — Cart Panel */}
                <div className="flex-shrink-0 lg:w-96 flex flex-col overflow-hidden border-t lg:border-t-0 border-gray-200 bg-white">
                    <CartPanel onCheckout={handleCheckout} />
                </div>
            </div>
        </div>
    );
};

export default TransactionsPage;
