<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductAdjustment;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductAdjustmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $products = Product::all();

        if ($users->isEmpty() || $products->isEmpty()) {
            $this->command->warn('No users or products found. Please seed users and products first.');
            return;
        }

        $adjustments = [
            [
                'type' => 'decrease',
                'reason' => 'damaged',
                'quantity_adjusted' => 5,
                'status' => 'approved',
                'notes' => 'Items damaged during storage'
            ],
            [
                'type' => 'increase',
                'reason' => 'found',
                'quantity_adjusted' => 3,
                'status' => 'pending',
                'notes' => 'Found extra items during inventory count'
            ],
            [
                'type' => 'decrease',
                'reason' => 'expired',
                'quantity_adjusted' => 8,
                'status' => 'approved',
                'notes' => 'Items passed expiration date'
            ],
            [
                'type' => 'increase',
                'reason' => 'recount',
                'quantity_adjusted' => 2,
                'status' => 'pending',
                'notes' => 'Inventory recount found discrepancy'
            ],
            [
                'type' => 'decrease',
                'reason' => 'lost',
                'quantity_adjusted' => 1,
                'status' => 'rejected',
                'notes' => 'Item reported lost but later found'
            ]
        ];

        foreach ($adjustments as $adjustmentData) {
            $product = $products->random();
            $user = $users->random();
            $approver = $users->where('id', '!=', $user->id)->random();

            $oldQuantity = $product->stock_quantity;
            $quantityAdjusted = $adjustmentData['quantity_adjusted'];

            if ($adjustmentData['type'] === 'increase') {
                $newQuantity = $oldQuantity + $quantityAdjusted;
            } else {
                $newQuantity = max(0, $oldQuantity - $quantityAdjusted);
                $quantityAdjusted = $oldQuantity - $newQuantity;
            }

            $adjustment = ProductAdjustment::create([
                'reference_number' => ProductAdjustment::generateReferenceNumber(),
                'product_id' => $product->id,
                'type' => $adjustmentData['type'],
                'quantity_adjusted' => $quantityAdjusted,
                'old_quantity' => $oldQuantity,
                'new_quantity' => $newQuantity,
                'reason' => $adjustmentData['reason'],
                'notes' => $adjustmentData['notes'],
                'user_id' => $user->id,
                'adjustment_date' => now()->subDays(rand(1, 30)),
                'status' => $adjustmentData['status'],
                'approved_by' => $adjustmentData['status'] !== 'pending' ? $approver->id : null,
                'approved_at' => $adjustmentData['status'] !== 'pending' ? now()->subDays(rand(0, 15)) : null,
            ]);

            // Update product stock if approved
            if ($adjustmentData['status'] === 'approved') {
                $product->update(['stock_quantity' => $newQuantity]);
            }
        }

        $this->command->info('Product adjustments seeded successfully!');
    }
}
