<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Setting;
use Illuminate\Http\Request;

class ApplySettings
{
    public function handle(Request $request, Closure $next)
    {
        // Set application timezone
        $timezone = Setting::get('timezone', config('app.timezone'));
        date_default_timezone_set($timezone);

        // Set application locale
        $locale = Setting::get('locale', config('app.locale'));
        app()->setLocale($locale);

        return $next($request);
    }
}
