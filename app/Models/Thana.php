<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Thana extends Model
{
    protected $fillable = ['name', 'upazila_id'];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $with = ['upazila.district'];

    public function upazila(): BelongsTo
    {
        return $this->belongsTo(Upazila::class);
    }

    public function district()
    {
        return $this->hasOneThrough(District::class, Upazila::class, 'id', 'id', 'upazila_id', 'district_id');
    }

    public function employees(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
