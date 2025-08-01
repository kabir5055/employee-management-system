<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\User;
use App\Models\BalanceSheet;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ExpenseController extends Controller
{
    use AuthorizesRequests;

    private function userIsSuperAdmin()
    {
        return Auth::user()->is_super_admin ?? false;
    }

    public function index()
    {
        $user = Auth::user();
        $query = Expense::with(['employee', 'warehouse.thana.upazila.district']);

        // If not super admin, only show expenses they're responsible for
        if (!$this->userIsSuperAdmin()) {
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
            ->when(!$this->userIsSuperAdmin(), function ($query) use ($user) {
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
        if (!$this->userIsSuperAdmin() && $warehouse->employee_id !== $user->id) {
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

        return redirect('/expenses')
            ->with('success', 'Expense recorded successfully.');
    }

    public function show(Expense $expense)
    {
        // Check if user can view this expense
        if (!$this->userIsSuperAdmin() && $expense->employee_id != Auth::id()) {
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
        if (!$this->userIsSuperAdmin() && $expense->employee_id != Auth::id()) {
            abort(403, 'Unauthorized to edit this expense');
        }

        $user = Auth::user();
        $warehouses = Warehouse::query()
            ->when(!$this->userIsSuperAdmin(), function ($query) use ($user) {
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
        if (!$this->userIsSuperAdmin() && $expense->employee_id != Auth::id()) {
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
        if (!$this->userIsSuperAdmin() && $warehouse->employee_id !== $user->id) {
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

        return redirect("/expenses/{$expense->id}")
            ->with('success', 'Expense updated successfully.');
    }

    public function destroy(Expense $expense)
    {
        // Check if user can delete this expense
        if (!$this->userIsSuperAdmin() && $expense->employee_id != Auth::id()) {
            abort(403, 'Unauthorized to delete this expense');
        }

        // Add back the expense amount to balance sheet
        $balanceSheet = BalanceSheet::where('employee_id', $expense->employee_id)->first();
        if ($balanceSheet) {
            $balanceSheet->increment('current_balance', (float)$expense->amount);
        }

        $expense->delete();

        return redirect('/expenses')
            ->with('success', 'Expense deleted successfully.');
    }

    public function approve(Expense $expense)
    {
        // Check if user can approve expenses (only super admin)
        if (!$this->userIsSuperAdmin()) {
            abort(403, 'Unauthorized to approve expenses');
        }

        if ($expense->status === 'approved') {
            return redirect()->back()->with('info', 'Expense is already approved.');
        }

        $expense->update(['status' => 'approved']);

        return redirect()->back()->with('success', 'Expense approved successfully.');
    }

    public function reject(Expense $expense)
    {
        // Check if user can reject expenses (only super admin)
        if (!$this->userIsSuperAdmin()) {
            abort(403, 'Unauthorized to reject expenses');
        }

        if ($expense->status === 'rejected') {
            return redirect()->back()->with('info', 'Expense is already rejected.');
        }

        // If the expense was previously approved, add back the amount to balance sheet
        if ($expense->status === 'approved') {
            $balanceSheet = BalanceSheet::where('employee_id', $expense->employee_id)->first();
            if ($balanceSheet) {
                $balanceSheet->increment('current_balance', (float)$expense->amount);
            }
        }

        $expense->update(['status' => 'rejected']);

        return redirect()->back()->with('success', 'Expense rejected successfully.');
    }
}
