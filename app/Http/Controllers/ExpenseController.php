<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\User;
use App\Models\BalanceSheet;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ExpenseController extends Controller
{
    use AuthorizesRequests;

    private function userHasRole($roles)
    {
        $user = Auth::user();
        $userRoles = $user->roles->pluck('name')->toArray();
        return !empty(array_intersect($userRoles, (array)$roles));
    }

    public function index()
    {
        $user = Auth::user();
        $query = Expense::with(['employee', 'warehouse.thana.upazila.district']);

        // If not admin/manager, only show expenses they're responsible for
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager'])) {
            $query->where('employee_id', $user->id);
        }

        $expenses = $query->latest()->paginate(10);

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $warehouses = Warehouse::query()
            ->with(['thana.upazila.district'])
            ->when(!$this->userHasRole(['Super Admin', 'Administrator', 'Manager']), function ($query) use ($user) {
                $query->where('employee_id', $user->id);
            })
            ->get();

        return Inertia::render('Expenses/Create', [
            'warehouses' => $warehouses
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'warehouse_id' => 'required|exists:warehouses,id',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'expense_date' => 'required|date',
            'receipt_image' => 'nullable|image|max:2048'
        ]);

        $user = Auth::user();

        // Verify user has access to this warehouse
        $warehouse = Warehouse::findOrFail($validated['warehouse_id']);
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager']) && $warehouse->employee_id !== $user->id) {
            abort(403);
        }

        $validated['employee_id'] = $user->id;
        $validated['status'] = 'approved';

        if ($request->hasFile('receipt_image')) {
            $validated['receipt_image'] = $request->file('receipt_image')->store('receipts', 'public');
        }

        $expense = Expense::create($validated);

        // Update balance sheet
        $balanceSheet = BalanceSheet::firstOrCreate(
            ['employee_id' => $user->id],
            ['current_balance' => 0]
        );

        $balanceSheet->decrement('current_balance', (float)$expense->amount);

        return redirect()->route('expenses.index')
            ->with('success', 'Expense recorded successfully.');
    }

    public function show(Expense $expense)
    {
        // Check if user can view this expense
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager']) && $expense->employee_id != Auth::id()) {
            abort(403, 'Unauthorized to view this expense');
        }

        $expense->load(['employee', 'warehouse.thana.upazila.district']);

        return Inertia::render('Expenses/Show', [
            'expense' => $expense
        ]);
    }

    public function edit(Expense $expense)
    {
        // Check if user can edit this expense
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager']) && $expense->employee_id != Auth::id()) {
            abort(403, 'Unauthorized to edit this expense');
        }

        $user = Auth::user();
        $warehouses = Warehouse::query()
            ->when(!$this->userHasRole(['Super Admin', 'Administrator', 'Manager']), function ($query) use ($user) {
                $query->where('employee_id', $user->id);
            })
            ->with('thana.upazila.district')
            ->get();

        return Inertia::render('Expenses/Edit', [
            'expense' => $expense->load('warehouse.thana.upazila.district'),
            'warehouses' => $warehouses
        ]);
    }

    public function update(Request $request, Expense $expense)
    {
        // Check if user can update this expense
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager']) && $expense->employee_id != Auth::id()) {
            abort(403, 'Unauthorized to update this expense');
        }

        $validated = $request->validate([
            'warehouse_id' => 'required|exists:warehouses,id',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'expense_date' => 'required|date',
            'receipt_image' => 'nullable|image|max:2048'
        ]);

        $user = Auth::user();

        // Verify user has access to this warehouse
        $warehouse = Warehouse::findOrFail($validated['warehouse_id']);
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager']) && $warehouse->employee_id !== $user->id) {
            abort(403);
        }

        if ($request->hasFile('receipt_image')) {
            $validated['receipt_image'] = $request->file('receipt_image')->store('receipts', 'public');
        }

        // If amount changed, update balance sheet
        if ($expense->amount != $validated['amount']) {
            $balanceSheet = BalanceSheet::where('employee_id', $expense->employee_id)->first();
            if ($balanceSheet) {
                $difference = $validated['amount'] - $expense->amount;
                $balanceSheet->decrement('current_balance', $difference);
            }
        }

        $expense->update($validated);

        return redirect()->route('expenses.show', $expense)
            ->with('success', 'Expense updated successfully.');
    }

    public function destroy(Expense $expense)
    {
        // Check if user can delete this expense
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager']) && $expense->employee_id != Auth::id()) {
            abort(403, 'Unauthorized to delete this expense');
        }

        // Add back the expense amount to balance sheet
        $balanceSheet = BalanceSheet::where('employee_id', $expense->employee_id)->first();
        if ($balanceSheet) {
            $balanceSheet->increment('current_balance', (float)$expense->amount);
        }

        $expense->delete();

        return redirect()->route('expenses.index')
            ->with('success', 'Expense deleted successfully.');
    }
}
