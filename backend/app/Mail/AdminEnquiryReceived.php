<?php

namespace App\Mail;

use App\Models\Enquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminEnquiryReceived extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Enquiry $enquiry) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            replyTo: [new Address($this->enquiry->email, $this->enquiry->name)],
            subject: "New {$this->enquiry->kind} enquiry — {$this->enquiry->reference()}",
        );
    }

    public function content(): Content
    {
        return new Content(view: 'mail.admin-enquiry');
    }

    public function attachments(): array
    {
        if (! $this->enquiry->attachment) {
            return [];
        }
        $extension = pathinfo($this->enquiry->attachment, PATHINFO_EXTENSION);

        return [Attachment::fromStorageDisk('local', $this->enquiry->attachment)
            ->as("application-{$this->enquiry->id}.{$extension}")];
    }
}
