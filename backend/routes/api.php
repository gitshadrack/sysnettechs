<?php

use App\Http\Controllers\AdminChatController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\AdminProductController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\EnquiryController;
use App\Http\Controllers\SeoSettingsController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

Route::get('/content/{type}', [ContentController::class, 'index'])->whereIn('type', ['services', 'projects', 'products', 'posts', 'testimonials', 'team', 'careers', 'faqs', 'settings']);
Route::post('/contact', [EnquiryController::class, 'store'])->middleware('throttle:5,1');
Route::post('/quotes', [EnquiryController::class, 'store'])->middleware('throttle:5,1');
Route::post('/service-requests', [EnquiryController::class, 'store'])->middleware('throttle:5,1');
Route::post('/applications', [EnquiryController::class, 'store'])->middleware('throttle:5,1');
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/settings/seo', [SeoSettingsController::class, 'show']);
Route::get('/store/products', [StoreController::class, 'index']);
Route::post('/store/checkout', [StoreController::class, 'checkout'])->middleware('throttle:10,1');
Route::get('/store/orders/{order:reference}', [StoreController::class, 'show']);
Route::match(['get', 'post'], '/store/payments/pesapal/ipn', [StoreController::class, 'pesapalIpn'])->middleware('throttle:30,1');
Route::middleware('throttle:chat')->prefix('chat')->group(function () {
    Route::post('/conversations', [ChatController::class, 'store']);
    Route::get('/conversations/{conversation}', [ChatController::class, 'show'])->whereNumber('conversation');
    Route::get('/conversations/{conversation}/messages', [ChatController::class, 'messages'])->whereNumber('conversation');
    Route::post('/conversations/{conversation}/messages', [ChatController::class, 'send'])->whereNumber('conversation');
});
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/analytics', [AdminController::class, 'analytics']);
    Route::get('/enquiries', [AdminController::class, 'enquiries']);
    Route::get('/orders', [AdminOrderController::class, 'index']);
    Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->whereNumber('order');
    Route::patch('/orders/{order}', [AdminOrderController::class, 'update'])->whereNumber('order');
    Route::apiResource('/products', AdminProductController::class)->except('show');
    Route::patch('/enquiries/{enquiry}', [AdminController::class, 'updateEnquiry']);
    Route::get('/content', [ContentController::class, 'adminIndex']);
    Route::apiResource('/content', ContentController::class)->except('index');
    Route::post('/uploads', [AdminController::class, 'upload']);
    Route::get('/seo-settings', [SeoSettingsController::class, 'show']);
    Route::put('/seo-settings', [SeoSettingsController::class, 'update']);
    Route::get('/chats', [AdminChatController::class, 'index']);
    Route::get('/chats/{conversation}', [AdminChatController::class, 'show'])->whereNumber('conversation');
    Route::post('/chats/{conversation}/messages', [AdminChatController::class, 'reply'])->whereNumber('conversation');
    Route::patch('/chats/{conversation}', [AdminChatController::class, 'update'])->whereNumber('conversation');
    Route::middleware('admin.role')->group(function () {
        Route::get('/users', [AdminController::class, 'users']);
        Route::post('/users', [AdminController::class, 'storeUser']);
        Route::patch('/users/{user}', [AdminController::class, 'updateUser'])->whereNumber('user');
        Route::delete('/users/{user}', [AdminController::class, 'destroyUser'])->whereNumber('user');
        Route::get('/backups', [AdminController::class, 'backups']);
        Route::post('/backups', [AdminController::class, 'backup']);
        Route::get('/backups/{file}', [AdminController::class, 'downloadBackup'])->where('file', '[A-Za-z0-9._-]+');
        Route::delete('/chats/{conversation}', [AdminChatController::class, 'destroy'])->whereNumber('conversation');
    });
});
