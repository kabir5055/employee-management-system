<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SalaryPayment;
use App\Models\User;
use Carbon\Carbon;

class SalaryPaymentSeeder extends Seeder
{
    public function run()
    {
        $employees = User::where('status', 'active')->get();
        $currentDate = Carbon::now();

        // Generate salary payments for last 6 months
        for ($monthsBack = 0; $monthsBack < 6; $monthsBack++) {
            $paymentDate = $currentDate->copy()->subMonths($monthsBack);
            $month = $paymentDate->month;
            $year = $paymentDate->year;

            foreach ($employees as $employee) {
                // Skip if employee joined after this month
                if (Carbon::parse((string)$employee->joining_date)->isAfter($paymentDate->endOfMonth())) {
                    continue;
                }

                $basicSalary = $employee->current_salary * 0.6;
                $allowances = $employee->current_salary * 0.35;
                $overtimeAmount = rand(0, 15000);
                $bonus = $monthsBack === 0 ? rand(0, 20000) : 0; // Bonus only for current month sometimes

                $grossSalary = $basicSalary + $allowances + $overtimeAmount + $bonus;
                $taxDeduction = $grossSalary > 25000 ? $grossSalary * 0.05 : 0;
                $otherDeductions = rand(0, 2000);
                $netSalary = $grossSalary - $taxDeduction - $otherDeductions;

                SalaryPayment::create([
                    'employee_id' => $employee->id,
                    'month' => $month,
                    'year' => $year,
                    'basic_salary' => $basicSalary,
                    'allowances' => $allowances,
                    'overtime_amount' => $overtimeAmount,
                    'bonus' => $bonus,
                    'gross_salary' => $grossSalary,
                    'tax_deduction' => $taxDeduction,
                    'other_deductions' => $otherDeductions,
                    'net_salary' => $netSalary,
                    'payment_date' => $monthsBack === 0 ? null : $paymentDate->copy()->addDays(rand(25, 30)),
                    'status' => $monthsBack === 0 ? 'pending' : 'paid',
                ]);
            }
        }
    }
}
