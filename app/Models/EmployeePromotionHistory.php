<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeePromotionHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'previous_position_id',
        'previous_department_id',
        'previous_salary',
        'new_position_id',
        'new_department_id',
        'new_salary',
        'promotion_type',
        'effective_date',
        'reason',
        'notes',
        'approved_by',
        'approved_at'
    ];

    protected $casts = [
        'effective_date' => 'date',
        'approved_at' => 'datetime',
        'previous_salary' => 'decimal:2',
        'new_salary' => 'decimal:2'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function previousPosition()
    {
        return $this->belongsTo(Position::class, 'previous_position_id');
    }

    public function newPosition()
    {
        return $this->belongsTo(Position::class, 'new_position_id');
    }

    public function previousDepartment()
    {
        return $this->belongsTo(Department::class, 'previous_department_id');
    }

    public function newDepartment()
    {
        return $this->belongsTo(Department::class, 'new_department_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // Scopes
    public function scopePromotions($query)
    {
        return $query->where('promotion_type', 'promotion');
    }

    public function scopeDemotions($query)
    {
        return $query->where('promotion_type', 'demotion');
    }

    public function scopeTransfers($query)
    {
        return $query->where('promotion_type', 'transfer');
    }

    public function scopeSalaryChanges($query)
    {
        return $query->where('promotion_type', 'salary_change');
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeEffectiveAfter($query, $date)
    {
        return $query->where('effective_date', '>=', $date);
    }

    // Helper methods
    public function getSalaryChange()
    {
        if ($this->previous_salary && $this->new_salary) {
            return (float)$this->new_salary - (float)$this->previous_salary;
        }
        return 0;
    }

    public function getSalaryChangePercentage()
    {
        if ($this->previous_salary && $this->new_salary && $this->previous_salary > 0) {
            return (((float)$this->new_salary - (float)$this->previous_salary) / (float)$this->previous_salary) * 100;
        }
        return 0;
    }

    public function getPromotionTypeLabel()
    {
        return match($this->promotion_type) {
            'promotion' => 'Promotion',
            'demotion' => 'Demotion',
            'transfer' => 'Transfer',
            'salary_change' => 'Salary Change',
            default => 'Unknown'
        };
    }
}
