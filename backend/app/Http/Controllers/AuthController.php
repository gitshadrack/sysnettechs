<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user()]);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate(['email' => ['required', 'email'], 'password' => ['required', 'string'], 'device_name' => ['nullable', 'string', 'max:100']]);
        $user = User::where('email', $data['email'])->first();
        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 422);
        }

        $expiresAt = now()->addMinutes(config('auth.admin_token_lifetime'));
        $token = $user->createToken($data['device_name'] ?? 'admin-dashboard', ['*'], $expiresAt);

        return response()->json([
            'user' => $user,
            'token' => $token->plainTextToken,
            'expires_at' => $expiresAt->toIso8601String(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out.']);
    }
}
