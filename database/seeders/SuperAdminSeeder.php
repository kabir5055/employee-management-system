<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class SuperAdminSeeder extends Seeder
{
    public function run()
    {
        // Create Super Admin User
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@company.com'],
            [
                'name' => 'Super Administrator',
                'email' => 'superadmin@company.com',
                'password' => Hash::make('SuperAdmin@123'),
                'employee_id' => 'SUPER001',
                'phone' => '01700000000',
                'address' => 'Head Office, Dhaka',
                'date_of_birth' => '1985-01-01',
                'joining_date' => now(),
                'department_id' => 1, // Assuming Admin department exists
                'position_id' => 1,   // Assuming CEO/Admin position exists
                'status' => 'active',
                'nid_number' => '1234567890123',
                'current_salary' => 500000.00,
                'designation' => 'Super Administrator',
                'employee_code' => 'SUPER001',
                'email_verified_at' => now(),
            ]
        );

        // Assign super-admin role
        $superAdminRole = Role::where('name', 'super-admin')->first();
        if ($superAdminRole) {
            $superAdmin->assignRole($superAdminRole);
            $this->command->info('Super Admin role assigned successfully!');
        } else {
            $this->command->error('Super Admin role not found! Please run RoleAndPermissionSeeder first.');
        }

        $this->command->info('Super Admin user created successfully!');
        $this->command->info('Email: superadmin@company.com');
        $this->command->info('Password: SuperAdmin@123');
    }
}
