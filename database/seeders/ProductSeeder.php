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
                'price' => 250.00,
                'cost_price' => 180.00,
                'stock_quantity' => 500,
                'sku' => 'TEA001',
                'status' => 'active'
            ],
            [
                'name' => 'Organic Coffee Beans',
                'description' => 'Premium organic coffee beans',
                'price' => 450.00,
                'cost_price' => 320.00,
                'stock_quantity' => 300,
                'sku' => 'COF001',
                'status' => 'active'
            ],
            [
                'name' => 'Herbal Tea Mix',
                'description' => 'Natural herbal tea mixture',
                'price' => 180.00,
                'cost_price' => 120.00,
                'stock_quantity' => 400,
                'sku' => 'HER001',
                'status' => 'active'
            ],
            [
                'name' => 'Green Tea Special',
                'description' => 'Special green tea variety',
                'price' => 320.00,
                'cost_price' => 230.00,
                'stock_quantity' => 250,
                'sku' => 'GRN001',
                'status' => 'active'
            ],
            [
                'name' => 'Black Tea Premium',
                'description' => 'Premium black tea leaves',
                'price' => 280.00,
                'cost_price' => 200.00,
                'stock_quantity' => 350,
                'sku' => 'BLK001',
                'status' => 'active'
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}