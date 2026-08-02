<?php

namespace App\Jobs;

use App\Exports\SalesExport;
use App\Services\ReportQueryService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * GenerateReportExportJob
 *
 * Handles large report exports asynchronously.
 *
 * The job generates the file, stores it in storage/app/exports/, and
 * logs the download URL. In a full production implementation the
 * notification step would email the user with the signed temporary URL.
 *
 * Dispatched by ExportController when row count exceeds SYNC_LIMIT.
 */
class GenerateReportExportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** Maximum attempts before the job is considered failed */
    public int $tries = 3;

    /** Seconds before the job times out */
    public int $timeout = 300;

    public function __construct(
        private readonly string $format,       // 'pdf' | 'excel'
        private readonly string $reportType,   // 'sales' | 'top-products' | 'monthly-trend' | 'daily' | 'revenue'
        private readonly array  $filters,
        private readonly int    $userId,
        private readonly string $jobId         // Unique token returned to client for polling
    ) {}

    public function handle(ReportQueryService $queryService): void
    {
        try {
            Log::info("GenerateReportExportJob started", [
                'job_id'      => $this->jobId,
                'format'      => $this->format,
                'report_type' => $this->reportType,
                'user_id'     => $this->userId,
            ]);

            [$rows, $summary, $title] = $this->resolveData($queryService);

            $filename = 'exports/' . $this->jobId . '.' . ($this->format === 'pdf' ? 'pdf' : 'xlsx');

            if ($this->format === 'pdf') {
                $content = $this->generatePdf($rows, $summary, $title);
            } else {
                $content = $this->generateExcel($rows, $summary, $title);
            }

            Storage::disk('local')->put($filename, $content);

            Log::info("GenerateReportExportJob completed", [
                'job_id'   => $this->jobId,
                'path'     => $filename,
                'size'     => strlen($content),
            ]);

            // In production: notify user via email / websocket with signed URL
            // Mail::to($user)->send(new ReportReadyMail($signedUrl));

        } catch (\Throwable $e) {
            Log::error("GenerateReportExportJob failed", [
                'job_id' => $this->jobId,
                'error'  => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    // -------------------------------------------------------------------------
    // Internal helpers
    // -------------------------------------------------------------------------

    private function resolveData(ReportQueryService $queryService): array
    {
        $summary = null;

        switch ($this->reportType) {
            case 'sales':
                $rows    = $queryService->salesRows($this->filters);
                $totals  = $rows->reduce(fn($c, $r) => [
                    'grand_total' => ($c['grand_total'] ?? 0) + $r['grand_total'],
                    'tax'         => ($c['tax'] ?? 0) + $r['tax'],
                ], []);
                $summary = [
                    'Total Rows'    => $rows->count(),
                    'Total Revenue' => 'Rp ' . number_format($totals['grand_total'] ?? 0, 0, ',', '.'),
                    'Total Tax'     => 'Rp ' . number_format($totals['tax'] ?? 0, 0, ',', '.'),
                ];
                $title = 'Sales Report';
                break;

            case 'top-products':
                $rows  = $queryService->topProductRows($this->filters);
                $summary = [
                    'Total Products' => $rows->count(),
                    'Total Revenue'  => 'Rp ' . number_format($rows->sum('revenue'), 0, ',', '.'),
                    'Total Qty Sold' => number_format($rows->sum('quantity_sold')),
                ];
                $title = 'Top Products Report';
                break;

            case 'monthly-trend':
                $rows    = collect($queryService->monthlyTrendRows());
                $summary = ['Months' => $rows->count()];
                $title   = 'Monthly Trend Report';
                break;

            case 'daily':
                $rows    = collect($queryService->dailyRows($this->filters));
                $summary = ['Days' => $rows->count()];
                $title   = 'Daily Report';
                break;

            default: // 'revenue'
                $data = $queryService->revenueData($this->filters);
                $rows = collect([]);
                $summary = [
                    'Total Revenue'  => 'Rp ' . number_format($data['total_revenue'], 0, ',', '.'),
                    'Total Orders'   => $data['total_orders'],
                    'Avg Order Value'=> 'Rp ' . number_format($data['average_order_value'], 0, ',', '.'),
                ];
                $title = 'Revenue Report';
                break;
        }

        return [$rows instanceof Collection ? $rows : collect($rows), $summary, $title];
    }

    private function generatePdf(Collection $rows, ?array $summary, string $title): string
    {
        $pdf = Pdf::loadView('reports.export', [
            'title'        => $title,
            'report_type'  => $this->reportType,
            'rows'         => $rows,
            'summary'      => $summary,
            'filters'      => $this->filters,
            'generated_at' => now()->toDateTimeString(),
        ])->setPaper('a4', 'landscape');

        return $pdf->output();
    }

    private function generateExcel(Collection $rows, ?array $summary, string $title): string
    {
        $export = new SalesExport(
            rows: $rows,
            meta: [
                'title'        => $title,
                'report_type'  => $this->reportType,
                'generated_at' => now()->toDateTimeString(),
                'filters'      => $this->filters,
            ],
            summary: $summary
        );

        return $export->generate();
    }
}
