<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Warehouse;
use App\Models\WarehouseInventory;
use App\Models\User;
use App\Models\Thana;
use App\Models\Product;

class WarehouseSeeder extends Seeder
{
    public function run()
    {
        // Get some users and thanas for foreign keys
        $users = User::where('status', 'active')->take(10)->get();
        $thanas = Thana::take(20)->get();
        $products = Product::where('status', 'active')->get();

        if ($users->isEmpty() || $thanas->isEmpty()) {
            $this->command->warn('Skipping WarehouseSeeder - need users and thanas to be seeded first');
            return;
        }

        $warehouses = [
            [
                'name' => 'Main Warehouse - Dhaka',
                'address' => 'House #123, Road #4, Dhanmondi, Dhaka-1205',
                'status' => 'active'
            ],
            [
                'name' => 'Chittagong Distribution Center',
                'address' => 'Building #45, CDA Avenue, Nasirabad, Chittagong-4000',
                'status' => 'active'
            ],
            [
                'name' => 'Sylhet Regional Warehouse',
                'address' => 'Plot #67, Zindabazar, Sylhet-3100',
                'status' => 'active'
            ],
            [
                'name' => 'Rajshahi Storage Facility',
                'address' => 'Sector #12, Saheb Bazar, Rajshahi-6000',
                'status' => 'active'
            ],
            [
                'name' => 'Khulna Logistics Hub',
                'address' => 'Ward #15, KDA Avenue, Khulna-9000',
                'status' => 'active'
            ],
            [
                'name' => 'Barisal Mini Warehouse',
                'address' => 'Road #8, Band Road Area, Barisal-8200',
                'status' => 'active'
            ],
            [
                'name' => 'Rangpur Storage Center',
                'address' => 'House #34, Station Road, Rangpur-5400',
                'status' => 'active'
            ],
            [
                'name' => 'Mymensingh Branch Warehouse',
                'address' => 'Plot #89, Choto Bazar, Mymensingh-2200',
                'status' => 'active'
            ],
            [
                'name' => 'Comilla Distribution Point',
                'address' => 'Building #56, Ranir Dighi, Comilla-3500',
                'status' => 'inactive'
            ],
            [
                'name' => 'Jessore Backup Facility',
                'address' => 'House #23, MK Road, Jessore-7400',
                'status' => 'active'
            ]
        ];

        foreach ($warehouses as $warehouseData) {
            // Assign random user and thana
            $warehouseData['employee_id'] = $users->random()->id;
            $warehouseData['thana_id'] = $thanas->random()->id;

            $warehouse = Warehouse::create($warehouseData);

            // Create inventory for each product in this warehouse
            if ($products->isNotEmpty()) {
                foreach ($products as $product) {
                    // Only create inventory for some products randomly
                    if (rand(1, 100) <= 70) { // 70% chance of having this product
                        WarehouseInventory::create([
                            'warehouse_id' => $warehouse->id,
                            'product_id' => $product->id,
                            'quantity' => rand(0, 500),
                            'minimum_quantity' => rand(5, 20),
                            'maximum_quantity' => rand(100, 1000)
                        ]);
                    }
                }
            }
        }

        $this->command->info('Warehouses and inventories created successfully!');
    }
}
