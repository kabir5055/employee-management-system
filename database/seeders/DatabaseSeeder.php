<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // Location and organizational structure first
            LocationSeeder::class,
            DepartmentSeeder::class,
            PositionSeeder::class,

            // Users with roles and permissions (handles roles internally)
            UserSeeder::class,

            // Balance sheets for users
            BalanceSheetSeeder::class,

            // Other business data
            ProductSeeder::class,
            SalaryStructureSeeder::class,
            AttendanceSeeder::class,
            ProductDeliverySeeder::class,
            CollectionSeeder::class,
            ExpenseSeeder::class,
            SalaryPaymentSeeder::class,
            EmployeeHistorySeeder::class,
            SettingsSeeder::class,
        ]);
    }
}
