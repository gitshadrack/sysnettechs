<?php

namespace App\Http\Controllers;

use App\Models\ChatConversation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['nullable', 'email:rfc', 'max:160'],
            'message' => ['required', 'string', 'min:1', 'max:2000'],
        ]);

        $plainToken = Str::random(64);

        [$conversation, $message] = DB::transaction(function () use ($data, $plainToken, $request) {
            $conversation = ChatConversation::create([
                'visitor_name' => trim($data['name']),
                'visitor_email' => isset($data['email']) ? strtolower(trim($data['email'])) : null,
                'visitor_token_hash' => hash('sha256', $plainToken),
                'status' => 'open',
                'last_message_at' => now(),
                'visitor_last_read_at' => now(),
                'ip_hash' => $request->ip()
                    ? hash_hmac('sha256', $request->ip(), (string) config('app.key'))
                    : null,
                'user_agent' => Str::limit((string) $request->userAgent(), 500, ''),
            ]);

            $message = $conversation->messages()->create([
                'sender_type' => 'visitor',
                'sender_name' => $conversation->visitor_name,
                'body' => trim($data['message']),
            ]);

            return [$conversation, $message];
        });

        return response()->json([
            'conversation' => $this->conversationPayload($conversation),
            'message' => $message,
            'token' => $plainToken,
            'poll_after_ms' => 4000,
        ], 201);
    }

    public function show(Request $request, ChatConversation $conversation): JsonResponse
    {
        $this->authorizeVisitor($request, $conversation);
        $conversation->update(['visitor_last_read_at' => now()]);

        return response()->json([
            'conversation' => $this->conversationPayload($conversation),
            'messages' => $conversation->messages()->get(),
            'poll_after_ms' => 4000,
        ]);
    }

    public function messages(Request $request, ChatConversation $conversation): JsonResponse
    {
        $this->authorizeVisitor($request, $conversation);
        $data = $request->validate(['after_id' => ['nullable', 'integer', 'min:0']]);

        $messages = $conversation->messages()
            ->when(isset($data['after_id']), fn ($query) => $query->where('id', '>', $data['after_id']))
            ->limit(100)
            ->get();

        if ($messages->contains('sender_type', 'operator')) {
            $conversation->update(['visitor_last_read_at' => now()]);
        }

        return response()->json([
            'conversation' => $this->conversationPayload($conversation->fresh()),
            'messages' => $messages,
            'poll_after_ms' => 4000,
        ]);
    }

    public function send(Request $request, ChatConversation $conversation): JsonResponse
    {
        $this->authorizeVisitor($request, $conversation);
        abort_if($conversation->status === 'closed', 409, 'This conversation is closed.');

        $data = $request->validate(['message' => ['required', 'string', 'min:1', 'max:2000']]);

        $message = DB::transaction(function () use ($conversation, $data) {
            $message = $conversation->messages()->create([
                'sender_type' => 'visitor',
                'sender_name' => $conversation->visitor_name,
                'body' => trim($data['message']),
            ]);
            $conversation->update(['last_message_at' => now(), 'status' => 'open']);
            return $message;
        });

        return response()->json(['message' => $message], 201);
    }

    private function authorizeVisitor(Request $request, ChatConversation $conversation): void
    {
        $token = (string) $request->header('X-Chat-Token');
        abort_unless($token !== '' && hash_equals($conversation->visitor_token_hash, hash('sha256', $token)), 403);
    }

    private function conversationPayload(ChatConversation $conversation): array
    {
        return [
            'id' => $conversation->id,
            'visitor_name' => $conversation->visitor_name,
            'status' => $conversation->status,
            'last_message_at' => $conversation->last_message_at,
        ];
    }
}
