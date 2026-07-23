# Sysnettech Solutions Ltd

Production-oriented corporate website and content API for **Sysnettech Solutions Ltd**, built as a small monorepo.

## Architecture

- `frontend/` — Next.js 15, React 19, TypeScript, Tailwind CSS and Framer Motion
- `backend/` — Laravel 12 REST API, Sanctum authentication and MySQL
- `docker-compose.yml` — frontend, PHP-FPM API, Nginx and MySQL

The public site includes every requested route, dark mode, sticky mega navigation, mobile navigation, animated statistics, portfolio filters, persistent first-party live chat, WhatsApp, forms, newsletter UI, FAQ, cookie consent, schema markup, sitemap, robots rules, analytics and a generated company-profile PDF.

Live chat uses a rate-limited Laravel API, hashed visitor session tokens, persisted conversations, unread state and four-second active polling. Operators reply from the authenticated admin inbox. Visitor chat tokens are kept in browser session storage and are never stored in plaintext by the API.

## Local development

Requirements: Node.js 22+, PHP 8.2+, Composer 2 and MySQL 8.

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Set local database credentials and ADMIN_PASSWORD in .env
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The admin dashboard is at `/admin`; API tokens are held in session storage and sent as Sanctum bearer tokens. Administrators can manage analytics, live chat, content, media, SEO defaults, users and private backups. Editors can manage operational content and support but cannot access users or backups.

## Docker

Copy `backend/.env.example` to `backend/.env`, set secure database credentials, `APP_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `APP_URL` and `FRONTEND_URL`, then run:

```bash
docker compose build
docker compose up -d
docker compose exec api php artisan migrate --seed --force
docker compose exec api php artisan storage:link
```

Frontend: `http://localhost:3000`; API: `http://localhost:8000/api`.

## API overview

Public endpoints:

- `GET /api/content/{type}`
- `POST /api/contact`, `/quotes`, `/service-requests`, `/applications`
- `POST /api/auth/login`
- `POST /api/chat/conversations`
- `GET|POST /api/chat/conversations/{id}/messages` using `X-Chat-Token`

Authenticated `/api/admin/*` endpoints manage content, enquiries, live chat, media, SEO settings, users, analytics and private backups. Sensitive user and backup routes require the administrator role.

## Production checklist

1. Replace placeholder phone, WhatsApp and map coordinates in `frontend/lib/data.ts` and environment values.
2. Set `APP_ENV=production`, `APP_DEBUG=false`, strong database/admin passwords and an HTTPS `APP_URL`.
3. Set `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_WHATSAPP_NUMBER` before the frontend build.
4. Configure SMTP, object storage and off-site backup retention.
5. Put the containers behind an SSL-terminating reverse proxy and enable HSTS.
6. Run `php artisan config:cache`, `route:cache`, `view:cache`, and schedule `php artisan schedule:run` every minute.
7. Replace seeded/demo copy and role placeholders with approved company content before launch.

## E-commerce payments

The store sells cameras, switches, routers, surveillance hard drives, POS hardware, fingerprint scanners, barcode scanners and network accessories. API-side pricing, transactional stock locks and scheduled expiry protect inventory during checkout. Store orders and inventory are available in the authenticated administration API.

Bank transfer checkout works without an external gateway; configure `BANK_NAME`, `BANK_ACCOUNT_NAME`, `BANK_ACCOUNT_NUMBER` and `BANK_BRANCH`. M-Pesa and Visa/Mastercard use Pesapal hosted checkout and remain unavailable until `PESAPAL_CONSUMER_KEY`, `PESAPAL_CONSUMER_SECRET`, `PESAPAL_NOTIFICATION_ID`, `PESAPAL_BASE_URL` and an HTTPS `PESAPAL_CALLBACK_URL` are configured. Register `/api/store/payments/pesapal/ipn` as the provider IPN URL. Payment secrets belong only in the backend environment.

Public commerce endpoints are `GET /api/store/products`, `POST /api/store/checkout`, and token-protected `GET /api/store/orders/{reference}`. Authenticated administrators and editors can manage `/api/admin/products` and `/api/admin/orders`.

## Form email notifications

Contact, quote, service-request and career forms create a database enquiry and queue two separate emails: an internal notification and a customer acknowledgement. Career attachments are included only in the internal notification. Configure `MAIL_MAILER=smtp`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_SCHEME`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS`, and `MAIL_FROM_NAME` in `backend/.env`. Set one or more comma-separated recipients in `CONTACT_NOTIFICATION_EMAILS`; the default is `info@sysnettechs.co.ke`.

For port 587, most providers use `MAIL_SCHEME=null` and negotiate STARTTLS. For port 465, use the scheme required by the provider, commonly `smtps`. The from-address should be a verified mailbox on the sending domain. Docker includes a persistent queue worker; non-Docker deployments must run `php artisan queue:work` under a process supervisor. After changing mail variables in production, run `php artisan config:clear` or rebuild the cached configuration.

## Quality checks

```bash
cd frontend && npm run typecheck && npm run build
cd backend && php artisan test
```

The custom hero artwork was generated specifically for this project and is stored at `frontend/public/images/hero-ict.png`.

## Deploying on cPanel

This application needs a cPanel plan that provides PHP 8.2+, MySQL, Composer,
Node.js 22+, Terminal or SSH access, cron jobs and SSL. A recommended layout is:

- `https://sysnettechs.co.ke` for the Next.js frontend
- `https://api.sysnettechs.co.ke` for the Laravel API

Replace the example domain and `CPANEL_USER` below with the actual values.

### 1. Create the Laravel API

Create the `api.sysnettechs.co.ke` subdomain and set its document root to:

```text
/home/CPANEL_USER/sysnettech-api/public
```

Upload the contents of `backend/` to
`/home/CPANEL_USER/sysnettech-api`. Only Laravel's `public/` directory should be
web-accessible.

In cPanel, create a MySQL database and user, grant the user all privileges on
the database, and copy `backend/.env.example` to `backend/.env`. Configure at
least the following production values:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.sysnettechs.co.ke
FRONTEND_URL=https://sysnettechs.co.ke
FRONTEND_URLS=https://sysnettechs.co.ke,https://www.sysnettechs.co.ke

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=CPANEL_USER_sysnettech
DB_USERNAME=CPANEL_USER_apiuser
DB_PASSWORD=use-a-strong-password

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=public

ADMIN_EMAIL=admin@sysnettechs.co.ke
ADMIN_PASSWORD=use-a-strong-admin-password

SANCTUM_EXPIRATION=480
ADMIN_IDLE_TIMEOUT=30
ADMIN_TOKEN_LIFETIME=480
```

Also configure the SMTP, bank and Pesapal variables described elsewhere in
this README. Never upload `.env` to a public directory or commit its secrets.

Install and initialize the API from cPanel Terminal or SSH:

```bash
cd /home/CPANEL_USER/sysnettech-api
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --seed --force
php artisan storage:link
chmod -R 775 storage bootstrap/cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` before running the seeder. It creates or
updates the production administrator account.

The repository currently does not include `backend/public/.htaccess`. Create
that file on an Apache-based cPanel server so requests reach Laravel:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On

    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

Verify the API before deploying the frontend:

```text
https://api.sysnettechs.co.ke/api/store/products
```

### 2. Build and deploy the Next.js frontend

Create `frontend/.env.production` before building:

```env
NEXT_PUBLIC_API_URL=https://api.sysnettechs.co.ke/api
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_WHATSAPP_NUMBER=254700000000
```

The `NEXT_PUBLIC_*` values are embedded at build time, so rebuild after changing
them. Build and prepare the standalone output locally or on the server:

```bash
cd frontend
npm ci
npm run build
cp -R public .next/standalone/
mkdir -p .next/standalone/.next
cp -R .next/static .next/standalone/.next/
```

Upload the contents of `.next/standalone/` to
`/home/CPANEL_USER/sysnettech-web`. The deployed directory should contain
`server.js`, `package.json`, `public/`, `.next/static/` and `.next/server/`.

In cPanel's **Setup Node.js App**, configure:

```text
Node.js version: 22 or newer
Application mode: Production
Application root: sysnettech-web
Application URL: https://sysnettechs.co.ke
Startup file: server.js
```

Add `NODE_ENV=production`, save the application and restart it. Some providers
must enable the Passenger proxy that connects the domain to the Node.js app.

### 3. Configure scheduled and queued work

Find the PHP executable with `which php`, then add a cPanel cron job that runs
Laravel's scheduler every minute:

```cron
* * * * * cd /home/CPANEL_USER/sysnettech-api && /usr/local/bin/php artisan schedule:run >> /dev/null 2>&1
```

If the host supports persistent processes, run the queue worker under its
process manager:

```bash
php artisan queue:work --sleep=3 --tries=3 --backoff=30 --timeout=60
```

Otherwise, process queued mail with a second cron job:

```cron
* * * * * cd /home/CPANEL_USER/sysnettech-api && /usr/local/bin/php artisan queue:work --stop-when-empty --tries=3 >> /dev/null 2>&1
```

The PHP path may instead resemble `/usr/local/bin/ea-php82`; use the path
reported by the hosting account. The scheduler releases expired stock
reservations, removes expired administrator tokens and creates daily backups,
while the queue sends form emails.

### 4. Enable SSL and verify production

Enable AutoSSL and HTTPS redirects for the main, `www` and `api` domains. For
live Pesapal payments, use the production gateway URL and register this IPN:

```text
https://api.sysnettechs.co.ke/api/store/payments/pesapal/ipn
```

After changing backend environment values, run `php artisan config:cache`.
Finally, test the public pages, `/admin`, products, forms, uploads, live chat,
email delivery, cron jobs and payment callbacks. Keep `APP_DEBUG=false` in
production and check `storage/logs/laravel.log` when the API returns an error.

Portfolio documents uploaded in **Admin → Content → Portfolio** are stored in
Laravel's `storage/app/public/portfolio` directory and downloaded through the
API. The `php artisan storage:link` step above is therefore required. The admin
accepts PDF, Word, PowerPoint, Excel and ZIP files up to 20 MB; ensure cPanel's
`upload_max_filesize` and `post_max_size` PHP settings are both at least 20 MB.

If the hosting plan does not support Node.js applications, the frontend cannot
run there in its current form. Use a Node-compatible host or change the frontend
to a fully static export.
