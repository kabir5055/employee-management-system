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

            // Users seeder with super admin creation
            UserSeeder::class,

            // Employee seeder for separate employees table
            EmployeeSeeder::class,

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

            // HR Management
            LeaveSeeder::class,

            // Warehouse and inventory management
            WarehouseSeeder::class,
            EmployeeStockSeeder::class,
            StockTransferSeeder::class,
            StockAdjustmentSeeder::class,

            // Employee career progression
            EmployeePromotionHistorySeeder::class,
        ]);
    }
}
