<?php

return [
    'pesapal' => [
        'base_url' => env('PESAPAL_BASE_URL', 'https://cybqa.pesapal.com/pesapalv3/api'),
        'consumer_key' => env('PESAPAL_CONSUMER_KEY'),
        'consumer_secret' => env('PESAPAL_CONSUMER_SECRET'),
        'notification_id' => env('PESAPAL_NOTIFICATION_ID'),
        'callback_url' => env('PESAPAL_CALLBACK_URL', env('FRONTEND_URL', 'http://localhost:3000').'/checkout/complete'),
    ],
    'bank' => [
        'name' => env('BANK_NAME', 'Contact Sysnettech for banking details'),
        'account_name' => env('BANK_ACCOUNT_NAME', 'Sysnettech Solutions Ltd'),
        'account_number' => env('BANK_ACCOUNT_NUMBER', 'Provided on invoice'),
        'branch' => env('BANK_BRANCH', 'Nairobi'),
    ],
];
