<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run()
    {
        $departments = [
            ['name' => 'Management', 'description' => 'Executive and senior management'],
            ['name' => 'Human Resources', 'description' => 'HR and admin functions'],
            ['name' => 'Marketing', 'description' => 'Marketing and promotional activities'],
            ['name' => 'Sales', 'description' => 'Sales and customer relations'],
            ['name' => 'Finance', 'description' => 'Finance and accounting'],
            ['name' => 'Operations', 'description' => 'Operations and logistics'],
            ['name' => 'IT', 'description' => 'Information Technology'],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}