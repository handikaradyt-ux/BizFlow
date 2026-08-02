<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\DashboardController;

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

    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('transactions', TransactionController::class);
    Route::get('transactions/{transaction}/invoice', [TransactionController::class, 'invoice'])
        ->name('transactions.invoice');

});