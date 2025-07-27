<?php

namespace App\Filters;

class EmployeeFilter extends QueryFilter
{
    public function search($query = '')
    {
        return $this->builder
            ->where(function($builder) use ($query) {
                $builder->where('name', 'LIKE', "%{$query}%")
                    ->orWhere('email', 'LIKE', "%{$query}%")
                    ->orWhere('employee_code', 'LIKE', "%{$query}%")
                    ->orWhere('phone', 'LIKE', "%{$query}%");
            });
    }

    public function district($id)
    {
        return $this->builder->where('district_id', $id);
    }

    public function upazila($id)
    {
        return $this->builder->where('upazila_id', $id);
    }

    public function thana($id)
    {
        return $this->builder->where('thana_id', $id);
    }

    public function designation($value)
    {
        return $this->builder->where('designation', $value);
    }

    public function department($id)
    {
        return $this->builder->where('department_id', $id);
    }

    public function position($id)
    {
        return $this->builder->where('position_id', $id);
    }

    public function status($value)
    {
        return $this->builder->where('status', $value);
    }

    public function dateFrom($date)
    {
        return $this->builder->whereDate('joining_date', '>=', $date);
    }

    public function dateTo($date)
    {
        return $this->builder->whereDate('joining_date', '<=', $date);
    }
}
