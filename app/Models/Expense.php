<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 'warehouse_id', 'category', 'amount',
        'expense_date', 'description', 'receipt_image', 'status'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expense_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    protected static function booted()
    {
        static::created(function ($expense) {
            // Deduct expense from employee's balance sheet
            $balanceSheet = BalanceSheet::firstOrCreate(
                ['employee_id' => $expense->employee_id],
                ['current_balance' => 0]
            );

            $balanceSheet->decrement('current_balance', $expense->amount);
        });

        static::deleted(function ($expense) {
            // Add back the expense amount to employee's balance sheet when expense is deleted
            $balanceSheet = BalanceSheet::where('employee_id', $expense->employee_id)->first();
            if ($balanceSheet) {
                $balanceSheet->increment('current_balance', $expense->amount);
            }
        });
    }
}
