<?php

namespace Database\Seeders;

use App\Models\ProductUnit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            [
                'name' => 'Pieces',
                'short_name' => 'pcs',
                'description' => 'Individual pieces or items',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Kilograms',
                'short_name' => 'kg',
                'description' => 'Weight measurement in kilograms',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Grams',
                'short_name' => 'g',
                'description' => 'Weight measurement in grams',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Liters',
                'short_name' => 'L',
                'description' => 'Volume measurement in liters',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Milliliters',
                'short_name' => 'ml',
                'description' => 'Volume measurement in milliliters',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Meters',
                'short_name' => 'm',
                'description' => 'Length measurement in meters',
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'name' => 'Centimeters',
                'short_name' => 'cm',
                'description' => 'Length measurement in centimeters',
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'name' => 'Boxes',
                'short_name' => 'box',
                'description' => 'Packaged in boxes',
                'is_active' => true,
                'sort_order' => 8,
            ],
            [
                'name' => 'Packs',
                'short_name' => 'pack',
                'description' => 'Packaged in packs',
                'is_active' => true,
                'sort_order' => 9,
            ],
            [
                'name' => 'Dozens',
                'short_name' => 'doz',
                'description' => 'Packaged in dozens (12 pieces)',
                'is_active' => true,
                'sort_order' => 10,
            ],
        ];

        foreach ($units as $unit) {
            ProductUnit::firstOrCreate(
                ['name' => $unit['name']],
                $unit
            );
        }
    }
}
