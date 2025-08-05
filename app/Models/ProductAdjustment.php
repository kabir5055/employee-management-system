<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductAdjustment extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_number',
        'product_id',
        'type',
        'quantity_adjusted',
        'old_quantity',
        'new_quantity',
        'reason',
        'notes',
        'user_id',
        'adjustment_date',
        'status',
        'approved_by',
        'approved_at'
    ];

    protected $casts = [
        'adjustment_date' => 'datetime',
        'approved_at' => 'datetime',
        'quantity_adjusted' => 'integer',
        'old_quantity' => 'integer',
        'new_quantity' => 'integer'
    ];

    // Relationships
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    // Accessors
    public function getFormattedQuantityAttribute()
    {
        $sign = $this->type === 'increase' ? '+' : '-';
        return $sign . $this->quantity_adjusted;
    }

    // Static methods
    public static function generateReferenceNumber()
    {
        $prefix = 'ADJ';
        $date = now()->format('Ymd');
        $lastRecord = self::whereDate('created_at', today())
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastRecord ? (int)substr($lastRecord->reference_number, -4) + 1 : 1;

        return $prefix . $date . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }
}
