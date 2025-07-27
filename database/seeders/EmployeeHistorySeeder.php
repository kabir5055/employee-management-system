<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmployeeHistory;
use App\Models\User;
use Carbon\Carbon;

class EmployeeHistorySeeder extends Seeder
{
    public function run()
    {
        $employees = User::all();

        foreach ($employees as $employee) {
            // Joining record
            EmployeeHistory::create([
                'employee_id' => $employee->id,
                'action' => 'joined',
                'description' => $employee->name . ' joined the company as ' . $employee->position->title,
                'old_salary' => null,
                'new_salary' => $employee->current_salary,
                'old_position' => null,
                'new_position' => $employee->position->title,
                'effective_date' => $employee->joining_date,
            ]);

            // Random salary increases for some employees
            if (rand(1, 100) <= 30) { // 30% chance of salary increase
                $oldSalary = $employee->current_salary * 0.85; // Previous salary was 15% less
                $increaseDate = Carbon::parse($employee->joining_date->format('Y-m-d'))->addMonths(rand(6, 24));

                if ($increaseDate->isPast()) {
                    EmployeeHistory::create([
                        'employee_id' => $employee->id,
                        'action' => 'salary_increase',
                        'description' => 'Annual salary increment for ' . $employee->name,
                        'old_salary' => $oldSalary,
                        'new_salary' => $employee->current_salary,
                        'old_position' => $employee->position->title,
                        'new_position' => $employee->position->title,
                        'effective_date' => $increaseDate,
                    ]);
                }
            }

            // Leaving record for inactive employees
            if ($employee->status === 'inactive' && $employee->leaving_date) {
                EmployeeHistory::create([
                    'employee_id' => $employee->id,
                    'action' => 'resigned',
                    'description' => $employee->name . ' resigned from the position of ' . $employee->position->title,
                    'old_salary' => $employee->current_salary,
                    'new_salary' => null,
                    'old_position' => $employee->position->title,
                    'new_position' => null,
                    'effective_date' => $employee->leaving_date,
                ]);
            }
        }
    }
}
