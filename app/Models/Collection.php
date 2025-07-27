<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id', 'delivery_id', 'warehouse_id', 'amount_collected',
        'collection_date', 'notes', 'payment_method'
    ];

    protected $casts = [
        'amount_collected' => 'decimal:2',
        'collection_date' => 'date',
    ];

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function delivery()
    {
        return $this->belongsTo(ProductDelivery::class, 'delivery_id');
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }
}
