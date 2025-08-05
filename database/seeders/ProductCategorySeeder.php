<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductCategory;

class ProductCategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            [
                'name' => 'Electronics',
                'description' => 'Electronic devices, gadgets, and tech accessories',
                'is_active' => true,
                'sort_order' => 1
            ],
            [
                'name' => 'Clothing & Fashion',
                'description' => 'Apparel, shoes, and fashion accessories',
                'is_active' => true,
                'sort_order' => 2
            ],
            [
                'name' => 'Books & Education',
                'description' => 'Books, educational materials, and learning resources',
                'is_active' => true,
                'sort_order' => 3
            ],
            [
                'name' => 'Home & Garden',
                'description' => 'Home improvement, furniture, and gardening supplies',
                'is_active' => true,
                'sort_order' => 4
            ],
            [
                'name' => 'Sports & Outdoor',
                'description' => 'Sports equipment, outdoor gear, and fitness products',
                'is_active' => true,
                'sort_order' => 5
            ],
            [
                'name' => 'Health & Beauty',
                'description' => 'Health products, cosmetics, and personal care items',
                'is_active' => true,
                'sort_order' => 6
            ]
        ];

        foreach ($categories as $category) {
            ProductCategory::create($category);
        }
    }
}
