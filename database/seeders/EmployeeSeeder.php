<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Position;
use Faker\Factory as Faker;
use Carbon\Carbon;

class EmployeeSeeder extends Seeder
{
    public function run()
    {
        $departments = Department::where('is_active', true)->get();
        $positions = Position::where('is_active', true)->get();

        if ($departments->isEmpty() || $positions->isEmpty()) {
            $this->command->warn('Skipping EmployeeSeeder - need departments and positions to be seeded first');
            return;
        }

        $faker = Faker::create();

        // Create 30 employees
        for ($i = 0; $i < 30; $i++) {
            $joinDate = Carbon::now()->subDays(rand(30, 1095)); // Joined within last 3 years
            $birthDate = Carbon::now()->subYears(rand(25, 50)); // Age between 25-50

            Employee::create([
                'employee_id' => 'EMP' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'name' => $faker->name(),
                'email' => $faker->unique()->safeEmail(),
                'phone' => $faker->phoneNumber(),
                'address' => $faker->address(),
                'join_date' => $joinDate->format('Y-m-d'),
                'birth_date' => $birthDate->format('Y-m-d'),
                'gender' => $faker->randomElement(['male', 'female']),
                'marital_status' => $faker->randomElement(['single', 'married', 'divorced']),
                'national_id' => $faker->unique()->numerify('##########'),
                'department_id' => $departments->random()->id,
                'position_id' => $positions->random()->id,
                'basic_salary' => rand(25000, 80000),
                'status' => $faker->randomElement(['active', 'active', 'active', 'inactive']), // 75% active
                'emergency_contact' => $faker->name() . ' - ' . $faker->phoneNumber(),
                'bank_account' => $faker->bankAccountNumber(),
                'bank_name' => $faker->randomElement(['Sonali Bank', 'Rupali Bank', 'Janata Bank', 'Agrani Bank', 'Dutch-Bangla Bank', 'BRAC Bank', 'City Bank']),
                'created_at' => $joinDate,
                'updated_at' => $joinDate->copy()->addDays(rand(1, 30))
            ]);
        }

        $this->command->info('Employees created successfully!');
    }
}
