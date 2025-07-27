<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Expense;
use Illuminate\Auth\Access\HandlesAuthorization;

class ExpensePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true; // Everyone can see the list, but it will be filtered in the controller
    }

    public function view(User $user, Expense $expense): bool
    {
        return $user->hasRole('super-admin') || $expense->employee_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true; // All authenticated users can create expenses
    }

    public function update(User $user, Expense $expense): bool
    {
        return $user->hasRole('super-admin') || $expense->employee_id === $user->id;
    }

    public function delete(User $user, Expense $expense): bool
    {
        return $user->hasRole('super-admin') || $expense->employee_id === $user->id;
    }
}
