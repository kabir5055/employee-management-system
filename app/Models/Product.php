<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category_id',
        'unit_id',
        'description',
        'cost_price',
        'tp_price',
        'mrp_price',
        'sku',
        'status',
        'commission_rate',
        'minimum_quantity',
        'maximum_quantity',
        'images',
        'primary_image'
    ];

    protected $casts = [
        'images' => 'array',
        'cost_price' => 'decimal:2',
        'tp_price' => 'decimal:2',
        'mrp_price' => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'minimum_quantity' => 'integer',
        'maximum_quantity' => 'integer'
    ];

    protected $attributes = [
        'minimum_quantity' => 10,
        'maximum_quantity' => 100,
        'commission_rate' => 0,
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }

    public function unit()
    {
        return $this->belongsTo(ProductUnit::class, 'unit_id');
    }

    public function deliveries()
    {
        return $this->hasMany(ProductDelivery::class);
    }

    public function stockAdjustments()
    {
        return $this->hasMany(StockAdjustment::class);
    }

    public function adjustments()
    {
        return $this->hasMany(ProductAdjustment::class);
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

    // Image handling methods
    public function getPrimaryImageUrlAttribute()
    {
        if ($this->primary_image) {
            return asset('storage/' . $this->primary_image);
        }
        return $this->getFirstImageUrl();
    }

    public function getFirstImageUrl()
    {
        if ($this->images && is_array($this->images) && count($this->images) > 0) {
            return asset('storage/' . $this->images[0]);
        }
        return asset('images/no-image.svg'); // Default placeholder
    }

    public function getAllImageUrls()
    {
        if (!$this->images || !is_array($this->images)) {
            return [asset('images/no-image.svg')];
        }

        return array_map(function($image) {
            return asset('storage/' . $image);
        }, $this->images);
    }

    public function hasImages()
    {
        return $this->images && is_array($this->images) && count($this->images) > 0;
    }

    public function getImageCount()
    {
        return $this->images ? count($this->images) : 0;
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
