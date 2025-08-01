<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    ...$request->user()->toArray(),
                    'is_super_admin' => $request->user()->is_super_admin ?? false,
                ] : null,
            ],
            'settings' => $this->getPublicSettings(),
        ];
    }

    /**
     * Get public settings for sharing with frontend
     */
    private function getPublicSettings(): array
    {
        try {
            return \App\Models\Setting::where('is_public', true)
                ->get()
                ->keyBy('key')
                ->map(fn($setting) => $setting->value)
                ->toArray();
        } catch (\Exception $e) {
            return [];
        }
    }
}
