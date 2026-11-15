# OPOT Website Backend

Node.js + Express + TypeScript + PostgreSQL + TypeORM backend.

## Setup (local, using Docker Postgres)
1. Install Node.js 20+ and Docker Desktop.
2. Copy `.env.example` to `.env`; keep `DATABASE_URL=postgres://postgres:password@localhost:5432/opot_website` for local Docker.
3. Run `npm install`.
4. Run `npm run migration:run` once (and after pulling new migrations).
5. Run `npm run dev` — it starts Docker Desktop if needed, starts the `opot-postgres` container, waits until it is healthy, then starts the API.

DB helper scripts: `npm run db:up` (start DB only), `npm run db:down` (stop, keeps data), `npm run db:reset` (wipe all data and restart), `npm run db:logs`.

Build with `npm run build`; run production with `npm start`.

TypeORM `synchronize` is disabled. Generate and run migrations before use:
`npm run migration:generate` then `npm run migration:run`.

## Routes
Public: GET `/api/v1/health`, `/site`, `/sections`, `/projects`, `/testimonials`, `/curriculum`; POST `/enquiries`.
Auth: POST `/auth/setup-admin` (one-time; remove/disable before deployment), POST `/auth/login`.
Admin JWT: CRUD `/admin/sections`, `/admin/projects`, `/admin/testimonials`, `/admin/curriculum`; GET/PUT `/admin/site-settings`; GET `/admin/enquiries`; PATCH `/admin/enquiries/:id`; GET `/admin/media/signature`.

Section-specific content is stored as JSONB so the CMS can manage hero, about, programs, services, classes, curriculum, showcase, testimonials, collaboration, contact and footer without hardcoding website content. Admin routes require a valid JWT and admin role. All credentials in `.env.example` are placeholders.
