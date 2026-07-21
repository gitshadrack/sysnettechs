<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeoSettingsController extends Controller
{
    private const KEYS = [
        'site_title',
        'meta_description',
        'og_image',
        'google_analytics_id',
        'facebook_url',
        'instagram_url',
        'linkedin_url',
    ];

    public function show(): JsonResponse
    {
        return response()->json(SiteSetting::whereIn('key', self::KEYS)->pluck('value', 'key'));
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'site_title' => ['required', 'string', 'max:70'],
            'meta_description' => ['required', 'string', 'max:170'],
            'og_image' => ['nullable', 'string', 'max:500'],
            'google_analytics_id' => ['nullable', 'regex:/^(G-[A-Z0-9]+)?$/'],
            'facebook_url' => ['nullable', 'url:https', 'max:500'],
            'instagram_url' => ['nullable', 'url:https', 'max:500'],
            'linkedin_url' => ['nullable', 'url:https', 'max:500'],
        ]);

        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return $this->show();
    }
}
