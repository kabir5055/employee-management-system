<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $products = [
            [
                'name' => 'Premium Tea Blend',
                'description' => 'High quality tea blend for retail',
                'cost_price' => 180.00,
                'tp_price' => 220.00,
                'mrp_price' => 250.00,
                'minimum_quantity' => 10,
                'maximum_quantity' => 100,
                'sku' => 'TEA001',
                'status' => 'active'
            ],
            [
                'name' => 'Organic Coffee Beans',
                'description' => 'Premium organic coffee beans',
                'cost_price' => 320.00,
                'tp_price' => 400.00,
                'mrp_price' => 450.00,
                'minimum_quantity' => 10,
                'maximum_quantity' => 100,
                'sku' => 'COF001',
                'status' => 'active'
            ],
            [
                'name' => 'Herbal Tea Mix',
                'description' => 'Natural herbal tea mixture',
                'cost_price' => 120.00,
                'tp_price' => 160.00,
                'mrp_price' => 180.00,
                'minimum_quantity' => 10,
                'maximum_quantity' => 100,
                'sku' => 'HER001',
                'status' => 'active'
            ],
            [
                'name' => 'Green Tea Special',
                'description' => 'Special green tea variety',
                'cost_price' => 230.00,
                'tp_price' => 280.00,
                'mrp_price' => 320.00,
                'minimum_quantity' => 10,
                'maximum_quantity' => 100,
                'sku' => 'GRN001',
                'status' => 'active'
            ],
            [
                'name' => 'Black Tea Premium',
                'description' => 'Premium black tea leaves',
                'cost_price' => 200.00,
                'tp_price' => 240.00,
                'mrp_price' => 280.00,
                'minimum_quantity' => 10,
                'maximum_quantity' => 100,
                'sku' => 'BLK001',
                'status' => 'active'
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['sku' => $product['sku']],
                $product
            );
        }
    }
}
