<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\District;
use App\Models\Upazila;
use App\Http\Controllers\ReportController;

Route::get('/districts/{district}/upazilas', function (District $district) {
    return $district->upazilas;
});

Route::get('/upazilas/{upazila}/thanas', function (Upazila $upazila) {
    return $upazila->thanas;
});

// API routes for reports (no page reload)
Route::prefix('reports')->group(function () {
    Route::get('/employee-balances-data', [ReportController::class, 'employeeBalancesData']);
    Route::get('/delivery-stats-data', [ReportController::class, 'deliveryStatsData']);
    Route::get('/product-performance-data', [ReportController::class, 'productPerformanceData']);
});
