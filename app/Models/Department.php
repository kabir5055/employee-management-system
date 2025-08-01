<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'head_of_department',
        'budget',
        'location',
        'email',
        'phone',
        'is_active'
    ];

    protected $casts = [
        'budget' => 'decimal:2',
        'is_active' => 'boolean'
    ];

    // Relationships
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function promotionHistoriesAsNew()
    {
        return $this->hasMany(EmployeePromotionHistory::class, 'new_department_id');
    }

    public function promotionHistoriesAsPrevious()
    {
        return $this->hasMany(EmployeePromotionHistory::class, 'previous_department_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Helper methods
    public function getUsersCount()
    {
        return $this->users()->count();
    }

    public function getFormattedBudget()
    {
        return $this->budget ? number_format((float)$this->budget, 2) : 'Not set';
    }
}
