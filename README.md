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
