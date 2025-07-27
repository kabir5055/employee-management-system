<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class EmployeeStock extends Model
{
    protected $fillable = [
        'employee_id',
        'product_id',
        'quantity',
        'minimum_quantity',
        'maximum_quantity',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'minimum_quantity' => 'integer',
        'maximum_quantity' => 'integer',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function stockHistories(): MorphMany
    {
        return $this->morphMany(StockHistory::class, 'stockable');
    }

    public function getStockStatusAttribute(): string
    {
        if ($this->quantity <= 0) {
            return 'out_of_stock';
        } elseif ($this->quantity <= $this->minimum_quantity) {
            return 'low_stock';
        } elseif ($this->quantity >= $this->maximum_quantity) {
            return 'overstock';
        }
        return 'in_stock';
    }
}
