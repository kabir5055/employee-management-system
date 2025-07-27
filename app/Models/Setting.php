<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'label',
        'is_public'
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get a setting value by key
     */
    public static function get(string $key, $default = null): mixed
    {
        return Cache::rememberForever("setting.{$key}", function () use ($key, $default) {
            $setting = static::where('key', $key)->first();
            return $setting ? $setting->value : $default;
        });
    }

    /**
     * Set a setting value
     */
    public static function set(string $key, $value): void
    {
        Cache::forget("setting.{$key}");

        $setting = static::where('key', $key)->first();

        if ($setting) {
            $setting->update(['value' => $value]);
        } else {
            static::create([
                'key' => $key,
                'value' => $value,
                'type' => is_numeric($value) ? 'number' : (is_bool($value) ? 'boolean' : 'string'),
                'group' => 'general',
                'is_public' => true
            ]);
            static::create([
                'key' => $key,
                'value' => $value,
                'label' => ucwords(str_replace('_', ' ', $key)),
                'type' => 'text',
                'group' => 'general'
            ]);
        }

        if ($setting) {
            $setting->value = $value;
            $setting->save();
        } else {
            static::create([
                'key' => $key,
                'value' => $value,
                'label' => ucwords(str_replace('_', ' ', $key)),
            ]);
        }
    }
}


