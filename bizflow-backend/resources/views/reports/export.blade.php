<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'BizFlow Report' }}</title>
    <style>
        /* ----------------------------------------------------------------
           Base
        ---------------------------------------------------------------- */
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10px;
            color: #1a202c;
            line-height: 1.4;
            background: #ffffff;
        }

        /* ----------------------------------------------------------------
           Header / Brand
        ---------------------------------------------------------------- */
        .brand-header {
            background: #1E3A5F;
            color: #ffffff;
            padding: 16px 24px;
            border-radius: 6px 6px 0 0;
        }

        .brand-header h1 {
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 0.5px;
        }

        .brand-header .sub {
            font-size: 10px;
            opacity: 0.75;
            margin-top: 2px;
        }

        .brand-accent-bar {
            height: 4px;
            background: linear-gradient(90deg, #2563EB, #10B981);
            margin-bottom: 16px;
        }

        /* ----------------------------------------------------------------
           Report Meta
        ---------------------------------------------------------------- */
        .report-meta {
            padding: 10px 0 14px 0;
            border-bottom: 1px solid #e2e8f0;
            margin-bottom: 14px;
        }

        .report-meta h2 {
            font-size: 14px;
            font-weight: bold;
            color: #1E3A5F;
            margin-bottom: 6px;
        }

        .meta-grid {
            display: table;
            width: 100%;
        }

        .meta-row {
            display: table-row;
        }

        .meta-label {
            display: table-cell;
            width: 130px;
            color: #718096;
            font-size: 9px;
            padding: 1px 0;
        }

        .meta-value {
            display: table-cell;
            font-size: 9px;
            font-weight: bold;
            color: #2d3748;
        }

        /* ----------------------------------------------------------------
           Summary Cards
        ---------------------------------------------------------------- */
        .summary-grid {
            width: 100%;
            margin-bottom: 16px;
        }

        .summary-grid td {
            width: 25%;
            padding: 6px 8px;
            background: #EBF4FF;
            border: 2px solid #ffffff;
            border-radius: 4px;
            vertical-align: top;
        }

        .summary-label {
            font-size: 8px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .summary-value {
            font-size: 13px;
            font-weight: bold;
            color: #1E3A5F;
            margin-top: 2px;
        }

        /* ----------------------------------------------------------------
           Data Table
        ---------------------------------------------------------------- */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
            font-size: 9px;
        }

        .data-table thead tr {
            background: #2563EB;
            color: #ffffff;
        }

        .data-table thead th {
            padding: 7px 8px;
            text-align: left;
            font-size: 8.5px;
            letter-spacing: 0.2px;
            white-space: nowrap;
        }

        .data-table thead th.right {
            text-align: right;
        }

        .data-table tbody tr {
            border-bottom: 1px solid #e2e8f0;
        }

        .data-table tbody tr:nth-child(even) {
            background: #F0F4F8;
        }

        .data-table tbody td {
            padding: 5px 8px;
            vertical-align: middle;
        }

        .data-table tbody td.right {
            text-align: right;
        }

        .data-table tbody td.currency {
            text-align: right;
            font-variant-numeric: tabular-nums;
        }

        /* ----------------------------------------------------------------
           Status Badge
        ---------------------------------------------------------------- */
        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 8px;
            font-weight: bold;
            text-transform: capitalize;
        }

        .badge-completed { background: #D1FAE5; color: #065F46; }
        .badge-pending   { background: #FEF3C7; color: #92400E; }
        .badge-cancelled { background: #FEE2E2; color: #991B1B; }
        .badge-refunded  { background: #E0E7FF; color: #3730A3; }

        /* ----------------------------------------------------------------
           Footer / Page Numbers
        ---------------------------------------------------------------- */
        .footer {
            border-top: 1px solid #e2e8f0;
            padding-top: 8px;
            color: #718096;
            font-size: 8px;
        }

        .footer table {
            width: 100%;
        }

        .footer .left  { text-align: left; }
        .footer .right { text-align: right; }

        /* DomPDF page counters */
        .page-count:after {
            content: counter(page) " of " counter(pages);
        }

        /* ----------------------------------------------------------------
           Empty State
        ---------------------------------------------------------------- */
        .empty-state {
            text-align: center;
            padding: 30px;
            color: #a0aec0;
            font-size: 10px;
        }
    </style>
</head>
<body>

    {{-- Brand Header --}}
    <div class="brand-header">
        <h1>BizFlow POS</h1>
        <p class="sub">Business Intelligence &amp; Reporting</p>
    </div>
    <div class="brand-accent-bar"></div>

    {{-- Report Meta --}}
    <div class="report-meta">
        <h2>{{ $title ?? 'Sales Report' }}</h2>
        <div class="meta-grid">
            <div class="meta-row">
                <div class="meta-label">Generated</div>
                <div class="meta-value">{{ $generated_at }}</div>
            </div>
            @if(!empty($filters['start_date']) || !empty($filters['end_date']))
            <div class="meta-row">
                <div class="meta-label">Period</div>
                <div class="meta-value">
                    {{ $filters['start_date'] ?? 'All time' }} –
                    {{ $filters['end_date'] ?? now()->toDateString() }}
                </div>
            </div>
            @endif
            @if(!empty($filters['status']))
            <div class="meta-row">
                <div class="meta-label">Status Filter</div>
                <div class="meta-value">{{ ucfirst($filters['status']) }}</div>
            </div>
            @endif
            @if(!empty($filters['customer_id']))
            <div class="meta-row">
                <div class="meta-label">Customer ID</div>
                <div class="meta-value">{{ $filters['customer_id'] }}</div>
            </div>
            @endif
        </div>
    </div>

    {{-- Summary Cards --}}
    @if(!empty($summary))
    <table class="summary-grid">
        <tr>
            @foreach($summary as $label => $value)
            <td>
                <div class="summary-label">{{ $label }}</div>
                <div class="summary-value">{{ $value }}</div>
            </td>
            @endforeach
        </tr>
    </table>
    @endif

    {{-- Data Table --}}
    @if($report_type === 'sales')
        @if($rows->isEmpty())
            <div class="empty-state">No transactions found for the selected filters.</div>
        @else
        <table class="data-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Invoice</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Cashier</th>
                    <th class="right">Subtotal</th>
                    <th class="right">Tax</th>
                    <th class="right">Grand Total</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($rows as $i => $row)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $row['invoice_number'] }}</td>
                    <td>{{ \Carbon\Carbon::parse($row['transaction_date'])->format('d M Y') }}</td>
                    <td>{{ $row['customer'] }}</td>
                    <td>{{ $row['cashier'] }}</td>
                    <td class="currency">Rp {{ number_format($row['subtotal'], 0, ',', '.') }}</td>
                    <td class="currency">Rp {{ number_format($row['tax'], 0, ',', '.') }}</td>
                    <td class="currency">Rp {{ number_format($row['grand_total'], 0, ',', '.') }}</td>
                    <td>
                        <span class="badge badge-{{ $row['status'] }}">{{ $row['status'] }}</span>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @endif

    @elseif($report_type === 'top-products')
        <table class="data-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th>SKU</th>
                    <th class="right">Qty Sold</th>
                    <th class="right">Revenue</th>
                </tr>
            </thead>
            <tbody>
                @foreach($rows as $i => $row)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $row['product_name'] }}</td>
                    <td>{{ $row['sku'] }}</td>
                    <td class="right">{{ number_format($row['quantity_sold']) }}</td>
                    <td class="currency">Rp {{ number_format($row['revenue'], 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

    @elseif($report_type === 'monthly-trend')
        <table class="data-table">
            <thead>
                <tr>
                    <th>Month</th>
                    <th class="right">Revenue</th>
                    <th class="right">Orders</th>
                </tr>
            </thead>
            <tbody>
                @foreach($rows as $row)
                <tr>
                    <td>{{ $row['month'] }}</td>
                    <td class="currency">Rp {{ number_format($row['revenue'], 0, ',', '.') }}</td>
                    <td class="right">{{ number_format($row['order_count']) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

    @elseif($report_type === 'daily')
        <table class="data-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th class="right">Revenue</th>
                    <th class="right">Orders</th>
                </tr>
            </thead>
            <tbody>
                @foreach($rows as $row)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($row['date'])->format('d M Y') }}</td>
                    <td class="currency">Rp {{ number_format($row['revenue'], 0, ',', '.') }}</td>
                    <td class="right">{{ number_format($row['orders']) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

    @elseif($report_type === 'revenue')
        {{-- Revenue report is purely summary-based; data already shown in cards above --}}
        <p style="color:#718096;font-size:9px;text-align:center;padding:20px 0;">
            Revenue details are displayed in the summary section above.
        </p>
    @endif

    {{-- Footer --}}
    <div class="footer">
        <table>
            <tr>
                <td class="left">BizFlow POS &copy; {{ date('Y') }} — Confidential</td>
                <td class="right">Page <span class="page-count"></span></td>
            </tr>
        </table>
    </div>

</body>
</html>
