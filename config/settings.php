<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Settings
    |--------------------------------------------------------------------------
    |
    | Default settings that will be used if not set in the database
    |
    */

    'defaults' => [
        'company_name' => env('APP_NAME', 'Employee Management System'),
        'company_email' => env('MAIL_FROM_ADDRESS', 'admin@example.com'),
        'company_phone' => '',
        'company_address' => '',
        'company_logo' => null,
        'timezone' => env('APP_TIMEZONE', 'UTC'),
        'locale' => env('APP_LOCALE', 'en'),
        'date_format' => 'Y-m-d',
        'time_format' => 'H:i',
        'currency' => 'USD',
        'currency_symbol' => '$',
        'currency_position' => 'before', // before or after
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache Settings
    |--------------------------------------------------------------------------
    |
    | Settings cache configuration
    |
    */

    'cache' => [
        'enabled' => env('SETTINGS_CACHE_ENABLED', true),
        'key' => 'settings.cache',
        'ttl' => 86400, // 24 hours
    ],
];
