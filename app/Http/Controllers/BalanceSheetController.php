<?php

namespace App\Http\Controllers;

use App\Models\BalanceSheet;
use App\Models\ProductDelivery;
use App\Models\User;
use App\Models\Expense;
use App\Exports\BalanceSheetExport;
use App\Imports\BalanceSheetImport;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Maatwebsite\Excel\Facades\Excel;

class BalanceSheetController extends Controller
{
    use AuthorizesRequests;

    private function userIsSuperAdmin()
    {
        return Auth::user()->is_super_admin ?? false;
    }

    private function getEmployeesList()
    {
        $user = Auth::user();
        // Check if user is super admin
        if ($user->is_super_admin) {
            return User::where('status', 'active')->get(['id', 'name']);
        }
        return collect([$user])->map->only(['id', 'name']);
    }
    public function index(Request $request)
    {
        // Get employees with their current balance sheet information
        $query = User::with(['balanceSheets' => function($query) {
                $query->latest('date');
            }, 'productDeliveries', 'expenses', 'department', 'position'])
            ->where('status', 'active')
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('employee_id', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->input('department_id'), function ($query, $departmentId) {
                $query->where('department_id', $departmentId);
            })
            ->when($request->input('position_id'), function ($query, $positionId) {
                $query->where('position_id', $positionId);
            })
            ->when(!$this->userIsSuperAdmin(), function ($query) {
                $query->where('id', Auth::id());
            });

        $employees = $query->paginate(20);

        // Calculate summary statistics
        $totalEmployees = $employees->total();
        $totalBalance = 0;
        $totalMarketDues = 0;
        $totalProductsInHand = 0;

        foreach ($employees as $employee) {
            $currentBalance = $employee->balanceSheets->first()?->current_balance ?? 0;
            $totalBalance += $currentBalance;

            // Calculate market dues (unpaid deliveries)
            $marketDues = $employee->productDeliveries()
                ->where('payment_status', 'pending')
                ->sum('total_amount');
            $totalMarketDues += $marketDues;

            // Calculate products in hand (recent stock)
            $productsInHand = $employee->employeeStocks()
                ->sum('quantity');
            $totalProductsInHand += $productsInHand;
        }

        return Inertia::render('BalanceSheets/Index', [
            'employees' => $employees,
            'filters' => $request->only(['search', 'department_id', 'position_id']),
            'departments' => \App\Models\Department::all(['id', 'name']),
            'positions' => \App\Models\Position::all(['id', 'title']),
            'canViewAllEmployees' => $this->userIsSuperAdmin(),
            'summary' => [
                'total_employees' => $totalEmployees,
                'total_balance' => $totalBalance,
                'total_market_dues' => $totalMarketDues,
                'total_products_in_hand' => $totalProductsInHand
            ]
        ]);
    }

    public function show($employeeId)
    {
        $employee = User::with(['balanceSheets', 'productDeliveries', 'expenses', 'department', 'position', 'employeeStocks'])
            ->findOrFail($employeeId);

        // Check if user can view this employee's balance sheet
        if (!$this->userIsSuperAdmin() && $employee->id !== Auth::id()) {
            abort(403, 'Unauthorized to view this employee\'s balance sheet');
        }

        // Get current balance sheet or create summary
        $latestBalanceSheet = $employee->balanceSheets()->latest('date')->first();

        // Calculate current financial position
        $totalDeliveries = $employee->productDeliveries()->sum('total_amount');
        $paidDeliveries = $employee->productDeliveries()->where('payment_status', 'paid')->sum('total_amount');
        $pendingDeliveries = $employee->productDeliveries()->where('payment_status', 'pending')->sum('total_amount');

        $totalExpenses = $employee->expenses()->sum('amount');
        $currentBalance = $latestBalanceSheet?->current_balance ?? 0;

        // Products in hand
        $productsInHand = $employee->employeeStocks()->with('product')->get();
        $totalProductValue = $productsInHand->sum(function($stock) {
            return $stock->quantity * ($stock->product->price ?? 0);
        });

        // Recent deliveries and expenses
        $recentDeliveries = $employee->productDeliveries()
            ->with('product')
            ->orderBy('delivery_date', 'desc')
            ->limit(10)
            ->get();

        $recentExpenses = $employee->expenses()
            ->orderBy('expense_date', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('BalanceSheets/Show', [
            'employee' => $employee,
            'balanceSheet' => $latestBalanceSheet,
            'financialSummary' => [
                'current_balance' => $currentBalance,
                'total_deliveries' => $totalDeliveries,
                'paid_deliveries' => $paidDeliveries,
                'pending_deliveries' => $pendingDeliveries,
                'market_dues' => $pendingDeliveries,
                'total_expenses' => $totalExpenses,
                'products_in_hand_value' => $totalProductValue,
                'net_position' => $currentBalance + $totalProductValue - $pendingDeliveries
            ],
            'productsInHand' => $productsInHand,
            'recentDeliveries' => $recentDeliveries,
            'recentExpenses' => $recentExpenses,
            'canEdit' => $this->userIsSuperAdmin()
        ]);
    }

    public function updateBalance(Request $request, $id)
    {
        // Check if user has permission to update balance sheets
        if (!$this->userIsSuperAdmin()) {
            abort(403, 'Unauthorized to update balance sheets');
        }

        $request->validate([
            'date' => 'required|date',
            'location' => 'nullable|string|max:255',
            'product_delivery_amount' => 'required|numeric|min:0',
            'expense_amount' => 'required|numeric|min:0',
            'market_cost' => 'required|numeric|min:0',
            'ta_da' => 'required|numeric|min:0',
            'notes' => 'nullable|string'
        ]);

        $balanceSheet = BalanceSheet::findOrFail($id);

        DB::transaction(function () use ($request, $balanceSheet) {
            $newTotal = $request->input('product_delivery_amount') +
                       $request->input('expense_amount') +
                       $request->input('market_cost') +
                       $request->input('ta_da');

            $oldTotal = $balanceSheet->getTotalAmount();
            $difference = $newTotal - $oldTotal;

            $balanceSheet->date = $request->input('date');
            $balanceSheet->location = $request->input('location');
            $balanceSheet->product_delivery_amount = $request->input('product_delivery_amount');
            $balanceSheet->expense_amount = $request->input('expense_amount');
            $balanceSheet->market_cost = $request->input('market_cost');
            $balanceSheet->ta_da = $request->input('ta_da');
            $balanceSheet->notes = $request->input('notes');
            $balanceSheet->current_balance += $difference;
            $balanceSheet->updated_by = Auth::id();
            $balanceSheet->save();
        });

        return back()->with('success', 'Balance sheet updated successfully');
    }

    public function export(Request $request)
    {
        // Check if user has permission to export balance sheets
        if (!$this->userIsSuperAdmin()) {
            abort(403, 'Unauthorized to export balance sheets');
        }

        $filters = $request->only(['search', 'department_id', 'position_id']);
        $type = $request->input('type', 'xlsx');

        return Excel::download(
            new BalanceSheetExport($filters),
            'employee_balance_positions_' . Carbon::now()->format('Y-m-d') . '.' . $type
        );
    }
}
