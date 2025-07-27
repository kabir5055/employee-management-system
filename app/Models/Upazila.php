<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Upazila extends Model
{
    protected $fillable = ['name', 'district_id'];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $with = ['district'];

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    public function thanas(): HasMany
    {
        return $this->hasMany(Thana::class);
    }

    public function employees(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
