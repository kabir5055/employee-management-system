<?php

namespace App\Http\Controllers\Traits;

use Illuminate\Support\Facades\Auth;

trait HasPermissionCheck
{
    /**
     * Check if the authenticated user has any of the specified roles
     */
    protected function userHasRole($roles)
    {
        $user = Auth::user();

        if (!$user) {
            return false;
        }

        // Convert single role to array
        $roles = is_array($roles) ? $roles : [$roles];

        try {
            // Check if user has any of the specified roles
            foreach ($roles as $role) {
                if ($user->hasRole($role)) {
                    return true;
                }
            }
            return false;
        } catch (\Exception $e) {
            // If there's a database error, allow super-admin by checking if user ID is 1
            return $user->id === 1;
        }
    }

    /**
     * Check if the authenticated user has a specific permission
     */
    protected function userHasPermission($permission)
    {
        $user = Auth::user();

        if (!$user) {
            return false;
        }

        try {
            return $user->hasPermissionTo($permission) || $user->hasRole('super-admin');
        } catch (\Exception $e) {
            // If there's a database error, allow super-admin by checking if user ID is 1
            return $user->id === 1;
        }
    }

    /**
     * Check if the authenticated user can perform an action
     */
    protected function userCan($permission)
    {
        return $this->userHasPermission($permission);
    }

    /**
     * Abort if user doesn't have permission
     */
    protected function checkPermission($permission, $message = 'Unauthorized action')
    {
        if (!$this->userHasPermission($permission)) {
            abort(403, $message);
        }
    }

    /**
     * Abort if user doesn't have role
     */
    protected function checkRole($roles, $message = 'Unauthorized action')
    {
        if (!$this->userHasRole($roles)) {
            abort(403, $message);
        }
    }
}
