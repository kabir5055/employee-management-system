<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    public function run()
    {
        $employees = [
            // Active Employees (33)
            ['name' => 'Abdul Karim Rahman', 'email' => 'karim.rahman@company.com', 'employee_id' => 'EMP001', 'phone' => '01711123456', 'joining_date' => '2020-01-15', 'department_id' => 1, 'position_id' => 1, 'current_salary' => 350000, 'role' => 'admin', 'status' => 'active'],
            ['name' => 'Fatima Begum', 'email' => 'fatima.begum@company.com', 'employee_id' => 'EMP002', 'phone' => '01711234567', 'joining_date' => '2020-03-01', 'department_id' => 2, 'position_id' => 4, 'current_salary' => 120000, 'role' => 'hr', 'status' => 'active'],
            ['name' => 'Mohammad Ali Hassan', 'email' => 'ali.hassan@company.com', 'employee_id' => 'EMP003', 'phone' => '01712345678', 'joining_date' => '2020-06-10', 'department_id' => 3, 'position_id' => 7, 'current_salary' => 150000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Rashida Khatun', 'email' => 'rashida.khatun@company.com', 'employee_id' => 'EMP004', 'phone' => '01713456789', 'joining_date' => '2020-07-20', 'department_id' => 4, 'position_id' => 11, 'current_salary' => 140000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Ibrahim Khan', 'email' => 'ibrahim.khan@company.com', 'employee_id' => 'EMP005', 'phone' => '01714567890', 'joining_date' => '2020-09-05', 'department_id' => 5, 'position_id' => 15, 'current_salary' => 130000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Nasir Ahmed', 'email' => 'nasir.ahmed@company.com', 'employee_id' => 'EMP006', 'phone' => '01715678901', 'joining_date' => '2021-01-12', 'department_id' => 6, 'position_id' => 18, 'current_salary' => 125000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Salma Akter', 'email' => 'salma.akter@company.com', 'employee_id' => 'EMP007', 'phone' => '01716789012', 'joining_date' => '2021-02-28', 'department_id' => 7, 'position_id' => 21, 'current_salary' => 140000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Mizanur Rahman', 'email' => 'mizan.rahman@company.com', 'employee_id' => 'EMP008', 'phone' => '01717890123', 'joining_date' => '2021-04-15', 'department_id' => 3, 'position_id' => 8, 'current_salary' => 75000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Ruma Begum', 'email' => 'ruma.begum@company.com', 'employee_id' => 'EMP009', 'phone' => '01718901234', 'joining_date' => '2021-06-01', 'department_id' => 4, 'position_id' => 12, 'current_salary' => 85000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Jahangir Alam', 'email' => 'jahangir.alam@company.com', 'employee_id' => 'EMP010', 'phone' => '01719012345', 'joining_date' => '2021-07-10', 'department_id' => 5, 'position_id' => 16, 'current_salary' => 70000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Shabnam Parvin', 'email' => 'shabnam.parvin@company.com', 'employee_id' => 'EMP011', 'phone' => '01720123456', 'joining_date' => '2021-08-20', 'department_id' => 6, 'position_id' => 19, 'current_salary' => 65000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Abdur Rahim', 'email' => 'abdur.rahim@company.com', 'employee_id' => 'EMP012', 'phone' => '01721234567', 'joining_date' => '2021-10-05', 'department_id' => 7, 'position_id' => 22, 'current_salary' => 80000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Shirina Akter', 'email' => 'shirina.akter@company.com', 'employee_id' => 'EMP013', 'phone' => '01722345678', 'joining_date' => '2021-11-15', 'department_id' => 2, 'position_id' => 5, 'current_salary' => 65000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Kamal Uddin', 'email' => 'kamal.uddin@company.com', 'employee_id' => 'EMP014', 'phone' => '01723456789', 'joining_date' => '2022-01-08', 'department_id' => 3, 'position_id' => 9, 'current_salary' => 45000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Marium Khatun', 'email' => 'marium.khatun@company.com', 'employee_id' => 'EMP015', 'phone' => '01724567890', 'joining_date' => '2022-02-20', 'department_id' => 4, 'position_id' => 13, 'current_salary' => 60000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Rafiqul Islam', 'email' => 'rafiq.islam@company.com', 'employee_id' => 'EMP016', 'phone' => '01725678901', 'joining_date' => '2022-03-12', 'department_id' => 5, 'position_id' => 17, 'current_salary' => 45000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Taslima Begum', 'email' => 'taslima.begum@company.com', 'employee_id' => 'EMP017', 'phone' => '01726789012', 'joining_date' => '2022-04-25', 'department_id' => 6, 'position_id' => 20, 'current_salary' => 50000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Aminul Haque', 'email' => 'aminul.haque@company.com', 'employee_id' => 'EMP018', 'phone' => '01727890123', 'joining_date' => '2022-06-08', 'department_id' => 7, 'position_id' => 23, 'current_salary' => 45000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Rohima Begum', 'email' => 'rohima.begum@company.com', 'employee_id' => 'EMP019', 'phone' => '01728901234', 'joining_date' => '2022-07-18', 'department_id' => 2, 'position_id' => 6, 'current_salary' => 35000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Shamsul Alam', 'email' => 'shamsul.alam@company.com', 'employee_id' => 'EMP020', 'phone' => '01729012345', 'joining_date' => '2022-08-30', 'department_id' => 3, 'position_id' => 10, 'current_salary' => 55000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Nasreen Akter', 'email' => 'nasreen.akter@company.com', 'employee_id' => 'EMP021', 'phone' => '01730123456', 'joining_date' => '2022-10-10', 'department_id' => 4, 'position_id' => 14, 'current_salary' => 40000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Golam Mustafa', 'email' => 'golam.mustafa@company.com', 'employee_id' => 'EMP022', 'phone' => '01731234567', 'joining_date' => '2022-11-22', 'department_id' => 1, 'position_id' => 2, 'current_salary' => 250000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Rahela Khatun', 'email' => 'rahela.khatun@company.com', 'employee_id' => 'EMP023', 'phone' => '01732345678', 'joining_date' => '2023-01-15', 'department_id' => 1, 'position_id' => 3, 'current_salary' => 180000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Anwar Hossain', 'email' => 'anwar.hossain@company.com', 'employee_id' => 'EMP024', 'phone' => '01733456789', 'joining_date' => '2023-02-28', 'department_id' => 3, 'position_id' => 8, 'current_salary' => 75000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Sultana Razia', 'email' => 'sultana.razia@company.com', 'employee_id' => 'EMP025', 'phone' => '01734567890', 'joining_date' => '2023-04-12', 'department_id' => 4, 'position_id' => 12, 'current_salary' => 85000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Habibur Rahman', 'email' => 'habib.rahman@company.com', 'employee_id' => 'EMP026', 'phone' => '01735678901', 'joining_date' => '2023-05-25', 'department_id' => 5, 'position_id' => 16, 'current_salary' => 70000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Monira Begum', 'email' => 'monira.begum@company.com', 'employee_id' => 'EMP027', 'phone' => '01736789012', 'joining_date' => '2023-07-08', 'department_id' => 6, 'position_id' => 19, 'current_salary' => 65000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Delwar Hossain', 'email' => 'delwar.hossain@company.com', 'employee_id' => 'EMP028', 'phone' => '01737890123', 'joining_date' => '2023-08-20', 'department_id' => 7, 'position_id' => 22, 'current_salary' => 80000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Farida Yasmin', 'email' => 'farida.yasmin@company.com', 'employee_id' => 'EMP029', 'phone' => '01738901234', 'joining_date' => '2023-10-05', 'department_id' => 3, 'position_id' => 9, 'current_salary' => 45000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Mosharraf Hossain', 'email' => 'mosharraf.hossain@company.com', 'employee_id' => 'EMP030', 'phone' => '01739012345', 'joining_date' => '2023-11-18', 'department_id' => 4, 'position_id' => 13, 'current_salary' => 60000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Kamrun Nahar', 'email' => 'kamrun.nahar@company.com', 'employee_id' => 'EMP031', 'phone' => '01740123456', 'joining_date' => '2024-01-10', 'department_id' => 5, 'position_id' => 17, 'current_salary' => 45000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Nurul Islam', 'email' => 'nurul.islam@company.com', 'employee_id' => 'EMP032', 'phone' => '01741234567', 'joining_date' => '2024-02-22', 'department_id' => 6, 'position_id' => 20, 'current_salary' => 50000, 'role' => 'employee', 'status' => 'active'],
            ['name' => 'Rashida Sultana', 'email' => 'rashida.sultana@company.com', 'employee_id' => 'EMP033', 'phone' => '01742345678', 'joining_date' => '2024-03-15', 'department_id' => 7, 'position_id' => 23, 'current_salary' => 45000, 'role' => 'employee', 'status' => 'active'],

            // Inactive Employees (2)
            ['name' => 'Zakir Hossain', 'email' => 'zakir.hossain@company.com', 'employee_id' => 'EMP034', 'phone' => '01743456789', 'joining_date' => '2021-03-10', 'leaving_date' => '2023-09-15', 'department_id' => 3, 'position_id' => 8, 'current_salary' => 75000, 'role' => 'employee', 'status' => 'inactive'],
            ['name' => 'Yasmin Akter', 'email' => 'yasmin.akter@company.com', 'employee_id' => 'EMP035', 'phone' => '01744567890', 'joining_date' => '2020-11-05', 'leaving_date' => '2024-01-20', 'department_id' => 4, 'position_id' => 13, 'current_salary' => 60000, 'role' => 'employee', 'status' => 'inactive'],
        ];

        foreach ($employees as $employee) {
            $employee['password'] = Hash::make('password123');
            $employee['email_verified_at'] = now();
            $employee['date_of_birth'] = Carbon::parse($employee['joining_date'])->subYears(rand(25, 45))->format('Y-m-d');
            $employee['address'] = 'Dhaka, Bangladesh';
            $employee['nid_number'] = '123456789' . rand(10, 99);

            User::create($employee);
        }
    }
}
