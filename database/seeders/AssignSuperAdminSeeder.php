<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AssignSuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        if ($user) {
            $user->assignRole('super-admin');
            echo "Super admin role assigned to: " . $user->name . "\n";
        }
    }
}
