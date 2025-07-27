<?php

namespace App\Policies;

use App\Models\StockTransfer;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class StockTransferPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, StockTransfer $transfer): bool
    {
        return $user->hasRole(['admin', 'manager']) ||
               $user->id === $transfer->to_employee_id ||
               $user->id === $transfer->created_by;
    }

    public function create(User $user): bool
    {
        return $user->hasRole(['admin', 'manager']);
    }

    public function approve(User $user, StockTransfer $transfer): bool
    {
        return $user->hasRole(['admin', 'manager']) &&
               $user->id !== $transfer->to_employee_id &&
               $transfer->isPending();
    }

    public function cancel(User $user, StockTransfer $transfer): bool
    {
        return ($user->hasRole(['admin', 'manager']) || $user->id === $transfer->created_by) &&
               $transfer->isPending();
    }
}
