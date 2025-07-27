<?php

namespace App\Exports;

use App\Exports\BaseExport;

class EmployeeExport extends BaseExport
{
    public function headings(): array
    {
        return [
            'Employee ID',
            'Name',
            'Email',
            'Phone',
            'Position',
            'Department',
            'District',
            'Upazila',
            'Thana',
            'Joining Date',
            'Current Salary',
            'Status'
        ];
    }

    public function map($employee): array
    {
        return [
            $employee->employee_code,
            $employee->name,
            $employee->email,
            $employee->phone,
            $employee->position->name ?? 'N/A',
            $employee->department->name ?? 'N/A',
            $employee->district->name ?? 'N/A',
            $employee->upazila->name ?? 'N/A',
            $employee->thana->name ?? 'N/A',
            $employee->joining_date?->format('Y-m-d') ?? 'N/A',
            number_format($employee->current_salary, 2),
            $employee->status
        ];
    }
}
