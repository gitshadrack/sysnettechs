<?php

namespace App\Http\Controllers;

use App\Models\ChatConversation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminChatController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $data = $request->validate(['status' => ['nullable', 'in:open,pending,closed']]);
        $conversations = ChatConversation::query()
            ->when($data['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->with(['messages' => fn ($query) => $query->latest('id')->limit(1)])
            ->withCount(['messages as unread_count' => fn ($query) => $query
                ->where('sender_type', 'visitor')
                ->where(function ($unread) {
                    $unread->whereNull('chat_conversations.operator_last_read_at')
                        ->orWhereColumn('chat_messages.created_at', '>', 'chat_conversations.operator_last_read_at');
                })])
            ->orderByDesc('last_message_at')
            ->paginate(30);

        return response()->json($conversations);
    }

    public function show(ChatConversation $conversation): JsonResponse
    {
        $conversation->update(['operator_last_read_at' => now()]);

        return response()->json([
            'conversation' => $conversation,
            'messages' => $conversation->messages()->get(),
        ]);
    }

    public function reply(Request $request, ChatConversation $conversation): JsonResponse
    {
        abort_if($conversation->status === 'closed', 409, 'Reopen the conversation before replying.');
        $data = $request->validate(['message' => ['required', 'string', 'min:1', 'max:2000']]);

        $message = DB::transaction(function () use ($conversation, $data, $request) {
            $message = $conversation->messages()->create([
                'sender_type' => 'operator',
                'sender_id' => $request->user()->id,
                'sender_name' => $request->user()->name,
                'body' => trim($data['message']),
            ]);
            $conversation->update([
                'assigned_to' => $conversation->assigned_to ?? $request->user()->id,
                'status' => 'pending',
                'last_message_at' => now(),
                'operator_last_read_at' => now(),
            ]);

            return $message;
        });

        return response()->json(['message' => $message], 201);
    }

    public function update(Request $request, ChatConversation $conversation): JsonResponse
    {
        $data = $request->validate(['status' => ['required', 'in:open,pending,closed']]);
        $conversation->update($data);

        return response()->json(['conversation' => $conversation->fresh()]);
    }

    public function destroy(ChatConversation $conversation): JsonResponse
    {
        $conversation->delete();

        return response()->json(null, 204);
    }
}
