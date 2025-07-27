<?php

namespace App\Http\Controllers;

use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class PermissionController extends Controller
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
        // Only Super Admin can manage permissions
        if (!$this->userHasRole(['Super Admin'])) {
            abort(403, 'Unauthorized to view permissions');
        }

        $permissions = Permission::with('roles')->paginate(10);
        return Inertia::render('Permissions/Index', ['permissions' => $permissions]);
    }

    public function create()
    {
        // Only Super Admin can create permissions
        if (!$this->userHasRole(['Super Admin'])) {
            abort(403, 'Unauthorized to create permissions');
        }

        return Inertia::render('Permissions/Create');
    }

    public function store(Request $request)
    {
        // Only Super Admin can store permissions
        if (!$this->userHasRole(['Super Admin'])) {
            abort(403, 'Unauthorized to create permissions');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:permissions',
            'description' => 'nullable|string'
        ]);

        Permission::create($validated);

        return redirect()->route('permissions.index')->with('success', 'Permission created successfully.');
    }

    public function edit(Permission $permission)
    {
        // Only Super Admin can edit permissions
        if (!$this->userHasRole(['Super Admin'])) {
            abort(403, 'Unauthorized to edit permissions');
        }

        return Inertia::render('Permissions/Edit', ['permission' => $permission]);
    }

    public function update(Request $request, Permission $permission)
    {
        // Only Super Admin can update permissions
        if (!$this->userHasRole(['Super Admin'])) {
            abort(403, 'Unauthorized to update permissions');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:permissions,slug,' . $permission->id,
            'description' => 'nullable|string'
        ]);

        $permission->update($validated);

        return redirect()->route('permissions.index')->with('success', 'Permission updated successfully.');
    }

    public function destroy(Permission $permission)
    {
        // Only Super Admin can delete permissions
        if (!$this->userHasRole(['Super Admin'])) {
            abort(403, 'Unauthorized to delete permissions');
        }

        $permission->delete();
        return redirect()->route('permissions.index')->with('success', 'Permission deleted successfully.');
    }
}
