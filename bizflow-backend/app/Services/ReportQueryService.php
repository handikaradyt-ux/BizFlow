<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\TransactionDetail;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * ReportQueryService
 *
 * Centralises all report aggregate queries so they can be shared between
 * ReportController (JSON API) and ExportController (PDF / Excel) without
 * any code duplication.
 */
class ReportQueryService
{
    /**
     * Parse date range from request-like array. Defaults to current month.
     *
     * @param  array $filters  ['start_date'=>'...', 'end_date'=>'...']
     * @return array           ['start' => Carbon, 'end' => Carbon]
     */
    public function resolveDateRange(array $filters): array
    {
        $start = !empty($filters['start_date'])
            ? Carbon::parse($filters['start_date'])->startOfDay()
            : now()->startOfMonth();

        $end = !empty($filters['end_date'])
            ? Carbon::parse($filters['end_date'])->endOfDay()
            : now()->endOfDay();

        return compact('start', 'end');
    }

    /**
     * Revenue summary + period-over-period comparison.
     */
    public function revenueData(array $filters): array
    {
        ['start' => $start, 'end' => $end] = $this->resolveDateRange($filters);

        $current = $this->periodStats('completed', $start, $end);
        $currentRevenue = (float) $current->total_revenue;
        $currentOrders  = (int)   $current->total_orders;
        $currentAvg     = $currentOrders > 0 ? $currentRevenue / $currentOrders : 0;

        // Previous period of equal length
        $diffInDays   = (int) $start->diffInDays($end);
        $prevEnd      = $start->copy()->subSecond();
        $prevStart    = $prevEnd->copy()->subDays($diffInDays)->startOfDay();
        $prev         = $this->periodStats('completed', $prevStart, $prevEnd);

        $prevRevenue  = (float) $prev->total_revenue;
        $prevOrders   = (int)   $prev->total_orders;

        $revChange = $prevRevenue > 0
            ? (($currentRevenue - $prevRevenue) / $prevRevenue) * 100
            : ($currentRevenue > 0 ? 100 : 0);

        $ordChange = $prevOrders > 0
            ? (($currentOrders - $prevOrders) / $prevOrders) * 100
            : ($currentOrders > 0 ? 100 : 0);

        return [
            'period'              => $start->toDateString() . ' – ' . $end->toDateString(),
            'total_revenue'       => round($currentRevenue, 2),
            'total_orders'        => $currentOrders,
            'average_order_value' => round($currentAvg, 2),
            'comparison' => [
                'revenue_change_percent' => round($revChange, 1),
                'order_change_percent'   => round($ordChange, 1),
            ],
        ];
    }

    /**
     * Flat sales rows (no pagination) for exports.
     */
    public function salesRows(array $filters): Collection
    {
        $query = Transaction::with(['customer', 'user'])->orderByDesc('created_at');

        if (!empty($filters['start_date'])) {
            $query->where('created_at', '>=', Carbon::parse($filters['start_date'])->startOfDay());
        }
        if (!empty($filters['end_date'])) {
            $query->where('created_at', '<=', Carbon::parse($filters['end_date'])->endOfDay());
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        return $query->get()->map(fn($tx) => [
            'invoice_number'   => 'INV-' . str_pad($tx->id, 8, '0', STR_PAD_LEFT),
            'transaction_date' => $tx->created_at->toDateTimeString(),
            'customer'         => $tx->customer?->name ?? 'Walk-in Customer',
            'cashier'          => $tx->user?->name ?? '-',
            'subtotal'         => (float) $tx->subtotal,
            'tax'              => (float) $tx->tax,
            'grand_total'      => (float) $tx->grand_total,
            'status'           => $tx->status,
        ]);
    }

    /**
     * Top products by quantity sold.
     */
    public function topProductRows(array $filters): Collection
    {
        $limit = min(max((int) ($filters['limit'] ?? 10), 1), 100);

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

        if (!empty($filters['start_date'])) {
            $query->where('transactions.created_at', '>=', Carbon::parse($filters['start_date'])->startOfDay());
        }
        if (!empty($filters['end_date'])) {
            $query->where('transactions.created_at', '<=', Carbon::parse($filters['end_date'])->endOfDay());
        }

        return $query->orderByDesc('quantity_sold')
            ->limit($limit)
            ->get()
            ->map(fn($row) => [
                'product_name'  => $row->product_name,
                'sku'           => $row->sku,
                'quantity_sold' => (int) $row->quantity_sold,
                'revenue'       => (float) $row->revenue,
            ]);
    }

    /**
     * Monthly trend (last 12 months).
     */
    public function monthlyTrendRows(): array
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

        return $months->map(function ($month) use ($rows) {
            $key = $month->format('Y-m');
            $row = $rows->get($key);
            return [
                'month'       => $month->format('M Y'),
                'revenue'     => $row ? (float) $row->revenue : 0.0,
                'order_count' => $row ? (int) $row->order_count : 0,
            ];
        })->values()->all();
    }

    /**
     * Daily stats for the given (or current) month.
     */
    public function dailyRows(array $filters): array
    {
        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $start = Carbon::parse($filters['start_date'])->startOfDay();
            $end   = Carbon::parse($filters['end_date'])->endOfDay();
        } else {
            $start = now()->startOfMonth();
            $end   = now()->endOfMonth();
        }

        $period = CarbonPeriod::create($start, $end);

        $rows = Transaction::select(
                DB::raw('DATE(created_at) as day'),
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
            $key  = $date->format('Y-m-d');
            $row  = $rows->get($key);
            $data[] = [
                'date'    => $key,
                'revenue' => $row ? (float) $row->revenue : 0.0,
                'orders'  => $row ? (int) $row->orders : 0,
            ];
        }
        return $data;
    }

    // -------------------------------------------------------------------------
    // Internal helper
    // -------------------------------------------------------------------------

    private function periodStats(string $status, Carbon $start, Carbon $end): object
    {
        return Transaction::where('status', $status)
            ->whereBetween('created_at', [$start, $end])
            ->select(
                DB::raw('COALESCE(SUM(grand_total), 0) as total_revenue'),
                DB::raw('COUNT(id) as total_orders')
            )
            ->first();
    }
}
