<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductDelivery;
use App\Models\User;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\Thana;
use Carbon\Carbon;

class ProductDeliverySeeder extends Seeder
{
    public function run()
    {
        // Create warehouses first if they don't exist
        $this->createWarehouses();

        $employees = User::where('status', 'active')->get();
        $products = Product::all();
        $warehouses = Warehouse::all();

        if ($employees->isEmpty() || $products->isEmpty() || $warehouses->isEmpty()) {
            return;
        }

        for ($i = 0; $i < 50; $i++) {
            $employee = $employees->random();
            $product = $products->random();
            $warehouse = $warehouses->random();
            $quantity = rand(5, 50);
            $unitPrice = $product->price;
            $totalAmount = $quantity * $unitPrice;

            ProductDelivery::create([
                'employee_id' => $employee->id,
                'product_id' => $product->id,
                'warehouse_id' => $warehouse->id,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'total_amount' => $totalAmount,
                'delivery_date' => Carbon::now()->subDays(rand(1, 90)),
                'notes' => 'Product delivery for ' . $employee->name,
                'status' => collect(['delivered', 'sold'])->random(),
            ]);
        }
    }

    private function createWarehouses()
    {
        // Only create warehouses if none exist
        if (Warehouse::count() > 0) {
            return;
        }

        $thanas = Thana::limit(5)->get();
        $employees = User::where('status', 'active')->limit(5)->get();

        if ($thanas->isEmpty() || $employees->isEmpty()) {
            // Create basic warehouses without specific thana/employee relationships
            $warehouses = [
                ['name' => 'Main Warehouse', 'address' => 'Dhaka Central', 'status' => 'active'],
                ['name' => 'North Warehouse', 'address' => 'Uttara, Dhaka', 'status' => 'active'],
                ['name' => 'South Warehouse', 'address' => 'Dhanmondi, Dhaka', 'status' => 'active'],
                ['name' => 'East Warehouse', 'address' => 'Motijheel, Dhaka', 'status' => 'active'],
                ['name' => 'West Warehouse', 'address' => 'Mirpur, Dhaka', 'status' => 'active'],
            ];
        } else {
            $warehouses = [
                [
                    'name' => 'Main Warehouse',
                    'address' => 'Dhaka Central Distribution Center',
                    'thana_id' => $thanas->first()->id,
                    'employee_id' => $employees->first()->id,
                    'status' => 'active'
                ],
                [
                    'name' => 'North Warehouse',
                    'address' => 'Uttara Distribution Point',
                    'thana_id' => $thanas->skip(1)->first()->id ?? $thanas->first()->id,
                    'employee_id' => $employees->skip(1)->first()->id ?? $employees->first()->id,
                    'status' => 'active'
                ],
                [
                    'name' => 'South Warehouse',
                    'address' => 'Dhanmondi Storage Facility',
                    'thana_id' => $thanas->skip(2)->first()->id ?? $thanas->first()->id,
                    'employee_id' => $employees->skip(2)->first()->id ?? $employees->first()->id,
                    'status' => 'active'
                ],
                [
                    'name' => 'East Warehouse',
                    'address' => 'Motijheel Business District',
                    'thana_id' => $thanas->skip(3)->first()->id ?? $thanas->first()->id,
                    'employee_id' => $employees->skip(3)->first()->id ?? $employees->first()->id,
                    'status' => 'active'
                ],
                [
                    'name' => 'West Warehouse',
                    'address' => 'Mirpur Industrial Area',
                    'thana_id' => $thanas->skip(4)->first()->id ?? $thanas->first()->id,
                    'employee_id' => $employees->skip(4)->first()->id ?? $employees->first()->id,
                    'status' => 'active'
                ],
            ];
        }

        foreach ($warehouses as $warehouse) {
            Warehouse::create($warehouse);
        }
    }
}
