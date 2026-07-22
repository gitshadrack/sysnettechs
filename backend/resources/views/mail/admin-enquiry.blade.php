<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New website enquiry</title>
</head>
<body style="margin:0;background:#f1f5f9;color:#1e293b;font-family:Arial,sans-serif">
<main style="max-width:680px;margin:0 auto;padding:32px 16px">
    <header style="border-radius:16px 16px 0 0;background:#0A2A66;padding:24px;color:#fff">
        <h1 style="margin:0;font-size:24px">New website enquiry</h1>
        <p style="margin:8px 0 0;color:#dbeafe">Reference: {{ $enquiry->reference() }}</p>
    </header>
    <section style="background:#fff;padding:24px;border:1px solid #cbd5e1">
        <h2 style="margin-top:0;color:#0A2A66">Contact details</h2>
        <p><strong>Type:</strong> {{ ucfirst(str_replace(['-', '_'], ' ', $enquiry->kind)) }}</p>
        <p><strong>Name:</strong> {{ $enquiry->name }}</p>
        @if($enquiry->company)<p><strong>Company:</strong> {{ $enquiry->company }}</p>@endif
        <p><strong>Email:</strong> <a href="mailto:{{ $enquiry->email }}">{{ $enquiry->email }}</a></p>
        <p><strong>Phone:</strong> <a href="tel:{{ $enquiry->phone }}">{{ $enquiry->phone }}</a></p>
        @if($enquiry->service)<p><strong>Service:</strong> {{ $enquiry->service }}</p>@endif
        @if($enquiry->position)<p><strong>Position:</strong> {{ $enquiry->position }}</p>@endif
        <h2 style="margin-top:28px;color:#0A2A66">Message</h2>
        <p style="white-space:pre-wrap;line-height:1.65">{{ $enquiry->message }}</p>
        @if($enquiry->attachment)<p><strong>Attachment:</strong> The submitted application document is attached securely to this email.</p>@endif
    </section>
    <footer style="border-radius:0 0 16px 16px;background:#e2e8f0;padding:18px;font-size:13px">
        Reply to this email to respond directly to {{ $enquiry->name }}. Manage the enquiry in the Sysnettech admin dashboard.
    </footer>
</main>
</body>
</html>
