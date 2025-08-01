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
use Illuminate\Support\Facades\DB;

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
            ->groupBy(DB::raw('YEAR(delivery_date)'), DB::raw('MONTH(delivery_date)'))
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Monthly expenses data for comparison
        $monthlyExpenses = Expense::selectRaw('
                MONTH(expense_date) as month,
                YEAR(expense_date) as year,
                SUM(amount) as total
            ')
            ->whereYear('expense_date', $currentYear)
            ->groupBy(DB::raw('YEAR(expense_date)'), DB::raw('MONTH(expense_date)'))
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        $monthlyLabels = [];
        $monthlyValues = [];
        $monthlyExpenseValues = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthlyLabels[] = Carbon::create()->month($i)->format('M');

            $monthValue = $monthlySales->first(function($sale) use ($i, $currentYear) {
                return $sale->month == $i && $sale->year == $currentYear;
            });

            $expenseValue = $monthlyExpenses->first(function($expense) use ($i, $currentYear) {
                return $expense->month == $i && $expense->year == $currentYear;
            });

            $monthlyValues[] = $monthValue ? $monthValue->total : 0;
            $monthlyExpenseValues[] = $expenseValue ? $expenseValue->total : 0;
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
                'activeEmployees' => $activeEmployees,
                'totalPayroll' => $totalPayroll,
                'totalCollections' => $totalCollections,
                'totalExpenses' => Expense::sum('amount'),
                'currentMonthRevenue' => $totalDeliveries,
                'currentMonthExpenses' => $totalExpenses,
            ],
            'monthlySalesData' => [
                'labels' => $monthlyLabels,
                'values' => $monthlyValues,
                'expenses' => $monthlyExpenseValues,
            ],
            'topProductsData' => [
                'labels' => $topProducts->pluck('name'),
                'values' => $topProducts->pluck('total_amount'),
            ],
            'recentDeliveries' => $recentDeliveries,
            'topEmployees' => $topEmployees,
            'departments' => $departments,
            'recentEmployees' => $recentEmployees
        ]);
    }
}
