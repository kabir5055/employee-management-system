<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StockTransfer;
use App\Models\Warehouse;
use App\Models\User;
use App\Models\Product;
use Carbon\Carbon;

class StockTransferSeeder extends Seeder
{
    public function run()
    {
        $warehouses = Warehouse::where('status', 'active')->get();
        $employees = User::where('status', 'active')->get();
        $products = Product::where('status', 'active')->get();
        $admins = User::where('is_super_admin', true)->orWhere('role', 'admin')->get();

        if ($warehouses->isEmpty() || $employees->isEmpty() || $products->isEmpty()) {
            $this->command->warn('Skipping StockTransferSeeder - need warehouses, employees, and products to be seeded first');
            return;
        }

        $statuses = ['pending', 'approved', 'completed', 'cancelled'];
        $transferReasons = [
            'Stock replenishment for field sales',
            'Emergency stock transfer',
            'Monthly stock allocation',
            'Special promotion requirements',
            'Regional demand adjustment',
            'Seasonal stock distribution',
            'New product launch distribution',
            'Quality control replacement',
            'Customer specific order fulfillment',
            'Backup stock preparation'
        ];

        // Create 50 stock transfers
        for ($i = 0; $i < 50; $i++) {
            $createdDate = Carbon::now()->subDays(rand(1, 90));
            $status = $statuses[array_rand($statuses)];

            $stockTransfer = [
                'from_warehouse_id' => $warehouses->random()->id,
                'to_employee_id' => $employees->random()->id,
                'product_id' => $products->random()->id,
                'quantity' => rand(1, 100),
                'status' => $status,
                'notes' => $transferReasons[array_rand($transferReasons)],
                'created_by' => $employees->random()->id,
                'created_at' => $createdDate,
                'updated_at' => $createdDate
            ];

            // If approved or completed, add approval data
            if (in_array($status, ['approved', 'completed'])) {
                $stockTransfer['approved_by'] = $admins->isNotEmpty() ? $admins->random()->id : $employees->random()->id;
                $stockTransfer['approved_at'] = $createdDate->copy()->addHours(rand(1, 48));
            }

            StockTransfer::create($stockTransfer);
        }

        $this->command->info('Stock transfers created successfully!');
    }
}
