<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Database\Seeder;

class SimpleRolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Clear cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create essential permissions
        $permissions = [
            'view-users', 'create-users', 'edit-users', 'delete-users',
            'view-roles', 'create-roles', 'edit-roles', 'delete-roles',
            'view-deliveries', 'create-deliveries', 'edit-deliveries', 'delete-deliveries',
            'view-products', 'create-products', 'edit-products', 'delete-products',
            'view-collections', 'create-collections', 'edit-collections', 'delete-collections',
            'view-expenses', 'create-expenses', 'edit-expenses', 'delete-expenses',
            'view-attendance', 'create-attendance', 'edit-attendance', 'delete-attendance',
            'view-payroll', 'create-payroll', 'edit-payroll', 'delete-payroll',
            'view-reports', 'export-reports',
            'view-settings', 'edit-settings',
        ];

        // Create permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'super-admin']);
        $managerRole = Role::firstOrCreate(['name' => 'manager']);
        $employeeRole = Role::firstOrCreate(['name' => 'employee']);

        // Assign all permissions to super-admin
        $adminRole->syncPermissions(Permission::all());

        // Assign permissions to manager
        $managerRole->syncPermissions([
            'view-users', 'create-users', 'edit-users',
            'view-deliveries', 'create-deliveries', 'edit-deliveries', 'delete-deliveries',
            'view-products', 'create-products', 'edit-products',
            'view-collections', 'create-collections', 'edit-collections',
            'view-expenses', 'create-expenses', 'edit-expenses',
            'view-attendance', 'create-attendance', 'edit-attendance',
            'view-payroll', 'create-payroll', 'edit-payroll',
            'view-reports', 'export-reports',
        ]);

        // Assign permissions to employee
        $employeeRole->syncPermissions([
            'view-deliveries', 'create-deliveries', 'edit-deliveries',
            'view-collections', 'create-collections',
            'view-expenses', 'create-expenses',
            'view-attendance',
        ]);

        // Assign super-admin role to first user
        $user = User::first();
        if ($user) {
            $user->assignRole('super-admin');
            echo "Super admin role assigned to: " . $user->name . "\n";
        }
    }
}
