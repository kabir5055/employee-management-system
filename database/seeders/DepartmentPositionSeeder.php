<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Position;
use Illuminate\Database\Seeder;

class DepartmentPositionSeeder extends Seeder
{
    /**
     * Run the database seeders.
     */
    public function run(): void
    {
        $departments = [
            'Sales & Marketing' => [
                'Sales Executive' => ['Junior Sales Executive', 'Senior Sales Executive', 'Area Sales Manager'],
                'Marketing' => ['Marketing Executive', 'Brand Executive', 'Marketing Manager'],
                'Business Development' => ['Business Development Executive', 'Key Account Manager']
            ],
            'Operations' => [
                'Field Operations' => ['Field Officer', 'Area Supervisor', 'Regional Manager'],
                'Logistics' => ['Logistics Officer', 'Warehouse Supervisor', 'Distribution Manager'],
                'Supply Chain' => ['Supply Chain Executive', 'Procurement Officer']
            ],
            'Finance & Accounts' => [
                'Accounts' => ['Accounts Executive', 'Senior Accountant', 'Finance Manager'],
                'Internal Audit' => ['Audit Executive', 'Senior Auditor'],
                'Treasury' => ['Treasury Officer', 'Cash Management Officer']
            ],
            'Human Resources' => [
                'Recruitment' => ['HR Executive', 'Recruitment Specialist'],
                'Training' => ['Training Officer', 'L&D Specialist'],
                'Admin' => ['Admin Officer', 'Facilities Manager']
            ],
            'IT' => [
                'Software Development' => ['Software Engineer', 'Senior Developer', 'Team Lead'],
                'IT Support' => ['IT Support Engineer', 'System Administrator'],
                'Network' => ['Network Engineer', 'Network Administrator']
            ]
        ];

        foreach ($departments as $deptName => $sections) {
            $department = Department::create(['name' => $deptName]);

            foreach ($sections as $section => $positions) {
                foreach ($positions as $position) {
                    Position::create([
                        'department_id' => $department->id,
                        'name' => $position,
                        'section' => $section
                    ]);
                }
            }
        }
    }
}
