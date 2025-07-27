<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\Admin\UserPermissionController;
use App\Http\Controllers\BalanceSheetController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductDeliveryController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\EmployeeStockController;
use App\Http\Controllers\StockTransferController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('employees', EmployeeController::class);
    Route::post('employees/export', [EmployeeController::class, 'export'])->name('employees.export');
    Route::post('employees/import', [EmployeeController::class, 'import'])->name('employees.import');

    // Role & Permission Routes
    Route::middleware('role:super-admin')->group(function () {
        Route::resource('roles', RoleController::class);
        Route::resource('permissions', PermissionController::class);

        // User Permission Management
        Route::get('admin/user-permissions', [UserPermissionController::class, 'index'])->name('admin.user-permissions');
        Route::patch('admin/users/{user}/permissions', [UserPermissionController::class, 'updatePermissions'])->name('admin.users.update-permissions');

        // Settings Routes
        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
    });

    // Balance Sheet Routes
    Route::get('balance-sheets', [BalanceSheetController::class, 'index'])->name('balance-sheets.index');
    Route::get('balance-sheets/{employee}', [BalanceSheetController::class, 'show'])->name('balance-sheets.show');
    Route::post('balance-sheets/{employee}/update-balance', [BalanceSheetController::class, 'updateBalance'])
        ->name('balance-sheets.update-balance')
        ->middleware('role:admin,manager');

    // Employee Stock Routes
    Route::get('employee-stocks', [EmployeeStockController::class, 'index'])->name('employee-stocks.index');
    Route::get('employee-stocks/{employee}', [EmployeeStockController::class, 'show'])->name('employee-stocks.show');
    Route::put('employee-stocks/{stock}', [EmployeeStockController::class, 'update'])->name('employee-stocks.update');

    // Stock Transfer Routes
    Route::resource('stock-transfers', StockTransferController::class)->except(['edit', 'update', 'destroy']);
    Route::post('stock-transfers/{transfer}/approve', [StockTransferController::class, 'approve'])->name('stock-transfers.approve');
    Route::post('stock-transfers/{transfer}/cancel', [StockTransferController::class, 'cancel'])->name('stock-transfers.cancel');

    // Product Routes
    Route::middleware('role:admin,manager')->group(function () {
        Route::resource('products', ProductController::class);
        Route::post('products/{product}/update-stock', [ProductController::class, 'updateStock'])
            ->name('products.update-stock');
    });

    // Product Delivery Routes
    Route::resource('product-deliveries', ProductDeliveryController::class)
        ->middleware('role:admin,manager,employee');

    // Warehouse Routes
    Route::resource('warehouses', WarehouseController::class);
    Route::post('warehouses/{warehouse}/inventory', [WarehouseController::class, 'updateInventory'])
        ->name('warehouses.inventory.update');

    // Expense Routes
    Route::middleware('role:admin,manager,employee')->group(function () {
        Route::resource('expenses', ExpenseController::class);
    });

    // Report Routes
    Route::middleware('role:admin,manager')->group(function () {
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/employee-balances', [ReportController::class, 'employeeBalances'])->name('reports.employee-balances');
        Route::get('/reports/delivery-stats', [ReportController::class, 'deliveryStats'])->name('reports.delivery-stats');
        Route::get('/reports/product-performance', [ReportController::class, 'productPerformance'])->name('reports.product-performance');
        Route::get('/reports/yearly-comparison', [ReportController::class, 'yearlyComparison'])->name('reports.yearly-comparison');
        Route::get('/reports/monthly-trends', [ReportController::class, 'monthlyTrends'])->name('reports.monthly-trends');
        Route::get('/reports/top-performers', [ReportController::class, 'topPerformers'])->name('reports.top-performers');
    });
});

require __DIR__.'/auth.php';
