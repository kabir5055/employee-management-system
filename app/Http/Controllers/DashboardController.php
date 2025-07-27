<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Department;
use App\Models\SalaryPayment;
use App\Models\ProductDelivery;
use App\Models\Collection;
use App\Models\Expense;
use App\Models\Product;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $totalEmployees = User::count();
        $activeEmployees = User::where('status', 'active')->count();
        $departments = Department::withCount('users')->get();

        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        $totalPayroll = SalaryPayment::where('month', $currentMonth)
            ->where('year', $currentYear)
            ->sum('net_salary');

        $totalDeliveries = ProductDelivery::whereMonth('delivery_date', $currentMonth)
            ->whereYear('delivery_date', $currentYear)
            ->sum('total_amount');

        $totalCollections = Collection::whereMonth('collection_date', $currentMonth)
            ->whereYear('collection_date', $currentYear)
            ->sum('amount_collected');

        $totalExpenses = Expense::whereMonth('expense_date', $currentMonth)
            ->whereYear('expense_date', $currentYear)
            ->sum('amount');

        $recentEmployees = User::with(['department', 'position'])
            ->where('status', 'active')
            ->orderBy('joining_date', 'desc')
            ->take(5)
            ->get();

        // Monthly sales data for the chart
        $monthlySales = ProductDelivery::selectRaw('
                MONTH(delivery_date) as month,
                YEAR(delivery_date) as year,
                SUM(total_amount) as total
            ')
            ->whereYear('delivery_date', $currentYear)
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        $monthlyLabels = [];
        $monthlyValues = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthlyLabels[] = Carbon::create()->month($i)->format('F');
            $monthValue = $monthlySales->first(function($sale) use ($i, $currentYear) {
                return $sale->month == $i && $sale->year == $currentYear;
            });
            $monthlyValues[] = $monthValue ? $monthValue->total : 0;
        }

        // Top products data
        $topProducts = ProductDelivery::selectRaw('
                products.name,
                SUM(product_deliveries.quantity) as total_quantity,
                SUM(product_deliveries.total_amount) as total_amount
            ')
            ->join('products', 'products.id', '=', 'product_deliveries.product_id')
            ->whereYear('delivery_date', $currentYear)
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_amount')
            ->limit(5)
            ->get();

        // Recent deliveries
        $recentDeliveries = ProductDelivery::with(['product', 'employee'])
            ->orderByDesc('delivery_date')
            ->limit(5)
            ->get()
            ->map(function($delivery) {
                return [
                    'id' => $delivery->id,
                    'product_name' => $delivery->product->name,
                    'employee_name' => $delivery->employee->name,
                    'date' => optional($delivery->delivery_date)->format('M d, Y'),
                    'amount' => $delivery->total_amount
                ];
            });

        // Top performing employees
        $topEmployees = User::withCount('deliveries')
            ->withSum('deliveries', 'total_amount')
            ->having('deliveries_count', '>', 0)
            ->orderByDesc('deliveries_sum_total_amount')
            ->limit(5)
            ->get()
            ->map(function($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'profile_photo_url' => $employee->profile_photo_url,
                    'deliveries_count' => $employee->deliveries_count,
                    'total_amount' => $employee->deliveries_sum_total_amount
                ];
            });

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalEmployees' => $totalEmployees,
                'totalProducts' => Product::count(),
                'totalDeliveries' => ProductDelivery::count(),
                'totalRevenue' => ProductDelivery::sum('total_amount'),
            ],
            'monthlySalesData' => [
                'labels' => $monthlyLabels,
                'values' => $monthlyValues,
            ],
            'topProductsData' => [
                'labels' => $topProducts->pluck('name'),
                'values' => $topProducts->pluck('total_amount'),
            ],
            'recentDeliveries' => $recentDeliveries,
            'topEmployees' => $topEmployees,
            'activeEmployees' => $activeEmployees,
            'totalPayroll' => $totalPayroll,
            'totalDeliveries' => $totalDeliveries,
            'totalCollections' => $totalCollections,
            'totalExpenses' => $totalExpenses,
            'departments' => $departments,
            'recentEmployees' => $recentEmployees
        ]);
    }
}
