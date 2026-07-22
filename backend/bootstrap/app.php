<?php

use App\Http\Middleware\EnsureAdminRole;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))->withRouting(web: __DIR__.'/../routes/web.php', api: __DIR__.'/../routes/api.php', commands: __DIR__.'/../routes/console.php', health: '/up')->withMiddleware(function (Middleware $middleware) {
    // The decoupled Next.js admin uses Sanctum bearer tokens. Do not enable
    // stateful SPA middleware here, as that flow requires CSRF cookies.
    $middleware->alias(['admin.role' => EnsureAdminRole::class]);
})->withExceptions(function (Exceptions $exceptions) {})->create();
