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
        try {
            // Validate inputs
            $request->validate([
                'employee_id' => 'nullable|exists:users,id',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
            ]);

            $selectedEmployeeId = $request->input('employee_id');
            $hasStartDate = $request->filled('start_date');
            $hasEndDate = $request->filled('end_date');

            // Set date range only if dates are provided
            if ($hasStartDate || $hasEndDate) {
                $startDate = $hasStartDate
                    ? Carbon::parse($request->input('start_date'))->startOfDay()
                    : Carbon::now()->subMonths(6)->startOfDay();

                $endDate = $hasEndDate
                    ? Carbon::parse($request->input('end_date'))->endOfDay()
                    : Carbon::now()->endOfDay();

                // Check for reasonable date range (max 2 years)
                if ($startDate->diffInDays($endDate) > 730) {
                    throw new \Exception('Date range cannot exceed 2 years');
                }
            }

            // Build query for employee balances
            $balanceQuery = DB::table('balance_sheets')
                ->join('users', 'balance_sheets.employee_id', '=', 'users.id');

            // Apply date filter only if dates are provided
            if ($hasStartDate || $hasEndDate) {
                $balanceQuery->whereBetween('balance_sheets.updated_at', [$startDate, $endDate]);
            }

            // Apply employee filter if provided
            if ($selectedEmployeeId) {
                $balanceQuery->where('balance_sheets.employee_id', $selectedEmployeeId);
            }

            $balances = $balanceQuery
                ->select(
                    'balance_sheets.employee_id',
                    'users.name as employee_name',
                    'users.employee_id as emp_id',
                    DB::raw('SUM(balance_sheets.current_balance) as balance'),
                    DB::raw('MAX(balance_sheets.updated_at) as last_updated')
                )
                ->groupBy('balance_sheets.employee_id', 'users.name', 'users.employee_id')
                ->orderBy('balance', $request->input('sort', 'desc'))
                ->get()
                ->map(function ($sheet) {
                    return [
                        'employee_id' => $sheet->employee_id,
                        'employee_name' => $sheet->employee_name,
                        'emp_id' => $sheet->emp_id,
                        'balance' => $sheet->balance,
                        'last_updated' => $sheet->last_updated
                    ];
                });

        } catch (\Exception $e) {
            return back()->withErrors(['general' => $e->getMessage()]);
        }        // Get monthly balance history for all employees
        $monthlyHistory = [];
        if ($selectedEmployeeId) {
            // Detailed monthly breakdown for selected employee
            $monthlyHistory = DB::table('balance_sheets')
                ->join('users', 'balance_sheets.employee_id', '=', 'users.id')
                ->where('balance_sheets.employee_id', $selectedEmployeeId)
                ->whereBetween('balance_sheets.updated_at', [$startDate, $endDate])
                ->select(
                    DB::raw('YEAR(balance_sheets.updated_at) as year'),
                    DB::raw('MONTH(balance_sheets.updated_at) as month'),
                    DB::raw('MONTHNAME(balance_sheets.updated_at) as month_name'),
                    DB::raw('AVG(balance_sheets.current_balance) as avg_balance'),
                    DB::raw('MIN(balance_sheets.current_balance) as min_balance'),
                    DB::raw('MAX(balance_sheets.current_balance) as max_balance'),
                    DB::raw('COUNT(*) as transaction_count'),
                    'users.name as employee_name'
                )
                ->groupBy(
                    DB::raw('YEAR(balance_sheets.updated_at)'),
                    DB::raw('MONTH(balance_sheets.updated_at)'),
                    DB::raw('MONTHNAME(balance_sheets.updated_at)'),
                    'users.name'
                )
                ->orderBy('year', 'desc')
                ->orderBy('month', 'desc')
                ->get();
        }

        // Get transaction details for the selected employee
        $transactionDetails = [];
        if ($selectedEmployeeId) {
            // Get deliveries (income)
            $deliveries = ProductDelivery::with(['employee', 'product'])
                ->where('employee_id', $selectedEmployeeId)
                ->whereBetween('delivery_date', [$startDate, $endDate])
                ->select('delivery_date', 'total_amount', 'commission_amount', 'product_id', 'quantity')
                ->get()
                ->map(function ($delivery) {
                    return [
                        'date' => $delivery->delivery_date,
                        'type' => 'Delivery Commission',
                        'description' => "Product delivery - {$delivery->product->name} (Qty: {$delivery->quantity})",
                        'amount' => $delivery->commission_amount,
                        'total_sale' => $delivery->total_amount,
                        'category' => 'Income'
                    ];
                });

            // Get expenses (deductions)
            $expenses = DB::table('expenses')
                ->join('users', 'expenses.employee_id', '=', 'users.id')
                ->where('expenses.employee_id', $selectedEmployeeId)
                ->where('expenses.status', 'approved')
                ->whereBetween('expenses.expense_date', [$startDate, $endDate])
                ->select('expenses.expense_date as date', 'expenses.amount', 'expenses.description', 'expenses.category')
                ->get()
                ->map(function ($expense) {
                    return [
                        'date' => $expense->date,
                        'type' => 'Expense',
                        'description' => $expense->description,
                        'amount' => -$expense->amount, // Negative for expenses
                        'category' => $expense->category
                    ];
                });

            // Get salary payments
            $salaryPayments = DB::table('salary_payments')
                ->join('users', 'salary_payments.employee_id', '=', 'users.id')
                ->where('salary_payments.employee_id', $selectedEmployeeId)
                ->whereBetween('salary_payments.payment_date', [$startDate, $endDate])
                ->select('salary_payments.payment_date as date', 'salary_payments.amount', 'salary_payments.payment_type')
                ->get()
                ->map(function ($payment) {
                    return [
                        'date' => $payment->date,
                        'type' => 'Salary Payment',
                        'description' => "Salary payment - {$payment->payment_type}",
                        'amount' => $payment->amount,
                        'category' => 'Income'
                    ];
                });

            // Combine all transactions
            $transactionDetails = collect()
                ->merge($deliveries)
                ->merge($expenses)
                ->merge($salaryPayments)
                ->sortByDesc('date')
                ->values()
                ->all();
        }

        // Get all employees for the dropdown
        $employees = User::select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Reports/EmployeeBalances', [
            'balances' => $balances,
            'monthlyHistory' => $monthlyHistory,
            'transactionDetails' => $transactionDetails ?? [],
            'employees' => $employees,
            'selectedEmployeeId' => $selectedEmployeeId,
            'startDate' => $hasStartDate ? $request->input('start_date') : null,
            'endDate' => $hasEndDate ? $request->input('end_date') : null,
            'filters' => [
                'employee_id' => $selectedEmployeeId,
                'start_date' => $hasStartDate ? $request->input('start_date') : null,
                'end_date' => $hasEndDate ? $request->input('end_date') : null
            ]
        ]);
    }

    public function deliveryStats(Request $request)
    {
        try {
            // Validate inputs
            $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
            ]);

            $hasStartDate = $request->filled('start_date');
            $hasEndDate = $request->filled('end_date');

            // Build query for delivery stats
            $statsQuery = ProductDelivery::query();

            // Apply date filter only if dates are provided
            if ($hasStartDate || $hasEndDate) {
                // Set default date range if not provided
                $startDate = $hasStartDate
                    ? Carbon::parse($request->input('start_date'))->startOfDay()
                    : Carbon::now()->startOfMonth();

                $endDate = $hasEndDate
                    ? Carbon::parse($request->input('end_date'))->endOfDay()
                    : Carbon::now()->endOfMonth();

                // Check for reasonable date range (max 1 year)
                if ($startDate->diffInDays($endDate) > 365) {
                    throw new \Exception('Date range cannot exceed 1 year for delivery statistics');
                }

                $statsQuery->whereBetween('delivery_date', [$startDate, $endDate]);
            }

            $stats = $statsQuery
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

        } catch (\Exception $e) {
            return back()->withErrors(['general' => $e->getMessage()]);
        }        return Inertia::render('Reports/DeliveryStats', [
            'stats' => $stats,
            'startDate' => $hasStartDate ? $request->input('start_date') : null,
            'endDate' => $hasEndDate ? $request->input('end_date') : null
        ]);
    }

    public function productPerformance(Request $request)
    {
        try {
            // Validate inputs
            $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
            ]);

            $hasStartDate = $request->filled('start_date');
            $hasEndDate = $request->filled('end_date');

            // Build query for product performance
            $performanceQuery = ProductDelivery::query();

            // Apply date filter only if dates are provided
            if ($hasStartDate || $hasEndDate) {
                // Set default date range if not provided
                $startDate = $hasStartDate
                    ? Carbon::parse($request->input('start_date'))->startOfDay()
                    : Carbon::now()->startOfMonth();

                $endDate = $hasEndDate
                    ? Carbon::parse($request->input('end_date'))->endOfDay()
                    : Carbon::now()->endOfMonth();

                // Check for reasonable date range (max 1 year)
                if ($startDate->diffInDays($endDate) > 365) {
                    throw new \Exception('Date range cannot exceed 1 year for product performance');
                }

                $performanceQuery->whereBetween('delivery_date', [$startDate, $endDate]);
            }

            $performance = $performanceQuery
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

        } catch (\Exception $e) {
            return back()->withErrors(['general' => $e->getMessage()]);
        }        return Inertia::render('Reports/ProductPerformance', [
            'performance' => $performance,
            'startDate' => $hasStartDate ? $request->input('start_date') : null,
            'endDate' => $hasEndDate ? $request->input('end_date') : null
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
        ->groupBy(DB::raw('YEAR(delivery_date)'))
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
        ->groupBy(DB::raw('YEAR(delivery_date)'), DB::raw('MONTH(delivery_date)'))
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

    // API methods for AJAX requests (no page reload)
    public function employeeBalancesData(Request $request)
    {
        try {
            // Validate inputs
            $request->validate([
                'employee_id' => 'nullable|exists:users,id',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
            ]);

            $selectedEmployeeId = $request->input('employee_id');
            $hasStartDate = $request->filled('start_date');
            $hasEndDate = $request->filled('end_date');

            // Build query for employee balances
            $balanceQuery = DB::table('balance_sheets')
                ->join('users', 'balance_sheets.employee_id', '=', 'users.id');

            // Apply date filter only if dates are provided
            if ($hasStartDate || $hasEndDate) {
                $startDate = $hasStartDate
                    ? Carbon::parse($request->input('start_date'))->startOfDay()
                    : Carbon::now()->subMonths(6)->startOfDay();

                $endDate = $hasEndDate
                    ? Carbon::parse($request->input('end_date'))->endOfDay()
                    : Carbon::now()->endOfDay();

                // Check for reasonable date range (max 2 years)
                if ($startDate->diffInDays($endDate) > 730) {
                    return response()->json(['error' => 'Date range cannot exceed 2 years'], 400);
                }

                $balanceQuery->whereBetween('balance_sheets.updated_at', [$startDate, $endDate]);
            }

            // Apply employee filter if provided
            if ($selectedEmployeeId) {
                $balanceQuery->where('balance_sheets.employee_id', $selectedEmployeeId);
            }

            $balances = $balanceQuery
                ->select(
                    'balance_sheets.employee_id',
                    'users.name as employee_name',
                    'users.employee_id as emp_id',
                    DB::raw('SUM(balance_sheets.current_balance) as balance'),
                    DB::raw('MAX(balance_sheets.updated_at) as last_updated')
                )
                ->groupBy('balance_sheets.employee_id', 'users.name', 'users.employee_id')
                ->orderBy('balance', $request->input('sort', 'desc'))
                ->get()
                ->map(function ($sheet) {
                    return [
                        'employee_id' => $sheet->employee_id,
                        'employee_name' => $sheet->employee_name,
                        'emp_id' => $sheet->emp_id,
                        'balance' => $sheet->balance,
                        'last_updated' => $sheet->last_updated
                    ];
                });

            // Get monthly history and transaction details if employee is selected
            $monthlyHistory = [];
            $transactionDetails = [];

            if ($selectedEmployeeId) {
                // Monthly history
                $monthlyHistoryQuery = DB::table('balance_sheets')
                    ->where('employee_id', $selectedEmployeeId);

                if ($hasStartDate || $hasEndDate) {
                    $monthlyHistoryQuery->whereBetween('updated_at', [$startDate, $endDate]);
                }

                $monthlyHistory = $monthlyHistoryQuery
                    ->select(
                        DB::raw('DATE_FORMAT(updated_at, "%Y-%m") as month'),
                        DB::raw('AVG(current_balance) as avg_balance'),
                        DB::raw('MAX(current_balance) as max_balance'),
                        DB::raw('MIN(current_balance) as min_balance'),
                        DB::raw('COUNT(*) as transactions_count')
                    )
                    ->groupBy(DB::raw('DATE_FORMAT(updated_at, "%Y-%m")'))
                    ->orderBy('month', 'desc')
                    ->get()
                    ->map(function ($item) {
                        return [
                            'month' => $item->month,
                            'avg_balance' => $item->avg_balance,
                            'max_balance' => $item->max_balance,
                            'min_balance' => $item->min_balance,
                            'transactions_count' => $item->transactions_count
                        ];
                    });

                // Transaction details
                $deliveryTransactions = DB::table('product_deliveries')
                    ->join('users', 'product_deliveries.employee_id', '=', 'users.id')
                    ->join('products', 'product_deliveries.product_id', '=', 'products.id')
                    ->where('product_deliveries.employee_id', $selectedEmployeeId)
                    ->select(
                        'product_deliveries.created_at as date',
                        'users.name as employee_name',
                        'products.name as description',
                        'product_deliveries.total_amount as amount',
                        DB::raw('"delivery" as type')
                    );

                $balanceTransactions = DB::table('balance_sheets')
                    ->join('users', 'balance_sheets.employee_id', '=', 'users.id')
                    ->where('balance_sheets.employee_id', $selectedEmployeeId)
                    ->select(
                        'balance_sheets.updated_at as date',
                        'users.name as employee_name',
                        DB::raw('"Balance Update" as description'),
                        'balance_sheets.current_balance as amount',
                        DB::raw('"balance" as type')
                    );

                if ($hasStartDate || $hasEndDate) {
                    $deliveryTransactions->whereBetween('product_deliveries.created_at', [$startDate, $endDate]);
                    $balanceTransactions->whereBetween('balance_sheets.updated_at', [$startDate, $endDate]);
                }

                $transactionDetails = collect()
                    ->merge($deliveryTransactions->get())
                    ->merge($balanceTransactions->get())
                    ->sortByDesc('date')
                    ->take(100) // Limit to last 100 transactions
                    ->values()
                    ->map(function ($item) {
                        return [
                            'date' => $item->date,
                            'employee_name' => $item->employee_name,
                            'description' => $item->description,
                            'amount' => $item->amount,
                            'type' => $item->type
                        ];
                    });
            }

            return response()->json([
                'success' => true,
                'data' => $balances,
                'monthlyHistory' => $monthlyHistory,
                'transactionDetails' => $transactionDetails
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deliveryStatsData(Request $request)
    {
        try {
            // Validate inputs
            $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
            ]);

            $hasStartDate = $request->filled('start_date');
            $hasEndDate = $request->filled('end_date');

            // Build query for delivery stats
            $statsQuery = ProductDelivery::query();

            // Apply date filter only if dates are provided
            if ($hasStartDate || $hasEndDate) {
                $startDate = $hasStartDate
                    ? Carbon::parse($request->input('start_date'))->startOfDay()
                    : Carbon::now()->startOfMonth();

                $endDate = $hasEndDate
                    ? Carbon::parse($request->input('end_date'))->endOfDay()
                    : Carbon::now()->endOfMonth();

                // Check for reasonable date range (max 1 year)
                if ($startDate->diffInDays($endDate) > 365) {
                    return response()->json(['error' => 'Date range cannot exceed 1 year for delivery statistics'], 400);
                }

                $statsQuery->whereBetween('delivery_date', [$startDate, $endDate]);
            }

            $stats = $statsQuery
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

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function productPerformanceData(Request $request)
    {
        try {
            // Validate inputs
            $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
            ]);

            $hasStartDate = $request->filled('start_date');
            $hasEndDate = $request->filled('end_date');

            // Build query for product performance
            $performanceQuery = ProductDelivery::query();

            // Apply date filter only if dates are provided
            if ($hasStartDate || $hasEndDate) {
                $startDate = $hasStartDate
                    ? Carbon::parse($request->input('start_date'))->startOfDay()
                    : Carbon::now()->startOfMonth();

                $endDate = $hasEndDate
                    ? Carbon::parse($request->input('end_date'))->endOfDay()
                    : Carbon::now()->endOfMonth();

                // Check for reasonable date range (max 1 year)
                if ($startDate->diffInDays($endDate) > 365) {
                    return response()->json(['error' => 'Date range cannot exceed 1 year for product performance'], 400);
                }

                $performanceQuery->whereBetween('delivery_date', [$startDate, $endDate]);
            }

            $performance = $performanceQuery
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

            return response()->json([
                'success' => true,
                'data' => $performance
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
