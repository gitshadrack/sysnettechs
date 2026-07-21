# Sysnettech Solutions Ltd

Production-oriented corporate website and content API for **Sysnettech Solutions Ltd**, built as a small monorepo.

## Architecture

- `frontend/` — Next.js 15, React 19, TypeScript, Tailwind CSS and Framer Motion
- `backend/` — Laravel 12 REST API, Sanctum authentication and MySQL
- `docker-compose.yml` — frontend, PHP-FPM API, Nginx and MySQL

The public site includes every requested route, dark mode, sticky mega navigation, mobile navigation, animated statistics, portfolio filters, live-chat and WhatsApp entry points, forms, newsletter UI, FAQ, cookie consent, schema markup, sitemap, robots rules, analytics hook and generated company-profile PDF.

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

Open `http://localhost:3000`. The admin dashboard is at `/admin`; API tokens are held in session storage and sent as Sanctum bearer tokens.

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

Authenticated `/api/admin/*` endpoints manage content, enquiries, media, users, analytics and backups. Content types cover services, projects, products, posts, testimonials, team, careers, FAQs and settings.

## Production checklist

1. Replace placeholder phone, WhatsApp and map coordinates in `frontend/lib/data.ts` and environment values.
2. Set `APP_ENV=production`, `APP_DEBUG=false`, strong database/admin passwords and an HTTPS `APP_URL`.
3. Set `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_WHATSAPP_NUMBER` before the frontend build.
4. Configure SMTP, object storage and off-site backup retention.
5. Put the containers behind an SSL-terminating reverse proxy and enable HSTS.
6. Run `php artisan config:cache`, `route:cache`, `view:cache`, and schedule `php artisan schedule:run` every minute.
7. Replace seeded/demo copy and role placeholders with approved company content before launch.

## Quality checks

```bash
cd frontend && npm run typecheck && npm run build
cd backend && php artisan test
```

The custom hero artwork was generated specifically for this project and is stored at `frontend/public/images/hero-ict.png`.
