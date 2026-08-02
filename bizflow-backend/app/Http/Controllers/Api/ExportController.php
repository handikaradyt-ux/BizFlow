<?php

namespace App\Http\Controllers\Api;

use App\Exports\SalesExport;
use App\Http\Controllers\Controller;
use App\Jobs\GenerateReportExportJob;
use App\Services\ReportQueryService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * ExportController
 *
 * Handles PDF and Excel exports for all report types.
 *
 * Strategy:
 *  - Small exports (≤ SYNC_LIMIT rows): generate synchronously and stream the file.
 *  - Large exports (> SYNC_LIMIT rows): dispatch a queued job and return a job token.
 *
 * Query logic is fully delegated to ReportQueryService — no duplicated SQL here.
 */
class ExportController extends Controller
{
    /** Rows above this count are exported via a background queue job */
    private const SYNC_LIMIT = 500;

    private const REPORT_TITLES = [
        'sales'         => 'Sales Report',
        'top-products'  => 'Top Products Report',
        'monthly-trend' => 'Monthly Trend Report',
        'daily'         => 'Daily Report',
        'revenue'       => 'Revenue Report',
    ];

    public function __construct(private readonly ReportQueryService $queryService) {}

    // =========================================================================
    // PDF Export  —  GET /api/reports/export/pdf
    // =========================================================================

    public function pdf(Request $request): Response|JsonResponse
    {
        $request->validate([
            'report_type' => ['required', 'string', 'in:sales,top-products,monthly-trend,daily,revenue'],
            'start_date'  => ['nullable', 'date'],
            'end_date'    => ['nullable', 'date', 'after_or_equal:start_date'],
            'status'      => ['nullable', 'string', 'in:completed,pending,cancelled,refunded'],
            'customer_id' => ['nullable', 'integer'],
            'limit'       => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $filters     = $request->only(['start_date', 'end_date', 'status', 'customer_id', 'limit', 'report_type']);
        $reportType  = $request->input('report_type');
        [$rows, $summary, $title] = $this->resolveReportData($reportType, $filters);

        // Large export → queue
        if ($rows->count() > self::SYNC_LIMIT) {
            return $this->dispatchQueuedExport('pdf', $reportType, $filters, $request);
        }

        // Synchronous export
        $pdf = Pdf::loadView('reports.export', [
            'title'        => $title,
            'report_type'  => $reportType,
            'rows'         => $rows,
            'summary'      => $summary,
            'filters'      => $filters,
            'generated_at' => now()->toDateTimeString(),
        ])->setPaper('a4', 'landscape');

        $filename = 'bizflow-' . $reportType . '-' . now()->format('Ymd-His') . '.pdf';

        return response($pdf->output(), 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    // =========================================================================
    // Excel Export  —  GET /api/reports/export/excel
    // =========================================================================

    public function excel(Request $request): Response|JsonResponse
    {
        $request->validate([
            'report_type' => ['required', 'string', 'in:sales,top-products,monthly-trend,daily,revenue'],
            'start_date'  => ['nullable', 'date'],
            'end_date'    => ['nullable', 'date', 'after_or_equal:start_date'],
            'status'      => ['nullable', 'string', 'in:completed,pending,cancelled,refunded'],
            'customer_id' => ['nullable', 'integer'],
            'limit'       => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $filters    = $request->only(['start_date', 'end_date', 'status', 'customer_id', 'limit', 'report_type']);
        $reportType = $request->input('report_type');
        [$rows, $summary, $title] = $this->resolveReportData($reportType, $filters);

        // Large export → queue
        if ($rows->count() > self::SYNC_LIMIT) {
            return $this->dispatchQueuedExport('excel', $reportType, $filters, $request);
        }

        // Synchronous export
        $export = new SalesExport(
            rows: $rows,
            meta: [
                'title'        => $title,
                'report_type'  => $reportType,
                'generated_at' => now()->toDateTimeString(),
                'filters'      => $filters,
            ],
            summary: $summary
        );

        $filename = 'bizflow-' . $reportType . '-' . now()->format('Ymd-His') . '.xlsx';

        return response($export->generate(), 200, [
            'Content-Type'        => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    // =========================================================================
    // Internal helpers
    // =========================================================================

    /**
     * Resolve the data rows, summary, and title for a given report type.
     *
     * @return array [Collection $rows, array|null $summary, string $title]
     */
    private function resolveReportData(string $reportType, array $filters): array
    {
        $title = self::REPORT_TITLES[$reportType] ?? 'Report';

        switch ($reportType) {
            case 'sales':
                $rows   = $this->queryService->salesRows($filters);
                $totals = $rows->reduce(fn($c, $r) => [
                    'grand_total' => ($c['grand_total'] ?? 0) + $r['grand_total'],
                    'tax'         => ($c['tax'] ?? 0) + $r['tax'],
                ], []);
                $summary = [
                    'Total Rows'    => $rows->count(),
                    'Total Revenue' => 'Rp ' . number_format($totals['grand_total'] ?? 0, 0, ',', '.'),
                    'Total Tax'     => 'Rp ' . number_format($totals['tax'] ?? 0, 0, ',', '.'),
                ];
                break;

            case 'top-products':
                $rows    = $this->queryService->topProductRows($filters);
                $summary = [
                    'Products'      => $rows->count(),
                    'Total Revenue' => 'Rp ' . number_format($rows->sum('revenue'), 0, ',', '.'),
                    'Total Qty'     => number_format((int) $rows->sum('quantity_sold')),
                ];
                break;

            case 'monthly-trend':
                $rows    = collect($this->queryService->monthlyTrendRows());
                $summary = ['Months' => $rows->count()];
                break;

            case 'daily':
                $rows    = collect($this->queryService->dailyRows($filters));
                $summary = ['Days' => $rows->count()];
                break;

            default: // revenue
                $data    = $this->queryService->revenueData($filters);
                $rows    = collect([]);
                $summary = [
                    'Total Revenue'   => 'Rp ' . number_format($data['total_revenue'], 0, ',', '.'),
                    'Total Orders'    => $data['total_orders'],
                    'Avg Order Value' => 'Rp ' . number_format($data['average_order_value'], 0, ',', '.'),
                    'Revenue Change'  => $data['comparison']['revenue_change_percent'] . '%',
                ];
                break;
        }

        return [$rows, $summary, $title];
    }

    /**
     * Dispatch the export job and return a 202 Accepted response with a job token.
     */
    private function dispatchQueuedExport(
        string  $format,
        string  $reportType,
        array   $filters,
        Request $request
    ): JsonResponse {
        $jobId = Str::uuid()->toString();

        GenerateReportExportJob::dispatch(
            format:     $format,
            reportType: $reportType,
            filters:    $filters,
            userId:     $request->user()->id,
            jobId:      $jobId
        );

        return response()->json([
            'success' => true,
            'queued'  => true,
            'message' => 'Your export is being generated in the background. '
                       . 'You will be notified when it is ready.',
            'job_id'  => $jobId,
        ], 202);
    }
}
