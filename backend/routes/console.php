<?php

use App\Models\Order;
use App\Services\CommerceService;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Storage;

Artisan::command('backup:run', function () {
    $tables = ['users', 'contents', 'enquiries', 'chat_conversations', 'chat_messages', 'site_settings', 'products', 'orders', 'order_items'];
    $payload = ['created_at' => now()->toIso8601String(), 'database' => config('database.default'), 'tables' => []];
    foreach ($tables as $table) {
        $payload['tables'][$table] = DB::table($table)->get()->toArray();
    }$name = 'backups/sysnettech-'.now()->format('Y-m-d-His').'.json';
    Storage::disk('local')->put($name, json_encode($payload, JSON_PRETTY_PRINT));
    $this->info("Backup written to {$name}");
})->purpose('Create an application data backup');
Schedule::command('backup:run')->dailyAt('02:00')->withoutOverlapping();

Artisan::command('orders:release-expired', function () {
    Order::query()->where('payment_status', 'pending')->where('stock_reserved', true)->where('expires_at', '<=', now())
        ->each(fn (Order $order) => app(CommerceService::class)->releaseReservation($order));
    $this->info('Expired unpaid order reservations released.');
})->purpose('Return stock held by expired unpaid orders');
Schedule::command('orders:release-expired')->everyFiveMinutes()->withoutOverlapping();

Artisan::command('auth:prune-admin-tokens', function () {
    $now = now();
    $idleCutoff = $now->copy()->subMinutes(config('auth.admin_idle_timeout'));
    $absoluteCutoff = $now->copy()->subMinutes(config('auth.admin_token_lifetime'));
    $deleted = DB::table('personal_access_tokens')
        ->where(function ($query) use ($now, $idleCutoff, $absoluteCutoff) {
            $query->where('expires_at', '<=', $now)
                ->orWhere('created_at', '<=', $absoluteCutoff)
                ->orWhere('last_used_at', '<=', $idleCutoff)
                ->orWhere(function ($query) use ($idleCutoff) {
                    $query->whereNull('last_used_at')->where('created_at', '<=', $idleCutoff);
                });
        })->delete();
    $this->info("Pruned {$deleted} expired admin token(s).");
})->purpose('Remove expired and inactive administrator access tokens');
Schedule::command('auth:prune-admin-tokens')->hourly()->withoutOverlapping();
