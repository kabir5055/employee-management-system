<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Auth\Access\HandlesAuthorization;

class WarehousePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true; // Everyone can see the list, but it will be filtered in the controller
    }

    public function view(User $user, Warehouse $warehouse): bool
    {
        return $user->hasRole('super-admin') || $warehouse->employee_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole(['super-admin', 'admin']);
    }

    public function update(User $user, Warehouse $warehouse): bool
    {
        return $user->hasRole('super-admin') || $warehouse->employee_id === $user->id;
    }

    public function delete(User $user, Warehouse $warehouse): bool
    {
        return $user->hasRole('super-admin');
    }

    public function updateInventory(User $user, Warehouse $warehouse): bool
    {
        return $user->hasRole('super-admin') || $warehouse->employee_id === $user->id;
    }
}
