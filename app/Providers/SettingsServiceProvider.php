<?php

namespace App\Providers;

use App\Models\Setting;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Cache;

class SettingsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Only register settings service if not running migrations
        if (!$this->app->runningInConsole()) {
            $this->app->singleton('settings', function ($app) {
                return Cache::rememberForever('settings', function () {
                    return Setting::all()->pluck('value', 'key')->toArray();
                });
            });
        }
    }

    public function boot(): void
    {
        // Only set up settings if not running migrations
        if (!$this->app->runningInConsole()) {
            // Share settings with all views
            View::composer('*', function ($view) {
                $view->with('settings', app('settings'));
            });

            // Add default settings if they don't exist
            $this->ensureDefaultSettings();
        }
    }

    protected function ensureDefaultSettings(): void
    {
        $defaults = [
            'app_name' => [
                'value' => 'Employee Management System',
                'type' => 'text',
                'group' => 'general',
                'label' => 'Application Name',
            ],
            'app_logo' => [
                'value' => null,
                'type' => 'file',
                'group' => 'general',
                'label' => 'Application Logo',
            ],
            'primary_color' => [
                'value' => '#4f46e5',
                'type' => 'color',
                'group' => 'theme',
                'label' => 'Primary Color',
            ],
            'secondary_color' => [
                'value' => '#6b7280',
                'type' => 'color',
                'group' => 'theme',
                'label' => 'Secondary Color',
            ],
        ];

        foreach ($defaults as $key => $setting) {
            Setting::firstOrCreate(
                ['key' => $key],
                [
                    'value' => $setting['value'],
                    'type' => $setting['type'],
                    'group' => $setting['group'],
                    'label' => $setting['label'],
                ]
            );
        }
    }
}
