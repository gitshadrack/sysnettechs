<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        RateLimiter::for('chat', fn (Request $request) => [
            Limit::perMinute(30)->by($request->ip()),
            Limit::perHour(180)->by($request->ip()),
        ]);
    }
}
