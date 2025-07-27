<?php

namespace App\Imports;

use App\Models\User;
use App\Models\Department;
use App\Models\Position;
use App\Models\District;
use App\Models\Upazila;
use App\Models\Thana;
use Illuminate\Support\Facades\Hash;

class EmployeeImport extends BaseImport
{
    public function model(array $row)
    {
        $this->successes++;

        $department = Department::firstOrCreate(['name' => $row['department']]);
        $position = Position::firstOrCreate(['name' => $row['position']]);

        // Handle location hierarchy
        $district = District::firstOrCreate(['name' => $row['district']]);
        $upazila = Upazila::firstOrCreate([
            'name' => $row['upazila'],
            'district_id' => $district->id
        ]);
        $thana = Thana::firstOrCreate([
            'name' => $row['thana'],
            'upazila_id' => $upazila->id
        ]);

        return new User([
            'name' => $row['name'],
            'email' => $row['email'],
            'password' => Hash::make($row['password'] ?? 'password123'),
            'phone' => $row['phone'],
            'address' => $row['address'],
            'employee_code' => $row['employee_code'],
            'department_id' => $department->id,
            'position_id' => $position->id,
            'district_id' => $district->id,
            'upazila_id' => $upazila->id,
            'thana_id' => $thana->id,
            'joining_date' => $row['joining_date'],
            'current_salary' => $row['current_salary'],
            'status' => $row['status'] ?? 'active'
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'employee_code' => 'required|string|max:50|unique:users,employee_code',
            'department' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'upazila' => 'required|string|max:255',
            'thana' => 'required|string|max:255',
            'joining_date' => 'required|date',
            'current_salary' => 'required|numeric|min:0',
            'status' => 'nullable|in:active,inactive'
        ];
    }
}
