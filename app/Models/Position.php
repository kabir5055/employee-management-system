<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'min_salary',
        'max_salary',
        'level',
        'requirements',
        'is_active'
    ];

    protected $casts = [
        'requirements' => 'array',
        'min_salary' => 'decimal:2',
        'max_salary' => 'decimal:2',
        'is_active' => 'boolean'
    ];

    // Relationships
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function promotionHistoriesAsNew()
    {
        return $this->hasMany(EmployeePromotionHistory::class, 'new_position_id');
    }

    public function promotionHistoriesAsPrevious()
    {
        return $this->hasMany(EmployeePromotionHistory::class, 'previous_position_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByLevel($query, $level)
    {
        return $query->where('level', $level);
    }

    // Helper methods
    public function getUsersCount()
    {
        return $this->users()->count();
    }

    public function getSalaryRange()
    {
        if ($this->min_salary && $this->max_salary) {
            return number_format($this->min_salary, 2) . ' - ' . number_format($this->max_salary, 2);
        }
        return 'Not defined';
    }
}
