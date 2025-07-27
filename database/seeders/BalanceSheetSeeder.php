<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BalanceSheet;
use App\Models\User;
use Carbon\Carbon;

class BalanceSheetSeeder extends Seeder
{
    public function run()
    {
        $employees = User::whereHas('roles', function($query) {
            $query->where('name', 'employee');
        })->get();

        foreach ($employees as $employee) {
            // Create balance sheets for the last 12 months
            for ($i = 0; $i < 12; $i++) {
                $date = Carbon::now()->subMonths($i);

                BalanceSheet::create([
                    'employee_id' => $employee->id,
                    'month' => $date->month,
                    'year' => $date->year,
                    'opening_balance' => rand(0, 10000),
                    'total_sales' => rand(5000, 50000),
                    'total_collections' => rand(4000, 45000),
                    'total_expenses' => rand(1000, 5000),
                    'closing_balance' => rand(0, 15000),
                    'notes' => 'Auto-generated balance sheet for ' . $date->format('F Y'),
                ]);
            }
        }
    }
}
