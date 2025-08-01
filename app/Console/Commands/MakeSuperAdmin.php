<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class MakeSuperAdmin extends Command
{
    protected $signature = 'user:make-super-admin {email}';
    protected $description = 'Make a user super admin by email';

    public function handle()
    {
        $email = $this->argument('email');

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email {$email} not found!");
            return 1;
        }

        $user->update(['is_super_admin' => true]);

        $this->info("User {$user->name} ({$email}) is now a super admin!");
        return 0;
    }
}
