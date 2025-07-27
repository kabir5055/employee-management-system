<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'app_name',
                'value' => 'Employee Management System',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Application Name',
                'is_public' => true,
            ],
            [
                'key' => 'company_name',
                'value' => 'Your Company Name',
                'type' => 'text',
                'group' => 'company',
                'label' => 'Company Name',
                'is_public' => true,
            ],
            [
                'key' => 'company_address',
                'value' => 'Your Company Address',
                'type' => 'textarea',
                'group' => 'company',
                'label' => 'Company Address',
                'is_public' => true,
            ],
            [
                'key' => 'company_email',
                'value' => 'company@example.com',
                'type' => 'email',
                'group' => 'company',
                'label' => 'Company Email',
                'is_public' => true,
            ],
            [
                'key' => 'company_phone',
                'value' => '+880-XX-XXXXXXX',
                'type' => 'text',
                'group' => 'company',
                'label' => 'Company Phone',
                'is_public' => true,
            ],
            [
                'key' => 'company_logo',
                'value' => null,
                'type' => 'file',
                'group' => 'company',
                'label' => 'Company Logo',
                'is_public' => true,
            ],
            [
                'key' => 'currency_symbol',
                'value' => '৳',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Currency Symbol',
                'is_public' => true,
            ],
            [
                'key' => 'date_format',
                'value' => 'Y-m-d',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Date Format',
                'is_public' => true,
            ],
            [
                'key' => 'time_format',
                'value' => 'H:i',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Time Format',
                'is_public' => true,
            ],
            [
                'key' => 'timezone',
                'value' => 'Asia/Dhaka',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Timezone',
                'is_public' => true,
            ],
        ];

        foreach ($settings as $setting) {
            DB::table('settings')->insert($setting);
        }
    }
}
