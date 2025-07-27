<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SalaryStructure;
use App\Models\User;
use Carbon\Carbon;

class SalaryStructureSeeder extends Seeder
{
    public function run()
    {
        $employees = User::all();

        foreach ($employees as $employee) {
            $basicSalary = $employee->current_salary * 0.6; // 60% basic
            $houseRent = $employee->current_salary * 0.25; // 25% house rent
            $medical = $employee->current_salary * 0.08; // 8% medical
            $transport = $employee->current_salary * 0.05; // 5% transport
            $food = $employee->current_salary * 0.02; // 2% food

            SalaryStructure::create([
                'employee_id' => $employee->id,
                'basic_salary' => $basicSalary,
                'house_rent' => $houseRent,
                'medical_allowance' => $medical,
                'transport_allowance' => $transport,
                'food_allowance' => $food,
                'other_allowance' => 0,
                'gross_salary' => $employee->current_salary,
                'effective_from' => $employee->joining_date,
                'effective_to' => null,
            ]);
        }
    }
}