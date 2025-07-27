<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     */
    public const HOME = '/dashboard';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        // Configure rate limiting
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->getKey() ?: $request->ip());
        });

        // Configure global patterns
        Route::pattern('id', '[0-9]+');
        Route::pattern('slug', '[a-z0-9-]+');

        $this->routes(function () {
            // API Routes
            Route::middleware(['api', 'throttle:api'])
                ->prefix('api')
                ->name('api.')
                ->group(base_path('routes/api.php'));

            // Web Routes with CSRF Protection
            Route::middleware(['web', 'verify.csrf'])
                ->group(base_path('routes/web.php'));

            // Authentication Routes
            Route::middleware(['web', 'verify.csrf'])
                ->group(base_path('routes/auth.php'));
        });
    }
}
