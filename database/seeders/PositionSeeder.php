<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Position;

class PositionSeeder extends Seeder
{
    public function run()
    {
        $positions = [
            // Management
            ['title' => 'Managing Director', 'department_id' => 1, 'base_salary' => 350000, 'grade' => 'Executive'],
            ['title' => 'General Manager', 'department_id' => 1, 'base_salary' => 250000, 'grade' => 'Senior'],
            ['title' => 'Assistant General Manager', 'department_id' => 1, 'base_salary' => 180000, 'grade' => 'Senior'],
            
            // HR
            ['title' => 'HR Manager', 'department_id' => 2, 'base_salary' => 120000, 'grade' => 'Senior'],
            ['title' => 'HR Executive', 'department_id' => 2, 'base_salary' => 65000, 'grade' => 'Mid'],
            ['title' => 'HR Assistant', 'department_id' => 2, 'base_salary' => 35000, 'grade' => 'Junior'],
            
            // Marketing
            ['title' => 'Marketing Manager', 'department_id' => 3, 'base_salary' => 150000, 'grade' => 'Senior'],
            ['title' => 'Marketing Executive', 'department_id' => 3, 'base_salary' => 75000, 'grade' => 'Mid'],
            ['title' => 'Marketing Assistant', 'department_id' => 3, 'base_salary' => 45000, 'grade' => 'Junior'],
            ['title' => 'Field Marketing Officer', 'department_id' => 3, 'base_salary' => 55000, 'grade' => 'Mid'],
            
            // Sales
            ['title' => 'Sales Manager', 'department_id' => 4, 'base_salary' => 140000, 'grade' => 'Senior'],
            ['title' => 'Senior Sales Executive', 'department_id' => 4, 'base_salary' => 85000, 'grade' => 'Mid'],
            ['title' => 'Sales Executive', 'department_id' => 4, 'base_salary' => 60000, 'grade' => 'Mid'],
            ['title' => 'Sales Representative', 'department_id' => 4, 'base_salary' => 40000, 'grade' => 'Junior'],
            
            // Finance
            ['title' => 'Finance Manager', 'department_id' => 5, 'base_salary' => 130000, 'grade' => 'Senior'],
            ['title' => 'Accountant', 'department_id' => 5, 'base_salary' => 70000, 'grade' => 'Mid'],
            ['title' => 'Junior Accountant', 'department_id' => 5, 'base_salary' => 45000, 'grade' => 'Junior'],
            
            // Operations
            ['title' => 'Operations Manager', 'department_id' => 6, 'base_salary' => 125000, 'grade' => 'Senior'],
            ['title' => 'Operations Executive', 'department_id' => 6, 'base_salary' => 65000, 'grade' => 'Mid'],
            ['title' => 'Logistics Coordinator', 'department_id' => 6, 'base_salary' => 50000, 'grade' => 'Mid'],
            
            // IT
            ['title' => 'IT Manager', 'department_id' => 7, 'base_salary' => 140000, 'grade' => 'Senior'],
            ['title' => 'Software Developer', 'department_id' => 7, 'base_salary' => 80000, 'grade' => 'Mid'],
            ['title' => 'IT Support', 'department_id' => 7, 'base_salary' => 45000, 'grade' => 'Junior'],
        ];

        foreach ($positions as $position) {
            Position::create($position);
        }
    }
}