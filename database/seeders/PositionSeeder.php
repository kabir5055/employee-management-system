<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Position;

class PositionSeeder extends Seeder
{
    public function run()
    {
        $positions = [
            // Executive Level
            [
                'name' => 'Chief Executive Officer',
                'description' => 'Overall strategic leadership and company direction',
                'min_salary' => 350000,
                'max_salary' => 500000,
                'level' => 'executive',
                'requirements' => ['MBA or equivalent', '15+ years experience', 'Leadership skills'],
                'is_active' => true,
            ],
            [
                'name' => 'Chief Technology Officer',
                'description' => 'Technology strategy and innovation leadership',
                'min_salary' => 300000,
                'max_salary' => 450000,
                'level' => 'executive',
                'requirements' => ['Technical degree', '12+ years experience', 'Strategic thinking'],
                'is_active' => true,
            ],

            // Director Level
            [
                'name' => 'Director of Operations',
                'description' => 'Oversee daily operations and operational strategy',
                'min_salary' => 200000,
                'max_salary' => 300000,
                'level' => 'director',
                'requirements' => ['Business degree', '10+ years experience', 'Operations expertise'],
                'is_active' => true,
            ],
            [
                'name' => 'Director of Sales',
                'description' => 'Lead sales strategy and team management',
                'min_salary' => 180000,
                'max_salary' => 280000,
                'level' => 'director',
                'requirements' => ['Sales experience', '8+ years leadership', 'Revenue growth track record'],
                'is_active' => true,
            ],

            // Manager Level
            [
                'name' => 'Human Resources Manager',
                'description' => 'Manage HR policies, recruitment, and employee relations',
                'min_salary' => 80000,
                'max_salary' => 120000,
                'level' => 'manager',
                'requirements' => ['HR degree', '5+ years experience', 'SHRM certification preferred'],
                'is_active' => true,
            ],
            [
                'name' => 'Marketing Manager',
                'description' => 'Develop and execute marketing strategies',
                'min_salary' => 75000,
                'max_salary' => 110000,
                'level' => 'manager',
                'requirements' => ['Marketing degree', '4+ years experience', 'Digital marketing skills'],
                'is_active' => true,
            ],
            [
                'name' => 'Finance Manager',
                'description' => 'Financial planning, analysis, and reporting',
                'min_salary' => 85000,
                'max_salary' => 125000,
                'level' => 'manager',
                'requirements' => ['Finance/Accounting degree', 'CPA preferred', '5+ years experience'],
                'is_active' => true,
            ],

            // Senior Level
            [
                'name' => 'Senior Software Engineer',
                'description' => 'Lead technical projects and mentor junior developers',
                'min_salary' => 90000,
                'max_salary' => 130000,
                'level' => 'senior',
                'requirements' => ['Computer Science degree', '5+ years experience', 'Full-stack skills'],
                'is_active' => true,
            ],
            [
                'name' => 'Senior Sales Executive',
                'description' => 'Handle key accounts and complex sales processes',
                'min_salary' => 60000,
                'max_salary' => 90000,
                'level' => 'senior',
                'requirements' => ['Sales experience', '3+ years experience', 'Client relationship management'],
                'is_active' => true,
            ],
            [
                'name' => 'Senior Accountant',
                'description' => 'Complex financial transactions and reporting',
                'min_salary' => 55000,
                'max_salary' => 80000,
                'level' => 'senior',
                'requirements' => ['Accounting degree', '4+ years experience', 'Advanced Excel skills'],
                'is_active' => true,
            ],

            // Mid Level
            [
                'name' => 'Software Engineer',
                'description' => 'Develop and maintain software applications',
                'min_salary' => 60000,
                'max_salary' => 90000,
                'level' => 'mid',
                'requirements' => ['Computer Science degree', '2+ years experience', 'Programming skills'],
                'is_active' => true,
            ],
            [
                'name' => 'Marketing Executive',
                'description' => 'Execute marketing campaigns and initiatives',
                'min_salary' => 45000,
                'max_salary' => 65000,
                'level' => 'mid',
                'requirements' => ['Marketing background', '2+ years experience', 'Creative thinking'],
                'is_active' => true,
            ],
            [
                'name' => 'Sales Executive',
                'description' => 'Generate leads and close sales',
                'min_salary' => 40000,
                'max_salary' => 60000,
                'level' => 'mid',
                'requirements' => ['Sales experience', '1+ years experience', 'Communication skills'],
                'is_active' => true,
            ],
            [
                'name' => 'Accountant',
                'description' => 'Handle day-to-day accounting operations',
                'min_salary' => 42000,
                'max_salary' => 60000,
                'level' => 'mid',
                'requirements' => ['Accounting degree', '2+ years experience', 'Attention to detail'],
                'is_active' => true,
            ],

            // Junior Level
            [
                'name' => 'Junior Software Developer',
                'description' => 'Support software development under supervision',
                'min_salary' => 35000,
                'max_salary' => 50000,
                'level' => 'junior',
                'requirements' => ['Computer Science degree', 'Programming knowledge', 'Willingness to learn'],
                'is_active' => true,
            ],
            [
                'name' => 'HR Assistant',
                'description' => 'Support HR operations and administration',
                'min_salary' => 30000,
                'max_salary' => 45000,
                'level' => 'junior',
                'requirements' => ['Bachelor degree', 'Communication skills', 'Organizational skills'],
                'is_active' => true,
            ],
            [
                'name' => 'Administrative Assistant',
                'description' => 'Provide administrative support to various departments',
                'min_salary' => 28000,
                'max_salary' => 40000,
                'level' => 'junior',
                'requirements' => ['High school diploma', 'Computer skills', 'Organization skills'],
                'is_active' => true,
            ],

            // Entry Level
            [
                'name' => 'Intern',
                'description' => 'Learn and support various departments',
                'min_salary' => 20000,
                'max_salary' => 30000,
                'level' => 'entry',
                'requirements' => ['Currently enrolled in degree program', 'Eagerness to learn'],
                'is_active' => true,
            ],
        ];

        foreach ($positions as $position) {
            Position::create($position);
        }
    }
}
