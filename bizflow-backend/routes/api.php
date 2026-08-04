<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ExportController;
use App\Http\Controllers\Api\SettingController;

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('logout', [AuthController::class, 'logout']);

    Route::get('user', [AuthController::class, 'user']);
    Route::middleware('role:admin')->get('/admin-test', function () {
        return response()->json([
            'success' => true,
            'message' => 'Welcome Admin'
        ]);
    });

    // Dashboard
    Route::get('dashboard/summary',              [DashboardController::class, 'summary'])->name('dashboard.summary');
    Route::get('dashboard/monthly-trends',       [DashboardController::class, 'monthlyTrends'])->name('dashboard.monthly-trends');
    Route::get('dashboard/recent-transactions',  [DashboardController::class, 'recentTransactions'])->name('dashboard.recent-transactions');
    Route::get('dashboard/low-stock',            [DashboardController::class, 'lowStock'])->name('dashboard.low-stock');

    // Reports
    Route::get('reports/revenue',         [ReportController::class, 'revenue'])->name('reports.revenue');
    Route::get('reports/sales',           [ReportController::class, 'sales'])->name('reports.sales');
    Route::get('reports/top-products',    [ReportController::class, 'topProducts'])->name('reports.top-products');
    Route::get('reports/monthly-trend',   [ReportController::class, 'monthlyTrend'])->name('reports.monthly-trend');
    Route::get('reports/daily',           [ReportController::class, 'daily'])->name('reports.daily');

    // Exports (PDF + Excel)
    Route::get('reports/export/pdf',   [ExportController::class, 'pdf'])->name('reports.export.pdf');
    Route::get('reports/export/excel', [ExportController::class, 'excel'])->name('reports.export.excel');

    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('transactions', TransactionController::class);
    Route::get('transactions/{transaction}/invoice', [TransactionController::class, 'invoice'])
        ->name('transactions.invoice');

    // Settings (singleton)
    Route::get('settings', [SettingController::class, 'show'])->name('settings.show');
    Route::put('settings', [SettingController::class, 'update'])->name('settings.update');

});