<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\District;
use App\Models\Upazila;
use App\Models\Thana;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'employee_code' => 'EMP' . fake()->unique()->numberBetween(1000, 9999),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'date_of_birth' => fake()->date(),
            'joining_date' => fake()->dateTimeBetween('-2 years', 'now'),
            'current_salary' => fake()->numberBetween(30000, 100000),
            'status' => fake()->randomElement(['active', 'inactive']),
            'designation' => fake()->jobTitle(),
            'district_id' => District::inRandomOrder()->first()?->id,
            'upazila_id' => function (array $attributes) {
                return Upazila::where('district_id', $attributes['district_id'])
                    ->inRandomOrder()
                    ->first()?->id;
            },
            'thana_id' => function (array $attributes) {
                return Thana::where('upazila_id', $attributes['upazila_id'])
                    ->inRandomOrder()
                    ->first()?->id;
            },
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
