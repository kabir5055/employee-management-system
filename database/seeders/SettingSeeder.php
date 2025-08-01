<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // General Settings
            [
                'key' => 'app_name',
                'value' => 'Employee Management System',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Application Name',
                'is_public' => true
            ],
            [
                'key' => 'app_description',
                'value' => 'Comprehensive employee management and payroll system',
                'type' => 'textarea',
                'group' => 'general',
                'label' => 'Application Description',
                'is_public' => true
            ],
            [
                'key' => 'app_logo',
                'value' => null,
                'type' => 'file',
                'group' => 'general',
                'label' => 'Application Logo',
                'is_public' => true
            ],
            [
                'key' => 'app_favicon',
                'value' => null,
                'type' => 'file',
                'group' => 'general',
                'label' => 'Favicon',
                'is_public' => true
            ],
            [
                'key' => 'app_timezone',
                'value' => 'UTC',
                'type' => 'select',
                'group' => 'general',
                'label' => 'Default Timezone',
                'is_public' => false,
                'options' => json_encode([
                    ['value' => 'UTC', 'label' => 'UTC'],
                    ['value' => 'Asia/Dhaka', 'label' => 'Asia/Dhaka'],
                    ['value' => 'America/New_York', 'label' => 'America/New_York'],
                    ['value' => 'Europe/London', 'label' => 'Europe/London'],
                ])
            ],
            [
                'key' => 'date_format',
                'value' => 'Y-m-d',
                'type' => 'select',
                'group' => 'general',
                'label' => 'Date Format',
                'is_public' => true,
                'options' => json_encode([
                    ['value' => 'Y-m-d', 'label' => 'YYYY-MM-DD'],
                    ['value' => 'd/m/Y', 'label' => 'DD/MM/YYYY'],
                    ['value' => 'm/d/Y', 'label' => 'MM/DD/YYYY'],
                    ['value' => 'd-m-Y', 'label' => 'DD-MM-YYYY'],
                ])
            ],

            // Company Settings
            [
                'key' => 'company_name',
                'value' => 'Your Company Name',
                'type' => 'text',
                'group' => 'company',
                'label' => 'Company Name',
                'is_public' => true
            ],
            [
                'key' => 'company_address',
                'value' => '',
                'type' => 'textarea',
                'group' => 'company',
                'label' => 'Company Address',
                'is_public' => true
            ],
            [
                'key' => 'company_phone',
                'value' => '',
                'type' => 'text',
                'group' => 'company',
                'label' => 'Company Phone',
                'is_public' => true
            ],
            [
                'key' => 'company_email',
                'value' => '',
                'type' => 'email',
                'group' => 'company',
                'label' => 'Company Email',
                'is_public' => true
            ],
            [
                'key' => 'company_website',
                'value' => '',
                'type' => 'url',
                'group' => 'company',
                'label' => 'Company Website',
                'is_public' => true
            ],
            [
                'key' => 'company_logo',
                'value' => null,
                'type' => 'file',
                'group' => 'company',
                'label' => 'Company Logo',
                'is_public' => true
            ],

            // Mail Settings
            [
                'key' => 'mail_driver',
                'value' => 'smtp',
                'type' => 'select',
                'group' => 'mail',
                'label' => 'Mail Driver',
                'is_public' => false,
                'options' => json_encode([
                    ['value' => 'smtp', 'label' => 'SMTP'],
                    ['value' => 'mail', 'label' => 'PHP Mail'],
                    ['value' => 'sendmail', 'label' => 'Sendmail'],
                ])
            ],
            [
                'key' => 'mail_host',
                'value' => 'smtp.gmail.com',
                'type' => 'text',
                'group' => 'mail',
                'label' => 'Mail Host',
                'is_public' => false
            ],
            [
                'key' => 'mail_port',
                'value' => '587',
                'type' => 'number',
                'group' => 'mail',
                'label' => 'Mail Port',
                'is_public' => false
            ],
            [
                'key' => 'mail_username',
                'value' => '',
                'type' => 'text',
                'group' => 'mail',
                'label' => 'Mail Username',
                'is_public' => false
            ],
            [
                'key' => 'mail_from_address',
                'value' => 'noreply@company.com',
                'type' => 'email',
                'group' => 'mail',
                'label' => 'From Address',
                'is_public' => false
            ],
            [
                'key' => 'mail_from_name',
                'value' => 'Employee Management System',
                'type' => 'text',
                'group' => 'mail',
                'label' => 'From Name',
                'is_public' => false
            ],

            // System Settings
            [
                'key' => 'records_per_page',
                'value' => '15',
                'type' => 'number',
                'group' => 'system',
                'label' => 'Records Per Page',
                'is_public' => false
            ],
            [
                'key' => 'backup_enabled',
                'value' => '0',
                'type' => 'boolean',
                'group' => 'system',
                'label' => 'Database Backup',
                'is_public' => false
            ],
            [
                'key' => 'maintenance_mode',
                'value' => '0',
                'type' => 'boolean',
                'group' => 'system',
                'label' => 'Maintenance Mode',
                'is_public' => false
            ],
            [
                'key' => 'cache_enabled',
                'value' => '1',
                'type' => 'boolean',
                'group' => 'system',
                'label' => 'Enable Caching',
                'is_public' => false
            ],
            [
                'key' => 'debug_mode',
                'value' => '0',
                'type' => 'boolean',
                'group' => 'system',
                'label' => 'Debug Mode',
                'is_public' => false
            ]
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
