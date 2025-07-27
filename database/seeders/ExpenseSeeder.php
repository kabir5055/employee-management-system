<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Expense;
use App\Models\User;
use App\Models\Warehouse;
use Carbon\Carbon;

class ExpenseSeeder extends Seeder
{
    public function run()
    {
        $employees = User::where('status', 'active')->get();
        $warehouses = Warehouse::all();
        $categories = ['transport', 'meals', 'marketing', 'office_supplies', 'communication', 'fuel'];

        // If no warehouses exist, skip creating expenses
        if ($warehouses->isEmpty()) {
            return;
        }

        // Weighted status options
        $statuses = array_merge(
            array_fill(0, 70, 'pending'),
            array_fill(0, 25, 'approved'),
            array_fill(0, 5, 'rejected')
        );

        for ($i = 0; $i < 100; $i++) {
            $employee = $employees->random();
            $warehouse = $warehouses->random();
            $category = collect($categories)->random();

            $amount = match($category) {
                'transport' => rand(500, 3000),
                'meals' => rand(200, 1500),
                'marketing' => rand(1000, 10000),
                'office_supplies' => rand(300, 2000),
                'communication' => rand(100, 800),
                'fuel' => rand(800, 5000),
                default => rand(500, 2000),
            };

            Expense::create([
                'employee_id' => $employee->id,
                'warehouse_id' => $warehouse->id,
                'category' => $category,
                'amount' => $amount,
                'expense_date' => Carbon::now()->subDays(rand(1, 90)),
                'description' => ucfirst($category) . ' expense for ' . $employee->name,
                'receipt_image' => null,
                'status' => collect($statuses)->random(), // Weighted random
            ]);
        }
    }
}
