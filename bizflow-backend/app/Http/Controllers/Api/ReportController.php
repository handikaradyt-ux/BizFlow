<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * GET /api/reports/revenue
     * Calculate revenue, orders, average order value, and period-over-period comparison.
     */
    public function revenue(Request $request): JsonResponse
    {
        // Parse dates or default to current month
        $startDate = $request->filled('start_date') 
            ? Carbon::parse($request->input('start_date'))->startOfDay() 
            : now()->startOfMonth();
            
        $endDate = $request->filled('end_date') 
            ? Carbon::parse($request->input('end_date'))->endOfDay() 
            : now()->endOfDay();

        // Calculate current period stats
        $currentStats = Transaction::where('status', 'completed')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select(
                DB::raw('SUM(grand_total) as total_revenue'),
                DB::raw('COUNT(id) as total_orders')
            )
            ->first();

        $currentRevenue = (float) $currentStats->total_revenue;
        $currentOrders = (int) $currentStats->total_orders;
        $currentAvg = $currentOrders > 0 ? $currentRevenue / $currentOrders : 0;

        // Calculate previous period dates (same length of time)
        $diffInDays = $startDate->diffInDays($endDate);
        $prevEndDate = $startDate->copy()->subSecond();
        $prevStartDate = $prevEndDate->copy()->subDays($diffInDays)->startOfDay();

        // Calculate previous period stats
        $prevStats = Transaction::where('status', 'completed')
            ->whereBetween('created_at', [$prevStartDate, $prevEndDate])
            ->select(
                DB::raw('SUM(grand_total) as total_revenue'),
                DB::raw('COUNT(id) as total_orders')
            )
            ->first();

        $prevRevenue = (float) $prevStats->total_revenue;
        $prevOrders = (int) $prevStats->total_orders;

        // Calculate percentage changes
        $revChange = $prevRevenue > 0 ? (($currentRevenue - $prevRevenue) / $prevRevenue) * 100 : ($currentRevenue > 0 ? 100 : 0);
        $ordChange = $prevOrders > 0 ? (($currentOrders - $prevOrders) / $prevOrders) * 100 : ($currentOrders > 0 ? 100 : 0);

        return response()->json([
            'success' => true,
            'data' => [
                'total_revenue'       => round($currentRevenue, 2),
                'total_orders'        => $currentOrders,
                'average_order_value' => round($currentAvg, 2),
                'comparison' => [
                    'revenue_change_percent' => round($revChange, 1),
                    'order_change_percent'   => round($ordChange, 1),
                ],
            ]
        ]);
    }

    /**
     * GET /api/reports/sales
     * Paginated list of sales with filters.
     */
    public function sales(Request $request): JsonResponse
    {
        $query = Transaction::with(['customer', 'user'])
            ->orderByDesc('created_at');

        if ($request->filled('start_date')) {
            $query->where('created_at', '>=', Carbon::parse($request->input('start_date'))->startOfDay());
        }

        if ($request->filled('end_date')) {
            $query->where('created_at', '<=', Carbon::parse($request->input('end_date'))->endOfDay());
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->input('customer_id'));
        }

        $perPage = min(max((int) $request->input('per_page', 15), 1), 100);
        $paginator = $query->paginate($perPage);

        // Map to custom resource structure without creating a new Resource class
        $items = collect($paginator->items())->map(function ($tx) {
            return [
                'invoice_number'   => 'INV-' . str_pad($tx->id, 8, '0', STR_PAD_LEFT),
                'transaction_date' => $tx->created_at->toDateTimeString(),
                'customer'         => $tx->customer?->name ?? 'Walk-in Customer',
                'cashier'          => $tx->user?->name ?? '-',
                'subtotal'         => (float) $tx->subtotal,
                'tax'              => (float) $tx->tax,
                'grand_total'      => (float) $tx->grand_total,
                'status'           => $tx->status,
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $items,
            'meta'    => [
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'per_page'     => $paginator->perPage(),
                'total'        => $paginator->total(),
            ]
        ]);
    }

    /**
     * GET /api/reports/top-products
     * Top selling products by quantity and revenue.
     */
    public function topProducts(Request $request): JsonResponse
    {
        $query = TransactionDetail::join('transactions', 'transaction_details.transaction_id', '=', 'transactions.id')
            ->join('products', 'transaction_details.product_id', '=', 'products.id')
            ->where('transactions.status', 'completed')
            ->select(
                'products.name as product_name',
                'products.sku',
                DB::raw('SUM(transaction_details.quantity) as quantity_sold'),
                DB::raw('SUM(transaction_details.line_total) as revenue')
            )
            ->groupBy('products.id', 'products.name', 'products.sku');

        if ($request->filled('start_date')) {
            $query->where('transactions.created_at', '>=', Carbon::parse($request->input('start_date'))->startOfDay());
        }

        if ($request->filled('end_date')) {
            $query->where('transactions.created_at', '<=', Carbon::parse($request->input('end_date'))->endOfDay());
        }

        $limit = min(max((int) $request->input('limit', 10), 1), 100);
        
        $results = $query->orderByDesc('quantity_sold')
            ->limit($limit)
            ->get()
            ->map(function ($row) {
                return [
                    'product_name'  => $row->product_name,
                    'sku'           => $row->sku,
                    'quantity_sold' => (int) $row->quantity_sold,
                    'revenue'       => (float) $row->revenue,
                ];
            });

        return response()->json([
            'success' => true,
            'data'    => $results,
        ]);
    }

    /**
     * GET /api/reports/monthly-trend
     * Last 12 months revenue and order count.
     */
    public function monthlyTrend(): JsonResponse
    {
        $months = collect();
        for ($i = 11; $i >= 0; $i--) {
            $months->push(now()->subMonths($i)->startOfMonth());
        }

        $rows = Transaction::select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as period"),
                DB::raw('SUM(grand_total) as revenue'),
                DB::raw('COUNT(id) as order_count')
            )
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subMonths(11)->startOfMonth())
            ->groupBy('period')
            ->get()
            ->keyBy('period');

        $data = $months->map(function ($month) use ($rows) {
            $key = $month->format('Y-m');
            $row = $rows->get($key);

            return [
                'month'       => $month->format('M Y'),
                'revenue'     => $row ? (float) $row->revenue : 0.0,
                'order_count' => $row ? (int) $row->order_count : 0,
            ];
        })->values()->all();

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }

    /**
     * GET /api/reports/daily
     * Daily stats for the current month.
     */
    public function daily(Request $request): JsonResponse
    {
        // By default use current month, or support explicit date passing if needed
        $start = now()->startOfMonth();
        $end = now()->endOfMonth();
        
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $start = Carbon::parse($request->input('start_date'))->startOfDay();
            $end = Carbon::parse($request->input('end_date'))->endOfDay();
        }

        $period = CarbonPeriod::create($start, $end);
        
        $rows = Transaction::select(
                DB::raw("DATE(created_at) as day"),
                DB::raw('SUM(grand_total) as revenue'),
                DB::raw('COUNT(id) as orders')
            )
            ->where('status', 'completed')
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('day')
            ->get()
            ->keyBy('day');

        $data = [];
        foreach ($period as $date) {
            $key = $date->format('Y-m-d');
            $row = $rows->get($key);
            
            $data[] = [
                'date'    => $key,
                'revenue' => $row ? (float) $row->revenue : 0.0,
                'orders'  => $row ? (int) $row->orders : 0,
            ];
        }

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }
}
