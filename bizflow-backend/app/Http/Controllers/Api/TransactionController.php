<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Store a newly created transaction in storage.
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Validate request structure
        $validated = $request->validate([
            'customer_id' => ['nullable', 'integer', 'exists:customers,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        // 2. Fetch products from database
        $productIds = collect($validated['items'])->pluck('product_id')->unique();
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        // 3. Validate stock availability
        $stockErrors = [];
        foreach ($validated['items'] as $index => $item) {
            $product = $products->get($item['product_id']);
            if (!$product || $item['quantity'] > $product->stock) {
                $stockErrors["items.{$index}.quantity"] = [
                    "Requested quantity exceeds available stock."
                ];
            }
        }

        if (!empty($stockErrors)) {
            return response()->json([
                'message' => 'Insufficient stock.',
                'errors' => $stockErrors,
            ], 422);
        }

        // 4. Calculate totals server-side
        $subtotal = 0;
        $calculatedItems = [];

        foreach ($validated['items'] as $item) {
            $product = $products->get($item['product_id']);
            $unitPrice = (float) $product->selling_price;
            $lineTotal = $unitPrice * $item['quantity'];
            $subtotal += $lineTotal;

            $calculatedItems[] = [
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'unit_price' => $unitPrice,
                'line_total' => $lineTotal,
                'product' => $product,
            ];
        }

        $tax = $subtotal * 0.10; // 10% Tax rate
        $grandTotal = $subtotal + $tax;

        // 5. Execute DB Transaction atomically
        $transaction = DB::transaction(function () use ($validated, $subtotal, $tax, $grandTotal, $calculatedItems, $request) {
            // Create transaction header
            $transaction = Transaction::create([
                'customer_id' => $validated['customer_id'] ?? null,
                'user_id' => $request->user()?->id ?? auth()->id(),
                'subtotal' => $subtotal,
                'tax' => $tax,
                'grand_total' => $grandTotal,
                'status' => 'completed',
            ]);

            // Create transaction details and decrement product stock
            foreach ($calculatedItems as $item) {
                $transaction->details()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'line_total' => $item['line_total'],
                ]);

                // Decrement stock in database
                $item['product']->decrement('stock', $item['quantity']);
            }

            return $transaction;
        });

        // 6. Return response with loaded relations
        $transaction->load(['details.product', 'customer', 'user']);

        return response()->json([
            'message' => 'Transaction created successfully.',
            'data' => $transaction,
        ], 201);
    }
}
