<?php

namespace App\Http\Controllers;

use App\Mail\AdminEnquiryReceived;
use App\Mail\EnquiryAcknowledgement;
use App\Models\Enquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Throwable;

class EnquiryController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:120'], 'company' => ['nullable', 'string', 'max:160'], 'email' => ['required', 'email', 'max:160'], 'phone' => ['required', 'string', 'max:40'], 'service' => ['nullable', 'string', 'max:120'], 'position' => ['nullable', 'string', 'max:160'], 'message' => ['required', 'string', 'max:5000'], 'cv' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120']]);
        $path = $request->file('cv')?->store('applications', 'local');
        unset($data['cv']);
        $enquiry = Enquiry::create([...$data, 'attachment' => $path, 'kind' => $request->route()->getName() ?? $request->segment(2), 'status' => 'new', 'meta' => ['ip' => $request->ip(), 'user_agent' => $request->userAgent()]]);

        if (config('mail.notifications.enabled')) {
            try {
                Mail::to(config('mail.notifications.to'))->queue(new AdminEnquiryReceived($enquiry));
                if (config('mail.notifications.customer_confirmation')) {
                    Mail::to($enquiry->email)->queue(new EnquiryAcknowledgement($enquiry));
                }
            } catch (Throwable $exception) {
                report($exception);
            }
        }

        return response()->json(['message' => 'Your request has been received.', 'reference' => $enquiry->reference()], 201);
    }
}
