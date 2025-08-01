<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run()
    {
        $departments = [
            [
                'name' => 'Executive Management',
                'description' => 'Executive leadership and strategic planning',
                'head_of_department' => 'Chief Executive Officer',
                'budget' => 2000000,
                'location' => 'Corporate Headquarters - Floor 10',
                'email' => 'executive@company.com',
                'phone' => '+1-555-0100',
                'is_active' => true,
            ],
            [
                'name' => 'Human Resources',
                'description' => 'HR operations, recruitment, employee relations and organizational development',
                'head_of_department' => 'HR Manager',
                'budget' => 800000,
                'location' => 'Main Building - Floor 2',
                'email' => 'hr@company.com',
                'phone' => '+1-555-0200',
                'is_active' => true,
            ],
            [
                'name' => 'Information Technology',
                'description' => 'Software development, system administration, and technical support',
                'head_of_department' => 'Chief Technology Officer',
                'budget' => 1500000,
                'location' => 'Tech Center - Floor 5',
                'email' => 'it@company.com',
                'phone' => '+1-555-0300',
                'is_active' => true,
            ],
            [
                'name' => 'Sales & Marketing',
                'description' => 'Sales operations, marketing campaigns, and customer acquisition',
                'head_of_department' => 'Director of Sales',
                'budget' => 1200000,
                'location' => 'Sales Floor - Floor 3',
                'email' => 'sales@company.com',
                'phone' => '+1-555-0400',
                'is_active' => true,
            ],
            [
                'name' => 'Finance & Accounting',
                'description' => 'Financial planning, accounting, budgeting, and financial reporting',
                'head_of_department' => 'Finance Manager',
                'budget' => 600000,
                'location' => 'Finance Wing - Floor 4',
                'email' => 'finance@company.com',
                'phone' => '+1-555-0500',
                'is_active' => true,
            ],
            [
                'name' => 'Operations',
                'description' => 'Daily operations, logistics, supply chain, and process management',
                'head_of_department' => 'Director of Operations',
                'budget' => 1000000,
                'location' => 'Operations Center - Floor 1',
                'email' => 'operations@company.com',
                'phone' => '+1-555-0600',
                'is_active' => true,
            ],
            [
                'name' => 'Research & Development',
                'description' => 'Product research, innovation, and development initiatives',
                'head_of_department' => 'R&D Manager',
                'budget' => 900000,
                'location' => 'R&D Lab - Floor 6',
                'email' => 'rd@company.com',
                'phone' => '+1-555-0700',
                'is_active' => true,
            ],
            [
                'name' => 'Customer Service',
                'description' => 'Customer support, complaint resolution, and client relations',
                'head_of_department' => 'Customer Service Manager',
                'budget' => 500000,
                'location' => 'Call Center - Floor 2',
                'email' => 'support@company.com',
                'phone' => '+1-555-0800',
                'is_active' => true,
            ],
            [
                'name' => 'Quality Assurance',
                'description' => 'Quality control, testing, and compliance monitoring',
                'head_of_department' => 'QA Manager',
                'budget' => 400000,
                'location' => 'Quality Lab - Floor 3',
                'email' => 'qa@company.com',
                'phone' => '+1-555-0900',
                'is_active' => true,
            ],
            [
                'name' => 'Legal & Compliance',
                'description' => 'Legal affairs, regulatory compliance, and risk management',
                'head_of_department' => 'Legal Counsel',
                'budget' => 300000,
                'location' => 'Legal Office - Floor 8',
                'email' => 'legal@company.com',
                'phone' => '+1-555-1000',
                'is_active' => true,
            ],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}
