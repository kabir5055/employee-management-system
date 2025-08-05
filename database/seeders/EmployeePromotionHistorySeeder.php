<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmployeePromotionHistory;
use App\Models\User;
use App\Models\Position;
use App\Models\Department;
use Carbon\Carbon;

class EmployeePromotionHistorySeeder extends Seeder
{
    public function run()
    {
        $employees = User::where('status', 'active')->where('role', '!=', 'admin')->get();
        $positions = Position::where('is_active', true)->get();
        $departments = Department::where('is_active', true)->get();
        $admins = User::where('is_super_admin', true)->orWhere('role', 'admin')->get();

        if ($employees->isEmpty() || $positions->isEmpty() || $departments->isEmpty()) {
            $this->command->warn('Skipping EmployeePromotionHistorySeeder - need employees, positions, and departments to be seeded first');
            return;
        }

        $promotionTypes = ['promotion', 'demotion', 'transfer', 'salary_change'];
        $promotionReasons = [
            'Outstanding performance in quarterly review',
            'Completion of professional certification',
            'Exceeded annual sales targets',
            'Leadership excellence demonstrated',
            'Process improvement initiatives',
            'Client satisfaction achievements',
            'Team management skills development',
            'Cost reduction project success',
            'Innovation and creative solutions',
            'Cross-departmental collaboration',
            'Restructuring requirements',
            'Market expansion needs',
            'Departmental consolidation',
            'Skill set alignment',
            'Performance improvement plan completion'
        ];

        // Create promotion histories for about 30% of employees
        $selectedEmployees = $employees->random(min(30, $employees->count()));

        foreach ($selectedEmployees as $employee) {
            // Each employee can have 1-3 promotion records
            $promotionCount = rand(1, 3);

            for ($i = 0; $i < $promotionCount; $i++) {
                $effectiveDate = Carbon::now()->subDays(rand(30, 1095)); // Within last 3 years
                $promotionType = $promotionTypes[array_rand($promotionTypes)];

                $previousPosition = $positions->random();
                $previousDepartment = $departments->random();
                $previousSalary = rand(25000, 80000);

                $newPosition = $positions->random();
                $newDepartment = $departments->random();

                // Salary changes based on promotion type
                switch ($promotionType) {
                    case 'promotion':
                        $newSalary = $previousSalary + rand(5000, 20000);
                        break;
                    case 'demotion':
                        $newSalary = max(20000, $previousSalary - rand(2000, 10000));
                        break;
                    case 'transfer':
                        $newSalary = $previousSalary + rand(-2000, 5000);
                        break;
                    case 'salary_change':
                        $newSalary = $previousSalary + rand(-5000, 15000);
                        break;
                    default:
                        $newSalary = $previousSalary;
                }

                EmployeePromotionHistory::create([
                    'user_id' => $employee->id,
                    'previous_position_id' => $previousPosition->id,
                    'previous_department_id' => $previousDepartment->id,
                    'previous_salary' => $previousSalary,
                    'new_position_id' => $newPosition->id,
                    'new_department_id' => $newDepartment->id,
                    'new_salary' => $newSalary,
                    'promotion_type' => $promotionType,
                    'effective_date' => $effectiveDate->format('Y-m-d'),
                    'reason' => $promotionReasons[array_rand($promotionReasons)],
                    'notes' => rand(0, 1) ? 'Additional notes regarding ' . strtolower($promotionType) . ' effective from ' . $effectiveDate->format('M Y') : null,
                    'approved_by' => $admins->isNotEmpty() ? $admins->random()->id : $employees->random()->id,
                    'approved_at' => $effectiveDate->copy()->subDays(rand(1, 7)),
                    'created_at' => $effectiveDate->copy()->subDays(rand(7, 14)),
                    'updated_at' => $effectiveDate->copy()->subDays(rand(1, 5))
                ]);
            }
        }

        $this->command->info('Employee promotion histories created successfully!');
    }
}
