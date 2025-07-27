<?php

namespace App\Policies;

use App\Models\EmployeeStock;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EmployeeStockPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, int $employeeId): bool
    {
        return $user->hasRole(['admin', 'manager']) || $user->id === $employeeId;
    }

    public function create(User $user): bool
    {
        return $user->hasRole(['admin', 'manager']);
    }

    public function update(User $user, EmployeeStock $stock): bool
    {
        return $user->hasRole(['admin', 'manager']) ||
               ($user->id === $stock->employee_id && $user->hasPermissionTo('manage own stock'));
    }

    public function delete(User $user, EmployeeStock $stock): bool
    {
        return $user->hasRole(['admin', 'manager']);
    }

    public function manageEmployeeStocks(User $user): bool
    {
        return $user->hasRole(['admin', 'manager']);
    }
}
