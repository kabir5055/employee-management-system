<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StockAdjustment;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;

class StockAdjustmentSeeder extends Seeder
{
    public function run()
    {
        $products = Product::where('status', 'active')->get();
        $users = User::where('status', 'active')->get();

        if ($products->isEmpty() || $users->isEmpty()) {
            $this->command->warn('Skipping StockAdjustmentSeeder - need products and users to be seeded first');
            return;
        }

        $adjustmentReasons = [
            'Physical inventory count discrepancy',
            'Damaged goods removal',
            'Expired product removal',
            'Quality control adjustment',
            'System error correction',
            'Return from customer',
            'Promotional sample deduction',
            'Theft/loss adjustment',
            'Manufacturing defect removal',
            'Seasonal clearance adjustment',
            'New stock received',
            'Supplier return credit',
            'Internal consumption',
            'Display unit adjustment',
            'Broken during handling'
        ];

        // Create 75 stock adjustments
        for ($i = 0; $i < 75; $i++) {
            $product = $products->random();
            $previousQuantity = rand(50, 500);
            $adjustment = rand(-50, 100); // Can be positive or negative
            $newQuantity = max(0, $previousQuantity + $adjustment); // Ensure not negative

            StockAdjustment::create([
                'product_id' => $product->id,
                'user_id' => $users->random()->id,
                'adjustment' => $adjustment,
                'reason' => $adjustmentReasons[array_rand($adjustmentReasons)],
                'previous_quantity' => $previousQuantity,
                'new_quantity' => $newQuantity,
                'created_at' => Carbon::now()->subDays(rand(1, 120)),
                'updated_at' => Carbon::now()->subDays(rand(1, 120))
            ]);
        }

        $this->command->info('Stock adjustments created successfully!');
    }
}
