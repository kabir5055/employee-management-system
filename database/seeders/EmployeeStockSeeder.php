<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmployeeStock;
use App\Models\User;
use App\Models\Product;
use Carbon\Carbon;

class EmployeeStockSeeder extends Seeder
{
    public function run()
    {
        $employees = User::where('status', 'active')->where('role', '!=', 'admin')->get();
        $products = Product::where('status', 'active')->get();

        if ($employees->isEmpty() || $products->isEmpty()) {
            $this->command->warn('Skipping EmployeeStockSeeder - need employees and products to be seeded first');
            return;
        }

        // Assign stock to about 70% of employees
        $fieldEmployees = $employees->random(min(round($employees->count() * 0.7), $employees->count()));

        foreach ($fieldEmployees as $employee) {
            // Each employee gets 3-8 different products in their stock (or all available if less)
            $maxProducts = min(rand(3, 8), $products->count());
            $employeeProducts = $products->random($maxProducts);

            foreach ($employeeProducts as $product) {
                $quantity = rand(0, 150);
                $minimumQuantity = rand(5, 25);
                $maximumQuantity = rand(100, 300);

                EmployeeStock::updateOrCreate(
                    [
                        'employee_id' => $employee->id,
                        'product_id' => $product->id,
                    ],
                    [
                        'quantity' => $quantity,
                        'minimum_quantity' => $minimumQuantity,
                        'maximum_quantity' => $maximumQuantity,
                        'created_at' => Carbon::now()->subDays(rand(1, 60)),
                        'updated_at' => Carbon::now()->subDays(rand(1, 30))
                    ]
                );
            }
        }

        $this->command->info('Employee stocks created successfully!');
    }
}
