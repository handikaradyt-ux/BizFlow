<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InvoiceResource;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TransactionController extends Controller
{
    /**
     * Store a newly created transaction in storage.
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Validate request structure
        $validated = $request->validate([
            'customer_id'          => ['nullable', 'integer', 'exists:customers,id'],
            'items'                => ['required', 'array', 'min:1'],
            'items.*.product_id'   => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity'     => ['required', 'integer', 'min:1'],
        ]);

        // 2. Fetch products from database (never trust client-submitted prices)
        $productIds = collect($validated['items'])->pluck('product_id')->unique();
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        // 3. Validate stock availability before touching the database
        $stockErrors = [];
        foreach ($validated['items'] as $index => $item) {
            $product = $products->get($item['product_id']);
            if (!$product || $item['quantity'] > $product->stock) {
                $stockErrors["items.{$index}.quantity"] = [
                    'Requested quantity exceeds available stock.',
                ];
            }
        }

        if (!empty($stockErrors)) {
            return response()->json([
                'message' => 'Insufficient stock.',
                'errors'  => $stockErrors,
            ], 422);
        }

        // 4. Calculate totals server-side — ignore any client-submitted values
        $subtotal = 0;
        $calculatedItems = [];

        foreach ($validated['items'] as $item) {
            $product   = $products->get($item['product_id']);
            $unitPrice = (float) $product->selling_price;
            $lineTotal = $unitPrice * $item['quantity'];
            $subtotal += $lineTotal;

            $calculatedItems[] = [
                'product_id' => $product->id,
                'quantity'   => $item['quantity'],
                'unit_price' => $unitPrice,
                'line_total' => $lineTotal,
                'product'    => $product,  // passed by reference for stock decrement
            ];
        }

        $tax       = round($subtotal * 0.10, 2);
        $grandTotal = round($subtotal + $tax, 2);

        // 5. Execute ALL writes atomically inside DB::transaction()
        //    Any uncaught exception automatically triggers a full rollback.
        try {
            $transaction = DB::transaction(function () use (
                $validated, $subtotal, $tax, $grandTotal, $calculatedItems, $request
            ) {
                // 5a. Create transaction header
                $transaction = Transaction::create([
                    'customer_id' => $validated['customer_id'] ?? null,
                    'user_id'     => $request->user()->id,
                    'subtotal'    => $subtotal,
                    'tax'         => $tax,
                    'grand_total' => $grandTotal,
                    'status'      => 'completed',
                ]);

                // 5b. Create each detail row and decrement stock atomically
                foreach ($calculatedItems as $item) {
                    $transaction->details()->create([
                        'product_id' => $item['product_id'],
                        'quantity'   => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'line_total' => $item['line_total'],
                    ]);

                    // 5c. Decrement stock — never below zero
                    $item['product']->decrement('stock', $item['quantity']);
                }

                return $transaction;
            });
        } catch (\Throwable $e) {
            Log::error('Transaction store failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Transaction could not be completed. Please try again.',
                'error'   => $e->getMessage(),
            ], 500);
        }

        // 6. Return success response
        $transaction->load(['details.product', 'customer', 'user']);

        return response()->json([
            'message' => 'Transaction created successfully.',
            'data'    => $transaction,
        ], 201);
    }

    /**
     * Update transaction status with transition validation.
     */
    public function update(Request $request, Transaction $transaction): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:' . implode(',', Transaction::ALL_STATUSES)],
        ]);

        $newStatus = $validated['status'];

        if (!$transaction->canTransitionTo($newStatus)) {
            return response()->json([
                'message' => 'Invalid status transition.',
                'errors'  => [
                    'status' => [
                        "Cannot transition from '{$transaction->status}' to '{$newStatus}'.",
                    ],
                ],
            ], 422);
        }

        $transaction->update(['status' => $newStatus]);

        return response()->json([
            'message' => 'Transaction status updated successfully.',
            'data'    => $transaction->fresh(),
        ]);
    }

    /**
     * Return JSON invoice data for a single transaction.
     */
    public function invoice(Transaction $transaction): JsonResponse
    {
        $transaction->load(['details.product', 'customer', 'user']);

        return response()->json([
            'data' => new InvoiceResource($transaction),
        ]);
    }
}
