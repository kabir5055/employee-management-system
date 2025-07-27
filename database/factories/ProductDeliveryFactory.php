<?php

namespace Database\Factories;

use App\Models\ProductDelivery;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class ProductDeliveryFactory extends Factory
{
    protected $model = ProductDelivery::class;

    public function definition()
    {
        $product = Product::inRandomOrder()->first();
        $employee = User::where('status', 'active')->inRandomOrder()->first();
        $quantity = $this->faker->numberBetween(1, 50);
        $price = $product->price;
        $totalAmount = $quantity * $price;

        // Generate dates from 12 years ago to now
        $startDate = Carbon::now()->subYears(12);
        $endDate = Carbon::now();

        return [
            'product_id' => $product->id,
            'employee_id' => $employee->id,
            'quantity' => $quantity,
            'unit_price' => $price,
            'total_amount' => $totalAmount,
            'delivery_date' => $this->faker->dateTimeBetween($startDate, $endDate),
            'status' => $this->faker->randomElement(['delivered', 'pending', 'cancelled']),
            'payment_status' => $this->faker->randomElement(['paid', 'unpaid', 'partial']),
            'notes' => $this->faker->optional()->sentence(),
            'commission_rate' => $this->faker->randomFloat(2, 5, 15), // 5% to 15% commission
            'commission_amount' => function (array $attributes) {
                return ($attributes['total_amount'] * $attributes['commission_rate']) / 100;
            },
        ];
    }
}
