<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatConversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'visitor_name',
        'visitor_email',
        'visitor_token_hash',
        'status',
        'assigned_to',
        'last_message_at',
        'visitor_last_read_at',
        'operator_last_read_at',
        'ip_hash',
        'user_agent',
    ];

    protected $hidden = ['visitor_token_hash', 'ip_hash', 'user_agent'];

    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
            'visitor_last_read_at' => 'datetime',
            'operator_last_read_at' => 'datetime',
        ];
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class)->orderBy('id');
    }
}
