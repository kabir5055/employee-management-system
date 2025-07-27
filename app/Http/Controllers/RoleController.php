<?php

namespace App\Http\Controllers;

use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Controllers\Traits\HasPermissionCheck;
use Inertia\Inertia;

class RoleController extends Controller
{
    use AuthorizesRequests, HasPermissionCheck;

    public function index()
    {
        $this->checkPermission('view-roles', 'Unauthorized to view roles');

        $roles = Role::with('permissions')->paginate(10);
        return Inertia::render('Roles/Index', ['roles' => $roles]);
    }

    public function create()
    {
        $this->checkPermission('create-roles', 'Unauthorized to create roles');

        return Inertia::render('Roles/Create');
    }

    public function store(Request $request)
    {
        $this->checkPermission('create-roles', 'Unauthorized to create roles');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:roles',
            'description' => 'nullable|string',
            'permissions' => 'array'
        ]);

        $role = Role::create($validated);

        if (isset($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return redirect()->route('roles.index')->with('success', 'Role created successfully.');
    }

    public function edit(Role $role)
    {
        // Only Super Admin can edit roles
        if (!$this->userHasRole(['Super Admin'])) {
            abort(403, 'Unauthorized to edit roles');
        }

        $role->load('permissions');
        return Inertia::render('Roles/Edit', ['role' => $role]);
    }

    public function update(Request $request, Role $role)
    {
        // Only Super Admin can update roles
        if (!$this->userHasRole(['Super Admin'])) {
            abort(403, 'Unauthorized to update roles');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:roles,slug,' . $role->id,
            'description' => 'nullable|string',
            'permissions' => 'array'
        ]);

        $role->update($validated);

        if (isset($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return redirect()->route('roles.index')->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        // Only Super Admin can delete roles
        if (!$this->userHasRole(['Super Admin'])) {
            abort(403, 'Unauthorized to delete roles');
        }

        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
    }
}
