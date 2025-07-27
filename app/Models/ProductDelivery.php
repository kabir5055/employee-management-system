<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductDelivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 'product_id', 'quantity', 'unit_price',
        'total_amount', 'commission_amount', 'delivery_date',
        'notes', 'status', 'payment_status'
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'delivery_date' => 'date',
    ];

    protected $attributes = [
        'status' => 'pending',
        'payment_status' => 'unpaid',
        'commission_amount' => 0,
    ];

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function collections()
    {
        return $this->hasMany(Collection::class, 'delivery_id');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }

    public function scopeUnpaid($query)
    {
        return $query->where('payment_status', 'unpaid');
    }

    public function scopeForPeriod($query, $startDate, $endDate)
    {
        return $query->whereBetween('delivery_date', [$startDate, $endDate]);
    }

    public function calculateCommission()
    {
        $commission = (float) $this->total_amount * ((float) $this->product->commission_rate / 100);
        $this->setAttribute('commission_amount', round($commission, 2));
        return $this->commission_amount;
    }

    public function markAsCompleted()
    {
        $this->status = 'completed';
        $this->calculateCommission();
        $this->save();

        // Update product stock
        $this->product->decrement('stock_quantity', $this->quantity);
    }

    public function markAsPaid()
    {
        $this->payment_status = 'paid';
        $this->save();
    }

    protected static function booted()
    {
        static::creating(function ($delivery) {
            if (!$delivery->unit_price) {
                $delivery->unit_price = $delivery->product->price;
            }
            $delivery->total_amount = $delivery->quantity * $delivery->unit_price;
            $delivery->calculateCommission();
        });
    }
}
