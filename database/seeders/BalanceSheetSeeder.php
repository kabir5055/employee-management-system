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
        $employees = User::where('is_super_admin', false)->get();

        foreach ($employees as $employee) {
            // Create a balance sheet record for each employee
            $openingBalance = rand(0, 10000);
            $currentBalance = $openingBalance + rand(-5000, 15000);

            BalanceSheet::create([
                'employee_id' => $employee->id,
                'opening_balance' => $openingBalance,
                'current_balance' => $currentBalance,
            ]);
        }

        $this->command->info('Balance sheets created successfully!');
    }
}
