<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class CommerceService
{
    public function releaseReservation(Order $order, string $paymentStatus = 'failed'): void
    {
        DB::transaction(function () use ($order, $paymentStatus) {
            $locked = Order::query()->with('items')->lockForUpdate()->findOrFail($order->id);
            if ($locked->stock_reserved) {
                foreach ($locked->items as $item) {
                    if ($item->product_id) {
                        Product::query()->whereKey($item->product_id)->increment('stock_quantity', $item->quantity);
                    }
                }
            }
            $locked->update(['stock_reserved' => false, 'payment_status' => $paymentStatus]);
        });
    }
}
