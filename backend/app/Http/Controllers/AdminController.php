<?php

namespace App\Http\Controllers;

use App\Models\ChatConversation;
use App\Models\Content;
use App\Models\Enquiry;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    public function analytics(): JsonResponse
    {
        return response()->json(['content' => Content::selectRaw('type,count(*) as total')->groupBy('type')->pluck('total', 'type'), 'enquiries' => ['total' => Enquiry::count(), 'new' => Enquiry::where('status', 'new')->count(), 'this_month' => Enquiry::whereMonth('created_at', now()->month)->count()], 'recent' => Enquiry::latest()->limit(8)->get(), 'chats' => ['open' => ChatConversation::where('status', 'open')->count(), 'total' => ChatConversation::count()], 'orders' => ['total' => Order::count(), 'pending' => Order::where('payment_status', 'pending')->count(), 'paid' => Order::where('payment_status', 'paid')->count(), 'revenue' => Order::where('payment_status', 'paid')->sum('total')]]);
    }

    public function enquiries(): JsonResponse
    {
        return response()->json(Enquiry::latest()->paginate(25));
    }

    public function updateEnquiry(Request $r, Enquiry $enquiry): JsonResponse
    {
        $data = $r->validate(['status' => ['required', 'in:new,in_progress,resolved,spam']]);
        $enquiry->update($data);

        return response()->json($enquiry);
    }

    public function upload(Request $r): JsonResponse
    {
        $r->validate(['image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,avif', 'max:5120']]);
        $path = $r->file('image')->store('content', 'public');

        return response()->json(['path' => $path, 'url' => Storage::disk('public')->url($path)], 201);
    }

    public function uploadPortfolioDocument(Request $r): JsonResponse
    {
        $r->validate([
            'file' => ['required', 'file', 'mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,zip', 'max:20480'],
        ]);
        $file = $r->file('file');
        $path = $file->store('portfolio', 'public');

        return response()->json([
            'path' => $path,
            'name' => $file->getClientOriginalName(),
        ], 201);
    }

    public function users(): JsonResponse
    {
        return response()->json(User::paginate(25));
    }

    public function storeUser(Request $r): JsonResponse
    {
        $data = $r->validate(['name' => ['required', 'string', 'max:120'], 'email' => ['required', 'email', 'unique:users'], 'password' => ['required', 'min:12'], 'role' => ['required', 'in:admin,editor']]);

        return response()->json(User::create($data), 201);
    }

    public function updateUser(Request $r, User $user): JsonResponse
    {
        $data = $r->validate(['name' => ['sometimes', 'string', 'max:120'], 'email' => ['sometimes', 'email', 'unique:users,email,'.$user->id], 'password' => ['nullable', 'min:12'], 'role' => ['sometimes', 'in:admin,editor']]);
        if (empty($data['password'])) {
            unset($data['password']);
        }$user->update($data);

        return response()->json($user->fresh());
    }

    public function destroyUser(Request $r, User $user): JsonResponse
    {
        abort_if($r->user()->is($user), 422, 'You cannot delete your own account.');
        abort_if($user->role === 'admin' && User::where('role', 'admin')->count() <= 1, 422, 'At least one administrator is required.');
        $user->tokens()->delete();
        $user->delete();

        return response()->json(null, 204);
    }

    public function backups(): JsonResponse
    {
        $files = collect(Storage::disk('local')->files('backups'))->map(fn ($path) => ['name' => basename($path), 'size' => Storage::disk('local')->size($path), 'created_at' => date(DATE_ATOM, Storage::disk('local')->lastModified($path))])->sortByDesc('created_at')->values();

        return response()->json($files);
    }

    public function backup(): JsonResponse
    {
        Artisan::call('backup:run');

        return response()->json(['message' => 'Backup completed.', 'output' => trim(Artisan::output())], 201);
    }

    public function downloadBackup(string $file)
    {
        abort_unless(preg_match('/^sysnettech-[0-9-]+\.json$/', $file), 404);
        $path = 'backups/'.$file;
        abort_unless(Storage::disk('local')->exists($path), 404);

        return Storage::disk('local')->download($path);
    }
}
