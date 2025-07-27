<?php

namespace App\Traits;

trait Filterable
{
    public function scopeFilter($query, $filter)
    {
        return $filter->apply($query);
    }
}
