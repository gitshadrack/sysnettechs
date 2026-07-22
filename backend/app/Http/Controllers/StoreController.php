<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Services\CommerceService;
use App\Services\PesapalService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Throwable;

class StoreController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $products = Product::query()->where('is_active', true)
            ->when($request->filled('category'), fn ($query) => $query->where('category', (string) $request->string('category')))
            ->orderBy('category')->orderBy('name')->get();

        return response()->json(['data' => $products, 'categories' => $products->pluck('category')->unique()->values()]);
    }

    public function checkout(Request $request, PesapalService $pesapal, CommerceService $commerce): JsonResponse
    {
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:190'],
            'phone' => ['required', 'string', 'regex:/^(?:\+?254|0)[17]\d{8}$/'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'payment_method' => ['required', 'in:mpesa,card,bank_transfer'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1', 'max:30'],
            'items.*.product_id' => ['required', 'integer', 'distinct', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:25'],
        ], ['phone.regex' => 'Enter a valid Kenyan mobile number.']);

        $online = in_array($data['payment_method'], ['mpesa', 'card'], true);
        if ($online && ! $pesapal->configured()) {
            return response()->json(['message' => 'Online payment setup is not yet active. Choose bank transfer or contact sales.'], 503);
        }

        $plainToken = Str::random(64);
        $order = DB::transaction(function () use ($data, $plainToken, $online) {
            $requested = collect($data['items'])->keyBy('product_id');
            $products = Product::query()->whereKey($requested->keys())->lockForUpdate()->get()->keyBy('id');
            $subtotal = 0;
            foreach ($requested as $id => $item) {
                $product = $products->get((int) $id);
                if (! $product || ! $product->is_active) {
                    throw ValidationException::withMessages(['items' => 'One or more products are no longer available.']);
                }
                if ($product->stock_quantity < $item['quantity']) {
                    throw ValidationException::withMessages(['items' => "Only {$product->stock_quantity} units of {$product->name} are available."]);
                }
                $subtotal += (float) $product->price * $item['quantity'];
            }
            $order = Order::create([
                'reference' => 'SNT-'.now()->format('Ymd').'-'.Str::upper(Str::random(8)),
                'access_token_hash' => hash('sha256', $plainToken),
                'customer_name' => $data['customer_name'], 'email' => $data['email'], 'phone' => $data['phone'],
                'address' => $data['address'], 'city' => $data['city'], 'payment_method' => $data['payment_method'],
                'subtotal' => $subtotal, 'total' => $subtotal, 'currency' => 'KES', 'notes' => $data['notes'] ?? null,
                'expires_at' => $online ? now()->addMinutes(30) : now()->addHours(48),
            ]);
            foreach ($requested as $id => $item) {
                $product = $products->get((int) $id);
                $lineTotal = (float) $product->price * $item['quantity'];
                $order->items()->create(['product_id' => $product->id, 'sku' => $product->sku, 'product_name' => $product->name, 'quantity' => $item['quantity'], 'unit_price' => $product->price, 'line_total' => $lineTotal]);
                $product->decrement('stock_quantity', $item['quantity']);
            }

            return $order->load('items');
        });

        if (! $online) {
            return response()->json(['message' => 'Order reserved. Complete the bank transfer using the instructions below.', 'order' => $order, 'order_token' => $plainToken, 'next_action' => 'bank_transfer', 'bank' => config('payments.bank')], 201);
        }

        try {
            $payment = $pesapal->initiate($order);
            $order->update(['payment_reference' => $payment['order_tracking_id'], 'payment_redirect_url' => $payment['redirect_url']]);

            return response()->json(['message' => 'Continue to secure payment.', 'order' => $order->fresh('items'), 'order_token' => $plainToken, 'next_action' => 'redirect', 'redirect_url' => $payment['redirect_url']], 201);
        } catch (Throwable $exception) {
            report($exception);
            $commerce->releaseReservation($order);

            return response()->json(['message' => 'The payment provider is temporarily unavailable. Your card or M-Pesa account was not charged.'], 502);
        }
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        $token = (string) $request->header('X-Order-Token');
        abort_unless($token !== '' && hash_equals($order->access_token_hash, hash('sha256', $token)), 403, 'Invalid order access token.');

        return response()->json(['data' => $order->load('items')]);
    }

    public function pesapalIpn(Request $request, PesapalService $pesapal, CommerceService $commerce): JsonResponse
    {
        $trackingId = (string) ($request->input('OrderTrackingId') ?: $request->input('orderTrackingId'));
        $order = Order::query()->where('payment_reference', $trackingId)->firstOrFail();
        $status = $pesapal->status($trackingId);
        $description = strtolower((string) ($status['payment_status_description'] ?? 'pending'));
        if ($description === 'completed') {
            $order->update(['payment_status' => 'paid']);
        } elseif (in_array($description, ['failed', 'invalid', 'reversed'], true)) {
            $commerce->releaseReservation($order);
        }

        return response()->json(['orderNotificationType' => $request->input('OrderNotificationType'), 'orderTrackingId' => $trackingId, 'orderMerchantReference' => $order->reference, 'status' => 200]);
    }
}
