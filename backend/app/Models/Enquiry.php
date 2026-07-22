<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    use HasFactory;

    protected $fillable = ['kind', 'name', 'company', 'email', 'phone', 'service', 'position', 'message', 'attachment', 'status', 'meta'];

    protected function casts(): array
    {
        return ['meta' => 'array'];
    }

    public function reference(): string
    {
        return 'SNT-'.str_pad((string) $this->id, 6, '0', STR_PAD_LEFT);
    }
}
