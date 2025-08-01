<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BalanceSheet extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'date',
        'location',
        'opening_balance',
        'current_balance',
        'product_delivery_amount',
        'expense_amount',
        'total_amount',
        'market_cost',
        'ta_da',
        'notes',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'date' => 'date',
        'opening_balance' => 'decimal:2',
        'current_balance' => 'decimal:2',
        'product_delivery_amount' => 'decimal:2',
        'expense_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'market_cost' => 'decimal:2',
        'ta_da' => 'decimal:2'
    ];

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function productDeliveries()
    {
        return $this->hasMany(ProductDelivery::class, 'employee_id', 'employee_id');
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class, 'employee_id', 'employee_id');
    }

    public function updatedByUser()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function createdByUser()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getTotalAmount()
    {
        return $this->product_delivery_amount +
               $this->expense_amount +
               $this->market_cost +
               $this->ta_da;
    }
}
