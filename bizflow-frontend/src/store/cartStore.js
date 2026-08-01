import { create } from 'zustand';

const useCartStore = create((set, get) => ({
    items: [],
    customerId: null,

    // Set the selected customer
    setCustomer: (customerId) => set({ customerId }),

    // Add a product to the cart; if it already exists, increment its quantity
    addItem: (product) => {
        const { items } = get();
        const existing = items.find((i) => i.product.id === product.id);

        if (existing) {
            set({
                items: items.map((i) =>
                    i.product.id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                ),
            });
        } else {
            set({
                items: [
                    ...items,
                    {
                        product,
                        quantity: 1,
                        unitPrice: parseFloat(product.selling_price),
                    },
                ],
            });
        }
    },

    // Increase quantity of a specific item
    increaseQty: (productId) => {
        set({
            items: get().items.map((i) =>
                i.product.id === productId
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            ),
        });
    },

    // Decrease quantity — remove the item if quantity drops below 1
    decreaseQty: (productId) => {
        const { items } = get();
        const item = items.find((i) => i.product.id === productId);
        if (!item) return;

        if (item.quantity <= 1) {
            set({ items: items.filter((i) => i.product.id !== productId) });
        } else {
            set({
                items: items.map((i) =>
                    i.product.id === productId
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                ),
            });
        }
    },

    // Remove a specific item entirely
    removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.product.id !== productId) });
    },

    // Clear the entire cart
    clearCart: () => set({ items: [], customerId: null }),

    // Computed: estimated subtotal
    get subtotal() {
        return get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    },
}));

export default useCartStore;
