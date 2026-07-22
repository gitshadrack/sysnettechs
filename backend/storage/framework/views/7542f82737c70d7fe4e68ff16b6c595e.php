<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>We received your request</title>
</head>
<body style="margin:0;background:#f1f5f9;color:#1e293b;font-family:Arial,sans-serif">
<main style="max-width:680px;margin:0 auto;padding:32px 16px">
    <header style="border-radius:16px 16px 0 0;background:#0A2A66;padding:24px;color:#fff">
        <h1 style="margin:0;font-size:24px">Thank you, <?php echo e($enquiry->name); ?></h1>
        <p style="margin:8px 0 0;color:#dbeafe">Your request has reached Sysnettech Solutions Ltd.</p>
    </header>
    <section style="background:#fff;padding:24px;border:1px solid #cbd5e1;line-height:1.65">
        <p>Our team will review your message and contact you using the details you provided.</p>
        <p><strong>Reference:</strong> <?php echo e($enquiry->reference()); ?></p>
        <p><strong>Request type:</strong> <?php echo e(ucfirst(str_replace(['-', '_'], ' ', $enquiry->kind))); ?></p>
        <p>Please quote the reference above if you contact us about this request.</p>
    </section>
    <footer style="border-radius:0 0 16px 16px;background:#e2e8f0;padding:18px;font-size:13px">
        Sysnettech Solutions Ltd · Innovative ICT Solutions for Modern Businesses<br>
        This is an automated acknowledgement. Do not send passwords or payment card details by email.
    </footer>
</main>
</body>
</html>
<?php /**PATH C:\wamp64\www\Sysnettechs\backend\resources\views/mail/enquiry-acknowledgement.blade.php ENDPATH**/ ?>