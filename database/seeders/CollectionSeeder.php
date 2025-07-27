<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Collection;
use App\Models\ProductDelivery;
use Carbon\Carbon;

class CollectionSeeder extends Seeder
{
    public function run()
    {
        $deliveries = ProductDelivery::where('status', 'sold')->get();

        foreach ($deliveries as $delivery) {
            // Create 1-3 collections per delivery
            $collectionsCount = rand(1, 3);
            $remainingAmount = $delivery->total_amount;

            for ($i = 0; $i < $collectionsCount && $remainingAmount > 0; $i++) {
                $collectionAmount = $i === $collectionsCount - 1
                    ? $remainingAmount
                    : rand(1000, min($remainingAmount, $delivery->total_amount * 0.7));

                Collection::create([
                    'employee_id' => $delivery->employee_id,
                    'delivery_id' => $delivery->id,
                    'warehouse_id' => $delivery->warehouse_id,
                    'amount_collected' => $collectionAmount,
                    'collection_date' => $delivery->delivery_date->copy()->addDays(rand(1, 30)),
                    'notes' => 'Collection for delivery #' . $delivery->id,
                    'payment_method' => collect(['cash', 'bank', 'mobile_banking'])->random(),
                ]);

                $remainingAmount -= $collectionAmount;
            }
        }
    }
}
