<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'cost_price',
        'stock_quantity',
        'sku',
        'status',
        'commission_rate',
        'minimum_quantity',
        'maximum_quantity',
        'image_path'
    ];

    protected $attributes = [
        'stock_quantity' => 0,
        'minimum_quantity' => 10,
        'maximum_quantity' => 100,
        'commission_rate' => 0,
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'commission_rate' => 'decimal:2',
    ];

    public function deliveries()
    {
        return $this->hasMany(ProductDelivery::class);
    }

    public function stockAdjustments()
    {
        return $this->hasMany(StockAdjustment::class);
    }

    public function successfulDeliveries()
    {
        return $this->hasMany(ProductDelivery::class)->where('status', 'completed');
    }

    public function topEmployees()
    {
        return User::select('users.*')
            ->join('product_deliveries', 'users.id', '=', 'product_deliveries.employee_id')
            ->where('product_deliveries.product_id', $this->getKey())
            ->where('product_deliveries.status', 'completed')
            ->groupBy('users.id')
            ->orderByRaw('SUM(product_deliveries.total_amount) DESC')
            ->limit(5);
    }

    public function scopeLowStock($query)
    {
        return $query->whereColumn('stock_quantity', '<=', 'minimum_quantity');
    }

    public function scopeOutOfStock($query)
    {
        return $query->where('stock_quantity', 0);
    }

    public function getStockStatusAttribute()
    {
        $stock = $this->getAttribute('stock_quantity');
        $min = $this->getAttribute('minimum_quantity');
        $max = $this->getAttribute('maximum_quantity');

        if ($stock <= 0) {
            return 'out_of_stock';
        } elseif ($stock <= $min) {
            return 'low_stock';
        } elseif ($stock >= $max) {
            return 'overstock';
        }
        return 'normal';
    }

    public function getPerformanceMetricsAttribute()
    {
        $metrics = $this->successfulDeliveries()
            ->selectRaw('
                COUNT(*) as total_deliveries,
                SUM(quantity) as total_quantity,
                SUM(total_amount) as total_revenue,
                SUM(commission_amount) as total_commission,
                AVG(commission_amount) as avg_commission
            ')
            ->first();

        return [
            'total_deliveries' => $metrics->total_deliveries ?? 0,
            'total_quantity' => $metrics->total_quantity ?? 0,
            'total_revenue' => $metrics->total_revenue ?? 0,
            'total_commission' => $metrics->total_commission ?? 0,
            'avg_commission' => $metrics->avg_commission ?? 0,
        ];
    }
}
