<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['reference', 'access_token_hash', 'customer_name', 'email', 'phone', 'address', 'city', 'payment_method', 'payment_status', 'fulfilment_status', 'subtotal', 'total', 'currency', 'payment_reference', 'payment_redirect_url', 'notes', 'stock_reserved', 'expires_at'];

    protected $hidden = ['access_token_hash', 'payment_redirect_url'];

    protected function casts(): array
    {
        return ['subtotal' => 'decimal:2', 'total' => 'decimal:2', 'stock_reserved' => 'boolean', 'expires_at' => 'datetime'];
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
