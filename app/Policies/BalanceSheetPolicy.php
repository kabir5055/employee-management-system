<?php

namespace App\Policies;

use App\Models\BalanceSheet;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BalanceSheetPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, BalanceSheet $balanceSheet): bool
    {
        return $user->hasRole(['admin', 'manager']) || $balanceSheet->employee_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole(['admin', 'manager']);
    }

    public function update(User $user, BalanceSheet $balanceSheet): bool
    {
        return $user->hasRole(['admin', 'manager']) ||
               ($balanceSheet->employee_id === $user->id && $user->hasPermissionTo('update balance sheets'));
    }

    public function delete(User $user, BalanceSheet $balanceSheet): bool
    {
        return $user->hasRole(['admin', 'manager']);
    }

    public function exportBalanceSheets(User $user): bool
    {
        return $user->hasPermissionTo('export balance sheets');
    }

    public function importBalanceSheets(User $user): bool
    {
        return $user->hasPermissionTo('import balance sheets');
    }
}
