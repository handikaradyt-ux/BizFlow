import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CheckCircle2 } from 'lucide-react';

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

export const InvoiceModal = ({ isOpen, onClose, invoice }) => {
    if (!invoice) return null;

    const getStatusVariant = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'danger';
            case 'refunded': return 'gray';
            default: return 'gray';
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Transaction Invoice"
            className="max-w-xl"
            footer={
                <Button variant="primary" onClick={onClose}>
                    Done
                </Button>
            }
        >
            <div className="space-y-5">
                {/* Header Banner */}
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-emerald-900">Transaction Completed Successfully</p>
                        <p className="text-xs text-emerald-700">Stock updated and invoice recorded.</p>
                    </div>
                </div>

                {/* Invoice Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div>
                        <span className="text-xs text-gray-500 block uppercase font-medium">Invoice Number</span>
                        <span className="font-mono font-bold text-gray-900">{invoice.invoice_number}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block uppercase font-medium">Date & Time</span>
                        <span className="font-medium text-gray-800">{invoice.transaction_date}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block uppercase font-medium">Cashier</span>
                        <span className="font-medium text-gray-800">{invoice.cashier?.name || '-'}</span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block uppercase font-medium">Customer</span>
                        <span className="font-medium text-gray-800">
                            {invoice.customer ? `${invoice.customer.name} (${invoice.customer.phone})` : 'Walk-in Customer'}
                        </span>
                    </div>
                    <div className="col-span-2 flex items-center justify-between pt-2 border-t border-gray-200">
                        <span className="text-xs text-gray-500 uppercase font-medium">Status</span>
                        <Badge variant={getStatusVariant(invoice.status)} className="capitalize">
                            {invoice.status}
                        </Badge>
                    </div>
                </div>

                {/* Purchased Items Table */}
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Items Purchased</h4>
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                                <tr>
                                    <th className="py-2.5 px-3 font-semibold">Product</th>
                                    <th className="py-2.5 px-3 font-semibold text-center">Qty</th>
                                    <th className="py-2.5 px-3 font-semibold text-right">Price</th>
                                    <th className="py-2.5 px-3 font-semibold text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {(invoice.items || []).map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50">
                                        <td className="py-2.5 px-3 font-medium text-gray-900">
                                            {item.product_name}
                                            {item.sku && <span className="block text-[10px] text-gray-400 font-mono">{item.sku}</span>}
                                        </td>
                                        <td className="py-2.5 px-3 text-center text-gray-700">{item.quantity}</td>
                                        <td className="py-2.5 px-3 text-right text-gray-700">{fmt(item.unit_price)}</td>
                                        <td className="py-2.5 px-3 text-right font-semibold text-gray-900">{fmt(item.line_total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Totals Summary */}
                <div className="space-y-1.5 pt-2 text-sm border-t border-gray-100">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-medium text-gray-900">{fmt(invoice.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Tax (10%)</span>
                        <span className="font-medium text-gray-900">{fmt(invoice.tax)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                        <span>Grand Total</span>
                        <span className="text-blue-600">{fmt(invoice.grand_total)}</span>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
