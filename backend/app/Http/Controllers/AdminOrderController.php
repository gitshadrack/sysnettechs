<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\CommerceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = Order::query()->with('items')->latest()
            ->when($request->filled('payment_status'), fn ($query) => $query->where('payment_status', $request->string('payment_status')))
            ->when($request->filled('fulfilment_status'), fn ($query) => $query->where('fulfilment_status', $request->string('fulfilment_status')))
            ->paginate(25);

        return response()->json($orders);
    }

    public function show(Order $order): JsonResponse
    {
        return response()->json(['data' => $order->load('items')]);
    }

    public function update(Request $request, Order $order, CommerceService $commerce): JsonResponse
    {
        $data = $request->validate([
            'payment_status' => ['sometimes', 'in:pending,paid,failed,refunded'],
            'fulfilment_status' => ['sometimes', 'in:new,processing,ready,shipped,completed,cancelled'],
        ]);
        if (($data['fulfilment_status'] ?? null) === 'cancelled' && $order->stock_reserved) {
            $commerce->releaseReservation($order, $order->payment_status === 'paid' ? 'refunded' : 'failed');
            unset($data['payment_status']);
        }
        if (($data['fulfilment_status'] ?? null) === 'completed') {
            $data['stock_reserved'] = false;
        }
        $order->refresh()->update($data);

        return response()->json(['data' => $order->fresh('items')]);
    }
}
