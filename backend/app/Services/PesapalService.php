<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class PesapalService
{
    public function configured(): bool
    {
        return collect(['consumer_key', 'consumer_secret', 'notification_id'])
            ->every(fn ($key) => filled(config("payments.pesapal.$key")));
    }

    public function initiate(Order $order): array
    {
        if (! $this->configured()) {
            throw new RuntimeException('Online payments are not configured. Choose bank transfer or contact sales.');
        }

        $token = Http::acceptJson()->asJson()->timeout(15)->post(
            config('payments.pesapal.base_url').'/Auth/RequestToken',
            ['consumer_key' => config('payments.pesapal.consumer_key'), 'consumer_secret' => config('payments.pesapal.consumer_secret')]
        )->throw()->json('token');

        if (! $token) {
            throw new RuntimeException('The payment provider did not issue an access token.');
        }

        [$firstName, $lastName] = array_pad(explode(' ', $order->customer_name, 2), 2, '');
        $response = Http::withToken($token)->acceptJson()->asJson()->timeout(20)->post(
            config('payments.pesapal.base_url').'/Transactions/SubmitOrderRequest',
            [
                'id' => $order->reference,
                'currency' => $order->currency,
                'amount' => (float) $order->total,
                'description' => "Sysnettech order {$order->reference}",
                'callback_url' => config('payments.pesapal.callback_url'),
                'notification_id' => config('payments.pesapal.notification_id'),
                'billing_address' => [
                    'email_address' => $order->email,
                    'phone_number' => $order->phone,
                    'country_code' => 'KE',
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'line_1' => $order->address,
                    'city' => $order->city,
                ],
            ]
        )->throw()->json();

        if (empty($response['order_tracking_id']) || empty($response['redirect_url'])) {
            throw new RuntimeException('The payment provider returned an incomplete checkout response.');
        }

        return $response;
    }

    public function status(string $trackingId): array
    {
        if (! $this->configured()) {
            throw new RuntimeException('Online payments are not configured.');
        }
        $token = Http::acceptJson()->asJson()->timeout(15)->post(
            config('payments.pesapal.base_url').'/Auth/RequestToken',
            ['consumer_key' => config('payments.pesapal.consumer_key'), 'consumer_secret' => config('payments.pesapal.consumer_secret')]
        )->throw()->json('token');

        return Http::withToken($token)->acceptJson()->timeout(15)->get(
            config('payments.pesapal.base_url').'/Transactions/GetTransactionStatus',
            ['orderTrackingId' => $trackingId]
        )->throw()->json();
    }
}
