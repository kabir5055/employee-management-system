<?php

namespace App\Http\Controllers;

use App\Models\StockTransfer;
use App\Models\EmployeeStock;
use App\Models\Warehouse;
use App\Models\StockHistory;
use App\Models\User;
use App\Models\WarehouseInventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class StockTransferController extends Controller
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
        $query = StockTransfer::with(['fromWarehouse', 'toEmployee', 'product', 'createdBy', 'approvedBy']);

        // If not admin/manager, only show transfers related to the user
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager'])) {
            $query->where('to_employee_id', Auth::id());
        }

        $transfers = $query->latest()->paginate(10);

        return Inertia::render('StockTransfers/Index', [
            'transfers' => $transfers,
            'canCreate' => $this->userHasRole(['Super Admin', 'Administrator', 'Manager']),
            'canApprove' => $this->userHasRole(['Super Admin', 'Administrator', 'Manager'])
        ]);
    }

    public function create()
    {
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager'])) {
            abort(403, 'Unauthorized to create stock transfers');
        }

        $warehouses = Warehouse::where('status', 'active')->get();
        $employees = User::role('employee')->get();

        return Inertia::render('StockTransfers/Create', [
            'warehouses' => $warehouses,
            'employees' => $employees
        ]);
    }

    public function store(Request $request)
    {
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager'])) {
            abort(403, 'Unauthorized to create stock transfers');
        }

        $validated = $request->validate([
            'from_warehouse_id' => 'required|exists:warehouses,id',
            'to_employee_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string'
        ]);

        // Check warehouse inventory
        $warehouseInventory = WarehouseInventory::where([
            'warehouse_id' => $validated['from_warehouse_id'],
            'product_id' => $validated['product_id']
        ])->firstOrFail();

        if ($warehouseInventory->quantity < $validated['quantity']) {
            return back()->withErrors(['quantity' => 'Insufficient stock in warehouse']);
        }

        $transfer = StockTransfer::create([
            ...$validated,
            'status' => 'pending',
            'created_by' => Auth::id()
        ]);

        return redirect()->route('stock-transfers.show', $transfer)
            ->with('success', 'Stock transfer created successfully');
    }

    public function show(StockTransfer $transfer)
    {
        // Check if user can view this transfer
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager']) &&
            $transfer->to_employee_id != Auth::id() &&
            $transfer->created_by != Auth::id()) {
            abort(403, 'Unauthorized to view this transfer');
        }

        return Inertia::render('StockTransfers/Show', [
            'transfer' => $transfer->load(['fromWarehouse', 'toEmployee', 'product', 'createdBy', 'approvedBy']),
            'canApprove' => $this->userHasRole(['Super Admin', 'Administrator', 'Manager']) && $transfer->isPending()
        ]);
    }

    public function approve(Request $request, StockTransfer $transfer)
    {
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager'])) {
            abort(403, 'Unauthorized to approve stock transfers');
        }

        if (!$transfer->isPending()) {
            return back()->withErrors(['status' => 'Transfer is not pending']);
        }

        DB::transaction(function () use ($transfer) {
            // Deduct from warehouse
            $warehouseInventory = WarehouseInventory::where([
                'warehouse_id' => $transfer->from_warehouse_id,
                'product_id' => $transfer->product_id
            ])->firstOrFail();

            if ($warehouseInventory->quantity < $transfer->quantity) {
                throw new \Exception('Insufficient stock in warehouse');
            }

            $warehouseInventory->decrement('quantity', $transfer->quantity);

            // Add to employee stock
            $employeeStock = EmployeeStock::updateOrCreate(
                [
                    'employee_id' => $transfer->to_employee_id,
                    'product_id' => $transfer->product_id
                ],
                [
                    'quantity' => DB::raw('quantity + ' . $transfer->quantity)
                ]
            );

            // Record history for warehouse
            StockHistory::create([
                'stockable_type' => WarehouseInventory::class,
                'stockable_id' => $warehouseInventory->id,
                'product_id' => $transfer->product_id,
                'quantity_change' => -$transfer->quantity,
                'quantity_before' => $warehouseInventory->quantity + $transfer->quantity,
                'quantity_after' => $warehouseInventory->quantity,
                'type' => 'transfer_out',
                'notes' => "Transfer to employee {$transfer->toEmployee->name}",
                'created_by' => Auth::id()
            ]);

            // Record history for employee
            StockHistory::create([
                'stockable_type' => EmployeeStock::class,
                'stockable_id' => $employeeStock->id,
                'product_id' => $transfer->product_id,
                'quantity_change' => $transfer->quantity,
                'quantity_before' => $employeeStock->quantity - $transfer->quantity,
                'quantity_after' => $employeeStock->quantity,
                'type' => 'transfer_in',
                'notes' => "Transfer from warehouse {$transfer->fromWarehouse->name}",
                'created_by' => Auth::id()
            ]);

            // Update transfer status
            $transfer->update([
                'status' => 'completed',
                'approved_by' => Auth::id(),
                'approved_at' => now()
            ]);
        });

        return back()->with('success', 'Stock transfer approved successfully');
    }

    public function cancel(StockTransfer $transfer)
    {
        // Check if user can cancel this transfer
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager']) &&
            $transfer->created_by != Auth::id()) {
            abort(403, 'Unauthorized to cancel this transfer');
        }

        if (!$transfer->isPending()) {
            return back()->withErrors(['status' => 'Only pending transfers can be cancelled']);
        }

        $transfer->update([
            'status' => 'cancelled',
            'notes' => $transfer->notes . "\nCancelled by " . Auth::user()->name
        ]);

        return back()->with('success', 'Stock transfer cancelled successfully');
    }
}
