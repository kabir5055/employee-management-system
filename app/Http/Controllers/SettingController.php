<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controller as BaseController;

class SettingController extends BaseController
{
    public function __construct()
    {
        $this->middleware('permission:manage-settings');
    }

    public function index()
    {
        $settings = Setting::all()->groupBy('group');

        return Inertia::render('Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
            'settings.*.type' => 'required|string',
        ]);

        foreach ($request->settings as $setting) {
            if ($setting['type'] === 'file' && !empty($setting['value']) && is_array($setting['value'])) {
                // Handle file upload
                $file = $setting['value'][0] ?? null;
                if ($file && $file->isValid()) {
                    $path = $file->store('public/settings');
                    Setting::set($setting['key'], Storage::url($path));
                }
            } else {
                Setting::set($setting['key'], $setting['value']);
            }
        }

        return back()->with('success', 'Settings updated successfully.');
    }
}
