<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

/**
 * SalesExport
 *
 * Generates a professional branded Excel (.xlsx) file for any report type.
 * Accepts pre-built rows from ReportQueryService so the query is never duplicated.
 */
class SalesExport
{
    private Spreadsheet $spreadsheet;

    // Brand colours
    private const BRAND_BG    = '1E3A5F';  // deep navy
    private const BRAND_TEXT  = 'FFFFFF';
    private const ALT_ROW_BG  = 'F0F4F8';
    private const TOTAL_BG    = 'E8F4FD';
    private const ACCENT      = '2563EB';  // blue-600

    public function __construct(
        private readonly Collection $rows,
        private readonly array      $meta,          // ['title', 'filters', 'generated_at', 'report_type']
        private readonly ?array     $summary = null // optional totals row
    ) {
        $this->spreadsheet = new Spreadsheet();
    }

    /**
     * Write the spreadsheet and return the raw string content
     * (caller is responsible for streaming or saving to disk).
     */
    public function generate(): string
    {
        $sheet = $this->spreadsheet->getActiveSheet();
        $sheet->setTitle('Report');

        $currentRow = 1;
        $currentRow = $this->writeHeader($sheet, $currentRow);
        $currentRow = $this->writeFilterInfo($sheet, $currentRow);
        $currentRow = $this->writeTableHeader($sheet, $currentRow);
        $currentRow = $this->writeDataRows($sheet, $currentRow);
        $this->writeSummary($sheet, $currentRow);

        // Auto-size columns
        foreach (range('A', $sheet->getHighestColumn()) as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new Xlsx($this->spreadsheet);

        ob_start();
        $writer->save('php://output');
        return ob_get_clean();
    }

    // -------------------------------------------------------------------------
    // Section writers
    // -------------------------------------------------------------------------

    private function writeHeader($sheet, int $row): int
    {
        $sheet->mergeCells("A{$row}:H{$row}");
        $sheet->setCellValue("A{$row}", 'BizFlow POS — ' . ($this->meta['title'] ?? 'Report'));
        $sheet->getStyle("A{$row}")->applyFromArray([
            'font'      => ['bold' => true, 'size' => 16, 'color' => ['rgb' => self::BRAND_TEXT]],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => self::BRAND_BG]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getRowDimension($row)->setRowHeight(30);

        $row++;
        $sheet->mergeCells("A{$row}:H{$row}");
        $sheet->setCellValue("A{$row}", 'Generated: ' . ($this->meta['generated_at'] ?? now()->toDateTimeString()));
        $sheet->getStyle("A{$row}")->applyFromArray([
            'font'      => ['italic' => true, 'size' => 10, 'color' => ['rgb' => self::BRAND_TEXT]],
            'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => self::BRAND_BG]],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);
        $sheet->getRowDimension($row)->setRowHeight(18);

        return $row + 2; // blank row
    }

    private function writeFilterInfo($sheet, int $row): int
    {
        $filters = $this->meta['filters'] ?? [];
        if (empty($filters)) {
            return $row;
        }

        $sheet->setCellValue("A{$row}", 'Applied Filters');
        $sheet->getStyle("A{$row}")->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => self::ACCENT]],
        ]);
        $row++;

        foreach ($filters as $label => $value) {
            if (!empty($value)) {
                $sheet->setCellValue("A{$row}", $label);
                $sheet->setCellValue("B{$row}", $value);
                $row++;
            }
        }

        return $row + 1; // blank row
    }

    private function writeTableHeader($sheet, int $row): int
    {
        if ($this->rows->isEmpty()) {
            return $row;
        }

        $columns = array_keys($this->rows->first());
        $col     = 'A';
        foreach ($columns as $column) {
            $sheet->setCellValue("{$col}{$row}", strtoupper(str_replace('_', ' ', $column)));
            $sheet->getStyle("{$col}{$row}")->applyFromArray([
                'font'      => ['bold' => true, 'color' => ['rgb' => self::BRAND_TEXT]],
                'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => self::ACCENT]],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                'borders'   => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'AAAAAA']]],
            ]);
            $col++;
        }

        $sheet->getRowDimension($row)->setRowHeight(20);
        return $row + 1;
    }

    private function writeDataRows($sheet, int $row): int
    {
        $altBg    = self::ALT_ROW_BG;
        $altIndex = 0;

        foreach ($this->rows as $record) {
            $col = 'A';
            $useAlt = ($altIndex % 2 === 0);

            foreach ($record as $key => $value) {
                $sheet->setCellValue("{$col}{$row}", $value);

                $styleArray = [];
                if ($useAlt) {
                    $styleArray['fill'] = ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $altBg]];
                }

                // Format currency columns
                if (in_array($key, ['subtotal', 'tax', 'grand_total', 'revenue', 'average_order_value'])) {
                    $sheet->getStyle("{$col}{$row}")->getNumberFormat()
                        ->setFormatCode('"Rp "#,##0.00');
                    $styleArray['alignment']['horizontal'] = Alignment::HORIZONTAL_RIGHT;
                }

                if (!empty($styleArray)) {
                    $sheet->getStyle("{$col}{$row}")->applyFromArray($styleArray);
                }

                $col++;
            }

            $altIndex++;
            $row++;
        }

        return $row;
    }

    private function writeSummary($sheet, int $row): void
    {
        if (empty($this->summary)) {
            return;
        }

        $row++; // blank separator
        $sheet->setCellValue("A{$row}", 'SUMMARY');
        $sheet->getStyle("A{$row}")->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => self::ACCENT]],
        ]);
        $row++;

        foreach ($this->summary as $label => $value) {
            $sheet->setCellValue("A{$row}", $label);
            $sheet->setCellValue("B{$row}", $value);

            $sheet->getStyle("A{$row}:B{$row}")->applyFromArray([
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => self::TOTAL_BG]],
                'font' => ['bold' => true],
            ]);

            // Format currency values in summary
            if (is_numeric($value) && stripos($label, 'revenue') !== false) {
                $sheet->getStyle("B{$row}")->getNumberFormat()
                    ->setFormatCode('"Rp "#,##0.00');
            }

            $row++;
        }
    }
}
