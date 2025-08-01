<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Traits\Filterable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, Filterable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name', 'email', 'password', 'employee_id', 'phone', 'address',
        'date_of_birth', 'joining_date', 'leaving_date', 'department_id',
        'position_id', 'status', 'nid_number', 'current_salary',
        'profile_photo_path', 'district_id', 'upazila_id', 'thana_id',
        'designation', 'employee_code', 'is_super_admin', 'image_path',
        'nid', 'employment_status'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'date_of_birth' => 'date',
        'joining_date' => 'date',
        'leaving_date' => 'date',
        'current_salary' => 'decimal:2',
        'is_super_admin' => 'boolean',
    ];

    // Relationships
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function upazila()
    {
        return $this->belongsTo(Upazila::class);
    }

    public function thana()
    {
        return $this->belongsTo(Thana::class);
    }

    public function promotionHistories()
    {
        return $this->hasMany(EmployeePromotionHistory::class);
    }

    public function promotions()
    {
        return $this->hasMany(EmployeePromotionHistory::class, 'user_id');
    }

    public function promotionsApproved()
    {
        return $this->hasMany(EmployeePromotionHistory::class, 'approved_by');
    }

    public function getProfilePhotoUrlAttribute()
    {
        if ($this->profile_photo_path) {
            return url('storage/' . $this->profile_photo_path);
        }

        $name = urlencode($this->name);
        return "https://ui-avatars.com/api/?name={$name}&color=7F9CF5&background=EBF4FF";
    }

    public function salaryStructures()
    {
        return $this->hasMany(SalaryStructure::class, 'employee_id');
    }

    public function attendance()
    {
        return $this->hasMany(Attendance::class, 'employee_id');
    }

    public function salaryPayments()
    {
        return $this->hasMany(SalaryPayment::class, 'employee_id');
    }

    public function productDeliveries()
    {
        return $this->hasMany(ProductDelivery::class, 'employee_id');
    }

    public function deliveries()
    {
        return $this->hasMany(ProductDelivery::class, 'employee_id');
    }

    public function collections()
    {
        return $this->hasMany(Collection::class, 'employee_id');
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class, 'employee_id');
    }

    public function balanceSheets()
    {
        return $this->hasMany(BalanceSheet::class, 'employee_id');
    }

    public function employeeStocks()
    {
        return $this->hasMany(EmployeeStock::class, 'employee_id');
    }

    public function employeeHistory()
    {
        return $this->hasMany(EmployeeHistory::class, 'employee_id');
    }
}
