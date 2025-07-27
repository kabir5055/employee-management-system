<?php

namespace App\Http\Controllers;

use App\Models\ProductDelivery;
use App\Models\BalanceSheet;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/Index');
    }

    public function employeeBalances(Request $request)
    {
        $balances = BalanceSheet::with('employee')
            ->select('employee_id', 'current_balance')
            ->orderBy('current_balance', $request->input('sort', 'desc'))
            ->get()
            ->map(function ($sheet) {
                return [
                    'employee_name' => $sheet->employee->name,
                    'balance' => $sheet->current_balance
                ];
            });

        return Inertia::render('Reports/EmployeeBalances', [
            'balances' => $balances
        ]);
    }

    public function deliveryStats(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth());

        $stats = ProductDelivery::whereBetween('delivery_date', [$startDate, $endDate])
            ->select(
                'employee_id',
                DB::raw('COUNT(*) as total_deliveries'),
                DB::raw('SUM(total_amount) as total_amount'),
                DB::raw('SUM(commission_amount) as total_commission')
            )
            ->with('employee')
            ->groupBy('employee_id')
            ->get()
            ->map(function ($stat) {
                return [
                    'employee_name' => $stat->employee->name,
                    'total_deliveries' => $stat->total_deliveries,
                    'total_amount' => $stat->total_amount,
                    'total_commission' => $stat->total_commission,
                    'commission_rate' => $stat->total_amount > 0
                        ? ($stat->total_commission / $stat->total_amount) * 100
                        : 0
                ];
            });

        return Inertia::render('Reports/DeliveryStats', [
            'stats' => $stats,
            'startDate' => $startDate,
            'endDate' => $endDate
        ]);
    }

    public function productPerformance(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth());

        $performance = ProductDelivery::whereBetween('delivery_date', [$startDate, $endDate])
            ->select(
                'product_id',
                DB::raw('COUNT(*) as total_deliveries'),
                DB::raw('SUM(quantity) as total_quantity'),
                DB::raw('SUM(total_amount) as total_amount'),
                DB::raw('SUM(commission_amount) as total_commission')
            )
            ->with('product')
            ->groupBy('product_id')
            ->get()
            ->map(function ($stat) {
                return [
                    'product_name' => $stat->product->name,
                    'total_deliveries' => $stat->total_deliveries,
                    'total_quantity' => $stat->total_quantity,
                    'total_amount' => $stat->total_amount,
                    'total_commission' => $stat->total_commission,
                    'average_commission_rate' => $stat->total_amount > 0
                        ? ($stat->total_commission / $stat->total_amount) * 100
                        : 0
                ];
            });

        return Inertia::render('Reports/ProductPerformance', [
            'performance' => $performance,
            'startDate' => $startDate,
            'endDate' => $endDate
        ]);
    }

    public function yearlyComparison()
    {
        $yearlyData = ProductDelivery::select(
            DB::raw('YEAR(delivery_date) as year'),
            DB::raw('SUM(total_amount) as total_sales'),
            DB::raw('SUM(commission_amount) as total_commission'),
            DB::raw('COUNT(*) as total_deliveries'),
            DB::raw('COUNT(DISTINCT employee_id) as active_employees')
        )
        ->groupBy('year')
        ->orderBy('year', 'desc')
        ->get();

        return Inertia::render('Reports/YearlyComparison', [
            'yearlyData' => $yearlyData
        ]);
    }

    public function monthlyTrends()
    {
        $monthlyTrends = ProductDelivery::select(
            DB::raw('YEAR(delivery_date) as year'),
            DB::raw('MONTH(delivery_date) as month'),
            DB::raw('SUM(total_amount) as total_sales'),
            DB::raw('SUM(commission_amount) as total_commission'),
            DB::raw('COUNT(*) as delivery_count'),
            DB::raw('COUNT(DISTINCT employee_id) as active_employees'),
            DB::raw('SUM(quantity) as total_quantity')
        )
        ->groupBy('year', 'month')
        ->orderBy('year', 'desc')
        ->orderBy('month', 'desc')
        ->get()
        ->map(function ($item) {
            $item->month_name = Carbon::create(null, $item->month)->format('F');
            $item->average_commission_rate = $item->total_sales > 0
                ? ($item->total_commission / $item->total_sales) * 100
                : 0;
            return $item;
        });

        return Inertia::render('Reports/MonthlyTrends', [
            'monthlyTrends' => $monthlyTrends
        ]);
    }

    public function topPerformers(Request $request)
    {
        $period = $request->input('period', 'all_time');
        $query = User::query()
            ->withCount('deliveries')
            ->withSum('deliveries', 'total_amount')
            ->withSum('deliveries', 'commission_amount');

        switch ($period) {
            case 'this_month':
                $query->whereHas('deliveries', function ($q) {
                    $q->whereMonth('delivery_date', now()->month)
                      ->whereYear('delivery_date', now()->year);
                });
                break;
            case 'this_year':
                $query->whereHas('deliveries', function ($q) {
                    $q->whereYear('delivery_date', now()->year);
                });
                break;
            case 'last_year':
                $query->whereHas('deliveries', function ($q) {
                    $q->whereYear('delivery_date', now()->subYear()->year);
                });
                break;
        }

        $topPerformers = $query->orderByDesc('deliveries_sum_total_amount')
            ->limit(10)
            ->get()
            ->map(function ($employee) {
                return [
                    'name' => $employee->name,
                    'total_deliveries' => $employee->deliveries_count,
                    'total_sales' => $employee->deliveries_sum_total_amount,
                    'total_commission' => $employee->deliveries_sum_commission_amount,
                    'commission_rate' => $employee->deliveries_sum_total_amount > 0
                        ? ($employee->deliveries_sum_commission_amount / $employee->deliveries_sum_total_amount) * 100
                        : 0
                ];
            });

        return Inertia::render('Reports/TopPerformers', [
            'topPerformers' => $topPerformers,
            'period' => $period
        ]);
    }
}
