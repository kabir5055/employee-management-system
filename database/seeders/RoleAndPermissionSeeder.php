<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Seeder;

class RoleAndPermissionSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Comprehensive permissions for Employee Management System
        $permissions = [
            // Dashboard & Overview
            'view-dashboard',
            'view-analytics',
            'view-system-stats',

            // User Management
            'view-users',
            'create-users',
            'edit-users',
            'delete-users',
            'manage-user-roles',
            'assign-permissions',

            // Employee Management
            'view-employees',
            'create-employees',
            'edit-employees',
            'delete-employees',
            'export-employees',
            'import-employees',
            'view-employee-profile',
            'edit-employee-profile',

            // Role & Permission Management
            'view-roles',
            'create-roles',
            'edit-roles',
            'delete-roles',
            'view-permissions',
            'create-permissions',
            'edit-permissions',
            'delete-permissions',
            'assign-roles',
            'revoke-roles',

            // Department Management
            'view-departments',
            'create-departments',
            'edit-departments',
            'delete-departments',

            // Position Management
            'view-positions',
            'create-positions',
            'edit-positions',
            'delete-positions',

            // Attendance Management
            'view-attendance',
            'create-attendance',
            'edit-attendance',
            'delete-attendance',
            'mark-attendance',
            'view-attendance-reports',
            'export-attendance',

            // Payroll Management
            'view-payroll',
            'create-payroll',
            'edit-payroll',
            'delete-payroll',
            'process-payroll',
            'approve-payroll',
            'view-salary-structure',
            'edit-salary-structure',

            // Leave Management
            'view-leaves',
            'create-leaves',
            'edit-leaves',
            'delete-leaves',
            'approve-leaves',
            'reject-leaves',

            // Product Management
            'view-products',
            'create-products',
            'edit-products',
            'delete-products',
            'manage-inventory',

            // Product Delivery Management
            'view-deliveries',
            'create-deliveries',
            'edit-deliveries',
            'delete-deliveries',
            'assign-deliveries',
            'track-deliveries',

            // Collection Management
            'view-collections',
            'create-collections',
            'edit-collections',
            'delete-collections',
            'verify-collections',

            // Expense Management
            'view-expenses',
            'create-expenses',
            'edit-expenses',
            'delete-expenses',
            'approve-expenses',
            'categorize-expenses',

            // Financial Management
            'view-balance-sheet',
            'edit-balance-sheet',
            'view-financial-reports',
            'manage-budgets',

            // Reports & Analytics
            'view-reports',
            'export-reports',
            'generate-custom-reports',
            'view-employee-reports',
            'view-financial-reports',
            'view-performance-reports',

            // Settings & Configuration
            'view-settings',
            'edit-settings',
            'manage-system-config',
            'backup-system',
            'restore-system',

            // Security & Audit
            'view-audit-logs',
            'manage-security',
            'reset-passwords',
            'lock-unlock-users',

            // System Administration
            'super-admin-access',
            'override-restrictions',
            'manage-all-data',
            'system-maintenance',
        ];

        // Create permissions if they don't exist
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create Roles
        $superAdminRole = Role::firstOrCreate(['name' => 'super-admin', 'guard_name' => 'web']);
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $managerRole = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $hrRole = Role::firstOrCreate(['name' => 'hr', 'guard_name' => 'web']);
        $employeeRole = Role::firstOrCreate(['name' => 'employee', 'guard_name' => 'web']);

        // Super Admin - ALL PERMISSIONS
        $superAdminRole->syncPermissions(Permission::all());

        // Admin - Most permissions except super admin specific ones
        $adminPermissions = Permission::whereNotIn('name', [
            'super-admin-access',
            'override-restrictions',
            'system-maintenance',
            'backup-system',
            'restore-system'
        ])->get();
        $adminRole->syncPermissions($adminPermissions);

        // Manager - Business operations focused
        $managerPermissions = [
            'view-dashboard', 'view-analytics',
            'view-employees', 'create-employees', 'edit-employees', 'view-employee-profile',
            'view-departments', 'view-positions',
            'view-attendance', 'create-attendance', 'edit-attendance', 'view-attendance-reports',
            'view-payroll', 'create-payroll', 'edit-payroll', 'process-payroll',
            'view-leaves', 'approve-leaves', 'reject-leaves',
            'view-products', 'create-products', 'edit-products',
            'view-deliveries', 'create-deliveries', 'edit-deliveries', 'assign-deliveries',
            'view-collections', 'create-collections', 'edit-collections', 'verify-collections',
            'view-expenses', 'create-expenses', 'edit-expenses', 'approve-expenses',
            'view-reports', 'export-reports', 'view-employee-reports',
        ];
        $managerRole->syncPermissions($managerPermissions);

        // HR - People management focused
        $hrPermissions = [
            'view-dashboard',
            'view-employees', 'create-employees', 'edit-employees', 'export-employees', 'import-employees',
            'view-departments', 'create-departments', 'edit-departments',
            'view-positions', 'create-positions', 'edit-positions',
            'view-attendance', 'create-attendance', 'edit-attendance', 'view-attendance-reports',
            'view-payroll', 'view-salary-structure', 'edit-salary-structure',
            'view-leaves', 'create-leaves', 'edit-leaves', 'approve-leaves', 'reject-leaves',
            'view-reports', 'view-employee-reports',
        ];
        $hrRole->syncPermissions($hrPermissions);

        // Employee - Basic permissions
        $employeePermissions = [
            'view-dashboard',
            'view-employee-profile', 'edit-employee-profile',
            'mark-attendance', 'view-attendance',
            'create-leaves', 'view-leaves',
            'view-deliveries', 'create-deliveries',
            'view-collections', 'create-collections',
            'view-expenses', 'create-expenses',
        ];
        $employeeRole->syncPermissions($employeePermissions);

        $this->command->info('Roles and permissions created successfully!');
    }
}
