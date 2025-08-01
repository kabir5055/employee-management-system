<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PersonalInfoController;
use App\Http\Controllers\EmployeePromotionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\Admin\UserPermissionController;
use App\Http\Controllers\Admin\UserController;
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
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
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

    // Employee Management Sub-modules
    Route::resource('positions', PositionController::class);
    Route::resource('departments', DepartmentController::class);
    Route::resource('personal-info', PersonalInfoController::class);

    // Employee Promotion Routes
    Route::resource('employee-promotions', EmployeePromotionController::class);
    Route::get('employees/{employee}/promotion-history', [EmployeePromotionController::class, 'employeeHistory'])
        ->name('employees.promotion-history');

    // Role & Permission Routes - Super Admin only (controlled in controller)
    Route::resource('roles', RoleController::class);
    Route::resource('permissions', PermissionController::class);
    Route::get('admin/user-permissions', [UserPermissionController::class, 'index'])->name('admin.user-permissions');
    Route::patch('admin/users/{user}/permissions', [UserPermissionController::class, 'updatePermissions'])->name('admin.users.update-permissions');

    // User Management Routes - Super Admin only
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('users', UserController::class);
        Route::patch('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');
        Route::patch('users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');
    });

    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings/update', [SettingController::class, 'update'])->name('settings.update');

    // Balance Sheet Routes - View employee financial positions
    Route::get('balance-sheets', [BalanceSheetController::class, 'index'])->name('balance-sheets.index');
    Route::get('balance-sheets/{employee}', [BalanceSheetController::class, 'show'])->name('balance-sheets.show');
    Route::get('balance-sheets/export', [BalanceSheetController::class, 'export'])->name('balance-sheets.export');
    Route::post('balance-sheets/{employee}/update-balance', [BalanceSheetController::class, 'updateBalance'])
        ->name('balance-sheets.update-balance');

    // Employee Stock Routes
    Route::get('employee-stocks', [EmployeeStockController::class, 'index'])->name('employee-stocks.index');
    Route::get('employee-stocks/{employee}', [EmployeeStockController::class, 'show'])->name('employee-stocks.show');
    Route::put('employee-stocks/{stock}', [EmployeeStockController::class, 'update'])->name('employee-stocks.update');

    // Stock Transfer Routes
    Route::resource('stock-transfers', StockTransferController::class)->except(['edit', 'update', 'destroy']);
    Route::post('stock-transfers/{transfer}/approve', [StockTransferController::class, 'approve'])->name('stock-transfers.approve');
    Route::post('stock-transfers/{transfer}/cancel', [StockTransferController::class, 'cancel'])->name('stock-transfers.cancel');

    // Product Routes
    Route::resource('products', ProductController::class);
    Route::post('products/{product}/update-stock', [ProductController::class, 'updateStock'])
        ->name('products.update-stock');

    // Product Delivery Routes
    Route::resource('product-deliveries', ProductDeliveryController::class);

    // Warehouse Routes
    Route::resource('warehouses', WarehouseController::class);
    Route::post('warehouses/{warehouse}/inventory', [WarehouseController::class, 'updateInventory'])
        ->name('warehouses.inventory.update');

    // Expense Routes
    Route::resource('expenses', ExpenseController::class);
    Route::post('expenses/{expense}/approve', [ExpenseController::class, 'approve'])->name('expenses.approve');
    Route::post('expenses/{expense}/reject', [ExpenseController::class, 'reject'])->name('expenses.reject');

    // Report Routes
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/employee-balances', [ReportController::class, 'employeeBalances'])->name('reports.employee-balances');
    Route::get('/reports/delivery-stats', [ReportController::class, 'deliveryStats'])->name('reports.delivery-stats');
    Route::get('/reports/product-performance', [ReportController::class, 'productPerformance'])->name('reports.product-performance');
    Route::get('/reports/yearly-comparison', [ReportController::class, 'yearlyComparison'])->name('reports.yearly-comparison');
    Route::get('/reports/monthly-trends', [ReportController::class, 'monthlyTrends'])->name('reports.monthly-trends');
    Route::get('/reports/top-performers', [ReportController::class, 'topPerformers'])->name('reports.top-performers');
});

require __DIR__.'/auth.php';
