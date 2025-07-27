<?php

namespace App\Http\Controllers;

use App\Models\Warehouse;
use App\Models\WarehouseInventory;
use App\Models\District;
use App\Models\Thana;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Spatie\Permission\Traits\HasRoles;

class WarehouseController extends Controller
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
        $query = Warehouse::with(['thana.upazila.district', 'employee']);

        // If not super admin/administrator/manager, only show warehouses they're responsible for
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager'])) {
            $query->where('employee_id', $user->id);
        }

        $warehouses = $query->paginate(10);

        return Inertia::render('Warehouses/Index', [
            'warehouses' => $warehouses
        ]);
    }

    public function create()
    {
        $districts = District::with('upazilas.thanas')->get();
        $employees = User::role(['employee'])->get();

        return Inertia::render('Warehouses/Create', [
            'districts' => $districts,
            'employees' => $employees
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'thana_id' => 'required|exists:thanas,id',
            'employee_id' => 'required|exists:users,id',
            'status' => 'required|in:active,inactive'
        ]);

        $warehouse = Warehouse::create($validated);

        return redirect()->route('warehouses.show', $warehouse)
            ->with('success', 'Warehouse created successfully.');
    }

    public function show(Warehouse $warehouse)
    {
        // Check if user can view this warehouse
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager']) && $warehouse->employee_id != Auth::id()) {
            abort(403, 'Unauthorized to view this warehouse');
        }

        $warehouse->load([
            'thana.upazila.district',
            'employee',
            'inventory.product',
            'deliveries' => function ($query) {
                $query->latest()->take(10);
            },
            'collections' => function ($query) {
                $query->latest()->take(10);
            },
            'expenses' => function ($query) {
                $query->latest()->take(10);
            }
        ]);

        return Inertia::render('Warehouses/Show', [
            'warehouse' => $warehouse
        ]);
    }

    public function edit(Warehouse $warehouse)
    {
        // Check if user can edit this warehouse
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager']) && $warehouse->employee_id != Auth::id()) {
            abort(403, 'Unauthorized to edit this warehouse');
        }

        $districts = District::with('upazilas.thanas')->get();
        $employees = User::role(['employee'])->get();

        return Inertia::render('Warehouses/Edit', [
            'warehouse' => $warehouse->load('thana.upazila.district', 'employee'),
            'districts' => $districts,
            'employees' => $employees
        ]);
    }

    public function update(Request $request, Warehouse $warehouse)
    {
        // Check if user can update this warehouse
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager']) && $warehouse->employee_id != Auth::id()) {
            abort(403, 'Unauthorized to update this warehouse');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'thana_id' => 'required|exists:thanas,id',
            'employee_id' => 'required|exists:users,id',
            'status' => 'required|in:active,inactive'
        ]);

        $warehouse->update($validated);

        return redirect()->route('warehouses.show', $warehouse)
            ->with('success', 'Warehouse updated successfully.');
    }

    public function destroy(Warehouse $warehouse)
    {
        // Check if user can delete this warehouse
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager'])) {
            abort(403, 'Unauthorized to delete this warehouse');
        }

        $warehouse->delete();

        return redirect()->route('warehouses.index')
            ->with('success', 'Warehouse deleted successfully.');
    }

    public function updateInventory(Request $request, Warehouse $warehouse)
    {
        // Check if user can update inventory for this warehouse
        if (!$this->userHasRole(['Super Admin', 'Administrator', 'Manager']) && $warehouse->employee_id != Auth::id()) {
            abort(403, 'Unauthorized to update inventory for this warehouse');
        }

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:0',
            'minimum_quantity' => 'required|integer|min:0',
            'maximum_quantity' => 'required|integer|min:0'
        ]);

        $inventory = $warehouse->inventory()->updateOrCreate(
            ['product_id' => $validated['product_id']],
            $validated
        );

        return back()->with('success', 'Inventory updated successfully.');
    }
}
