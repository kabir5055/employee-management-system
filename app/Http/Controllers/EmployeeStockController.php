<?php

namespace App\Http\Controllers;

use App\Models\EmployeeStock;
use App\Models\Product;
use App\Models\StockHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EmployeeStockController extends Controller
{
    private function userHasRole($roles)
    {
        $user = Auth::user();
        $userRoles = $user->roles->pluck('name')->toArray();
        return !empty(array_intersect($userRoles, (array)$roles));
    }

    public function index()
    {
$query = EmployeeStock::with(['product', 'employee'])
    ->when(!$this->userHasRole(['Super Admin', 'Administrator', 'Manager']), function ($query) {
        $query->where('employee_id', Auth::id());
    });

$stocks = $query->get()
            ->groupBy('employee_id')
            ->map(function ($employeeStocks) {
                $employee = $employeeStocks->first()->employee;
                return [
                    'employee' => $employee,
                    'stocks' => $employeeStocks->map(function ($stock) {
                        return [
                            'id' => $stock->id,
                            'product' => $stock->product,
                            'quantity' => $stock->quantity,
                            'minimum_quantity' => $stock->minimum_quantity,
                            'maximum_quantity' => $stock->maximum_quantity,
                            'status' => $stock->stock_status,
                        ];
                    }),
                ];
            })
            ->values();

        return Inertia::render('EmployeeStocks/Index', [
            'employeeStocks' => $stocks,
            'canManageAllStocks' => $this->userHasRole(['Super Admin', 'Administrator', 'Manager'])
        ]);
    }

    public function show($employeeId)
    {
        // Check if user can view this employee's stocks
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager']) && Auth::id() != $employeeId) {
            abort(403, 'Unauthorized to view these stocks');
        }

        $stocks = EmployeeStock::with(['product', 'employee'])
            ->where('employee_id', $employeeId)
            ->get();

        $history = StockHistory::with(['product', 'createdBy'])
            ->where('stockable_type', EmployeeStock::class)
            ->whereIn('stockable_id', $stocks->pluck('id'))
            ->latest()
            ->paginate(10);

        return Inertia::render('EmployeeStocks/Show', [
            'stocks' => $stocks,
            'history' => $history,
            'employee' => $stocks->first()?->employee,
            'canUpdate' => $this->userHasRole(['Super Admin', 'Administrator', 'Manager'])
        ]);
    }

    public function update(Request $request, $id)
    {
        $stock = EmployeeStock::findOrFail($id);

        // Check if user can update this stock
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager'])) {
            abort(403, 'Unauthorized to update stocks');
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:0',
            'minimum_quantity' => 'required|integer|min:0',
            'maximum_quantity' => 'required|integer|gte:minimum_quantity',
            'notes' => 'nullable|string'
        ]);

        DB::transaction(function () use ($stock, $validated) {
            $quantityBefore = $stock->quantity;
            $quantityChange = $validated['quantity'] - $quantityBefore;

            $stock->update([
                'quantity' => $validated['quantity'],
                'minimum_quantity' => $validated['minimum_quantity'],
                'maximum_quantity' => $validated['maximum_quantity']
            ]);

            StockHistory::create([
                'stockable_type' => EmployeeStock::class,
                'stockable_id' => $stock->id,
                'product_id' => $stock->product_id,
                'quantity_change' => $quantityChange,
                'quantity_before' => $quantityBefore,
                'quantity_after' => $validated['quantity'],
                'type' => 'adjustment',
                'notes' => $validated['notes'] ?? 'Manual stock adjustment',
                'created_by' => Auth::id()
            ]);
        });

        return back()->with('success', 'Stock updated successfully');
    }
}
