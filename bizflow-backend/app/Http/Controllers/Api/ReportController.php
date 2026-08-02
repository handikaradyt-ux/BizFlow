<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportQueryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * ReportController — JSON API endpoints for all report types.
 *
 * All query logic is delegated to ReportQueryService, which is shared
 * with ExportController. No SQL is written here.
 */
class ReportController extends Controller
{
    public function __construct(private readonly ReportQueryService $queryService) {}

    /**
     * GET /api/reports/revenue
     */
    public function revenue(Request $request): JsonResponse
    {
        $filters = $request->only(['start_date', 'end_date']);

        return response()->json([
            'success' => true,
            'data'    => $this->queryService->revenueData($filters),
        ]);
    }

    /**
     * GET /api/reports/sales
     */
    public function sales(Request $request): JsonResponse
    {
        $perPage  = min(max((int) $request->input('per_page', 15), 1), 100);
        $filters  = $request->only(['start_date', 'end_date', 'status', 'customer_id']);

        // Build a paginated version — ReportQueryService returns an unpaginated Collection
        // for export use; for the API we paginate directly via the model query here.
        $query = \App\Models\Transaction::with(['customer', 'user'])->orderByDesc('created_at');

        if (!empty($filters['start_date'])) {
            $query->where('created_at', '>=', \Carbon\Carbon::parse($filters['start_date'])->startOfDay());
        }
        if (!empty($filters['end_date'])) {
            $query->where('created_at', '<=', \Carbon\Carbon::parse($filters['end_date'])->endOfDay());
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        $paginator = $query->paginate($perPage);

        $items = collect($paginator->items())->map(fn($tx) => [
            'invoice_number'   => 'INV-' . str_pad($tx->id, 8, '0', STR_PAD_LEFT),
            'transaction_date' => $tx->created_at->toDateTimeString(),
            'customer'         => $tx->customer?->name ?? 'Walk-in Customer',
            'cashier'          => $tx->user?->name ?? '-',
            'subtotal'         => (float) $tx->subtotal,
            'tax'              => (float) $tx->tax,
            'grand_total'      => (float) $tx->grand_total,
            'status'           => $tx->status,
        ]);

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
     */
    public function topProducts(Request $request): JsonResponse
    {
        $filters = $request->only(['start_date', 'end_date', 'limit']);

        return response()->json([
            'success' => true,
            'data'    => $this->queryService->topProductRows($filters),
        ]);
    }

    /**
     * GET /api/reports/monthly-trend
     */
    public function monthlyTrend(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $this->queryService->monthlyTrendRows(),
        ]);
    }

    /**
     * GET /api/reports/daily
     */
    public function daily(Request $request): JsonResponse
    {
        $filters = $request->only(['start_date', 'end_date']);

        return response()->json([
            'success' => true,
            'data'    => $this->queryService->dailyRows($filters),
        ]);
    }
}
