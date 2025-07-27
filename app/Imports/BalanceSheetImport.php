<?php

namespace App\Imports;

use App\Models\BalanceSheet;
use App\Models\User;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Illuminate\Support\Facades\Auth;

class BalanceSheetImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure
{
    use SkipsFailures;

    public function model(array $row)
    {
        $employee = User::where('name', $row['employee'])->first();

        if (!$employee) {
            throw new \Exception("Employee not found: {$row['employee']}");
        }

        return new BalanceSheet([
            'employee_id' => $employee->id,
            'date' => $row['date'],
            'location' => $row['location'],
            'product_delivery_amount' => $row['product_delivery_amount'],
            'expense_amount' => $row['expense_amount'],
            'market_cost' => $row['market_cost'],
            'ta_da' => $row['ta_da'],
            'notes' => $row['notes'] ?? null,
            'current_balance' => $row['current_balance'],
            'opening_balance' => $row['opening_balance'],
            'updated_by' => Auth::id()
        ]);
    }

    public function rules(): array
    {
        return [
            'employee' => 'required|string',
            'date' => 'required|date',
            'location' => 'nullable|string',
            'product_delivery_amount' => 'required|numeric|min:0',
            'expense_amount' => 'required|numeric|min:0',
            'market_cost' => 'required|numeric|min:0',
            'ta_da' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'current_balance' => 'required|numeric',
            'opening_balance' => 'required|numeric'
        ];
    }
}
