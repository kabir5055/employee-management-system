<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Payroll;
use App\Models\Attendance;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PayrollSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $employees = Employee::active()->get();
        $currentMonth = Carbon::now()->format('Y-m');
        
        foreach ($employees as $employee) {
            // Get attendance data for the month
            $attendances = Attendance::where('employee_id', $employee->id)
                ->whereYear('date', Carbon::now()->year)
                ->whereMonth('date', Carbon::now()->month)
                ->get();
            
            $workingDays = $attendances->count();
            $presentDays = $attendances->where('status', '!=', 'absent')->count();
            $absentDays = $attendances->where('status', 'absent')->count();
            $totalOvertimeHours = $attendances->sum('overtime_hours');
            
            // Calculate salary components
            $basicSalary = $employee->basic_salary;
            $houseRent = $employee->house_rent;
            $medicalAllowance = $employee->medical_allowance;
            $transportAllowance = $employee->transport_allowance;
            $otherAllowances = $employee->other_allowances;
            
            // Overtime calculation (500 BDT per hour)
            $overtimeAmount = $totalOvertimeHours * 500;
            
            // Bonus (random between 0-5000 for some employees)
            $bonus = rand(0, 100) <= 30 ? rand(0, 5000) : 0;
            
            $grossSalary = $basicSalary + $houseRent + $medicalAllowance + 
                          $transportAllowance + $otherAllowances + $overtimeAmount + $bonus;
            
            // Tax calculation (5% for salaries above 50,000)
            $taxDeduction = $grossSalary > 50000 ? $grossSalary * 0.05 : 0;
            
            // Provident Fund (8% of basic salary)
            $providentFund = $basicSalary * 0.08;
            
            // Other deductions (random)
            $otherDeductions = rand(0, 2000);
            
            $totalDeductions = $taxDeduction + $providentFund + $otherDeductions;
            $netSalary = $grossSalary - $totalDeductions;
            
            // Payment status (90% paid, 10% pending)
            $paymentStatus = rand(1, 100) <= 90 ? 'paid' : 'pending';
            $paymentDate = $paymentStatus === 'paid' ? 
                Carbon::now()->subDays(rand(1, 5)) : null;
            
            Payroll::create([
                'employee_id' => $employee->id,
                'month' => $currentMonth,
                'basic_salary' => $basicSalary,
                'house_rent' => $houseRent,
                'medical_allowance' => $medicalAllowance,
                'transport_allowance' => $transportAllowance,
                'other_allowances' => $otherAllowances,
                'overtime_amount' => $overtimeAmount,
                'bonus' => $bonus,
                'gross_salary' => $grossSalary,
                'tax_deduction' => $taxDeduction,
                'provident_fund' => $providentFund,
                'other_deductions' => $otherDeductions,
                'total_deductions' => $totalDeductions,
                'net_salary' => $netSalary,
                'working_days' => $workingDays,
                'present_days' => $presentDays,
                'absent_days' => $absentDays,
                'overtime_hours' => $totalOvertimeHours,
                'payment_status' => $paymentStatus,
                'payment_date' => $paymentDate,
                'remarks' => $paymentStatus === 'paid' ? 'Salary paid successfully' : 'Payment pending',
            ]);
        }
    }
}