<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    private const CACHE_TTL = 300; // 5 minutes in seconds

    /**
     * Return aggregated summary metrics for the dashboard.
     */
    public function summary(): JsonResponse
    {
        $data = Cache::remember('dashboard.summary', self::CACHE_TTL, function () {
            return [
                'total_revenue'   => (float) Transaction::where('status', 'completed')->sum('grand_total'),
                'total_orders'    => Transaction::where('status', 'completed')->count(),
                'total_products'  => Product::where('status', 'active')->count(),
                'total_customers' => Customer::count(),
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }

    /**
     * Return monthly revenue and orders for the last 12 months (completed transactions only).
     */
    public function monthlyTrends(): JsonResponse
    {
        $data = Cache::remember('dashboard.monthly_trends', self::CACHE_TTL, function () {
            // Build a list of the last 12 months as Period objects
            $months = collect();
            for ($i = 11; $i >= 0; $i--) {
                $months->push(now()->subMonths($i)->startOfMonth());
            }

            // Fetch aggregated monthly data from the DB in a single query
            $rows = Transaction::select(
                    DB::raw("DATE_FORMAT(created_at, '%Y-%m') as period"),
                    DB::raw('SUM(grand_total) as revenue'),
                    DB::raw('COUNT(*) as orders')
                )
                ->where('status', 'completed')
                ->where('created_at', '>=', now()->subMonths(11)->startOfMonth())
                ->groupBy('period')
                ->pluck('revenue', 'period')    // used below after mapping
                ->toArray();

            // Re-fetch as full rows for both revenue and orders
            $rows = Transaction::select(
                    DB::raw("DATE_FORMAT(created_at, '%Y-%m') as period"),
                    DB::raw('SUM(grand_total) as revenue'),
                    DB::raw('COUNT(*) as orders')
                )
                ->where('status', 'completed')
                ->where('created_at', '>=', now()->subMonths(11)->startOfMonth())
                ->groupBy('period')
                ->get()
                ->keyBy('period');

            // Map all 12 months, filling gaps with zeros
            return $months->map(function ($month) use ($rows) {
                $key = $month->format('Y-m');
                $row = $rows->get($key);

                return [
                    'month'   => $month->format('M Y'),
                    'revenue' => $row ? (float) $row->revenue : 0.0,
                    'orders'  => $row ? (int)   $row->orders  : 0,
                ];
            })->values()->all();
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }

    /**
     * Return the most recent completed transactions.
     */
    public function recentTransactions(Request $request): JsonResponse
    {
        $limit = min((int) $request->query('limit', 5), 50);

        $cacheKey = "dashboard.recent_transactions.{$limit}";

        $data = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($limit) {
            return Transaction::with(['customer', 'user'])
                ->where('status', 'completed')
                ->orderByDesc('created_at')
                ->limit($limit)
                ->get()
                ->map(function (Transaction $tx) {
                    return [
                        'invoice_number' => 'INV-' . str_pad($tx->id, 8, '0', STR_PAD_LEFT),
                        'customer_name'  => $tx->customer?->name ?? 'Walk-in Customer',
                        'cashier'        => $tx->user?->name ?? '-',
                        'grand_total'    => (float) $tx->grand_total,
                        'status'         => $tx->status,
                        'created_at'     => $tx->created_at->toDateTimeString(),
                    ];
                })
                ->all();
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }

    /**
     * Return products with stock at or below a threshold.
     */
    public function lowStock(Request $request): JsonResponse
    {
        $useMinimumStock = !$request->has('threshold');
        $threshold       = $useMinimumStock ? null : max(0, (int) $request->query('threshold'));

        $cacheKey = 'dashboard.low_stock.' . ($threshold ?? 'minimum_stock');

        $data = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($useMinimumStock, $threshold) {
            $query = Product::with('category')
                ->where('status', 'active')
                ->orderBy('stock');

            if ($useMinimumStock) {
                // Compare stock against each product's own minimum_stock column
                $query->whereColumn('stock', '<=', 'minimum_stock');
            } else {
                $query->where('stock', '<=', $threshold);
            }

            return $query->get()->map(function (Product $product) {
                return [
                    'id'            => $product->id,
                    'name'          => $product->name,
                    'sku'           => $product->sku,
                    'stock'         => $product->stock,
                    'minimum_stock' => $product->minimum_stock,
                    'category'      => $product->category?->name ?? '-',
                    'status'        => $product->status,
                ];
            })->all();
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }
}
