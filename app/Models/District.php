<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class District extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name'];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function upazilas(): HasMany
    {
        return $this->hasMany(Upazila::class);
    }

    public function employees(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function thanas(): HasManyThrough
    {
        return $this->hasManyThrough(Thana::class, Upazila::class);
    }
}
