# ZhimiRy

ZhimiRy helps people recycle smarter by using AI to identify materials and suggest proper disposal. This repo is an npm workspaces monorepo: a **Next.js 14** frontend, an **Express + TypeScript** backend, **PostgreSQL** via Prisma, **JWT** auth (tokens in `localStorage`), and optional **Google Gemini** + **Supabase Storage** for scans.

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 9+ (workspaces)
- **PostgreSQL** 14+ running locally (or a hosted URL such as Supabase)

## Clone and install

```bash
git clone https://github.com/YOUR_ORG/zhimiry.git
cd zhimiry
npm install
```

The first time you run the app, build the shared TypeScript package (the backend and tooling expect `packages/shared/dist`):

```bash
npm run build -w @zhimiry/shared
```

Apply the database schema (from the repo root, with `DATABASE_URL` set in `backend/.env`—see below):

```bash
cd backend && npx prisma db push && cd ..
```

## Environment variables

### Backend — `backend/.env`

Create `backend/.env` (it is gitignored). Use this checklist:

| Variable | Required for | Description |
|----------|----------------|-------------|
| `DATABASE_URL` | Always | PostgreSQL connection string, e.g. `postgresql://USER:PASSWORD@localhost:5432/zhimirydb` |
| `JWT_SECRET` | Auth | Long random string used to sign and verify JWTs |
| `JWT_EXPIRES_IN` | Auth | Token lifetime (default `7d` if omitted) |
| `PORT` | Optional | API port (defaults to **4001** if unset) |
| `FRONTEND_URL` | CORS | Origin allowed by the API, e.g. `http://localhost:3000` |
| `GEMINI_API_KEY` | AI scans | Google AI Studio / Gemini API key |
| `SUPABASE_URL` | Image uploads | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Image uploads | Supabase service role key (server only; never expose to the browser) |
| `REDIS_URL` | Optional | Reserved for future caching; can be empty |

**Registration and login** work with only `DATABASE_URL`, `JWT_SECRET`, and `FRONTEND_URL`. **Scan uploads** need valid Gemini and Supabase values and a public Supabase Storage bucket named `scan-images` (as in the project blueprint).

Keep **`NEXT_PUBLIC_API_URL` on the frontend** in sync with **`PORT` on the backend** (same host and port, e.g. `http://localhost:4001`).

### Frontend — `frontend/.env.local`

Create `frontend/.env.local` (gitignored). Example:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes for local API | Base URL of the Express server, e.g. `http://localhost:4001` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Optional | Used when you implement the recycling map page |

If you omit `NEXT_PUBLIC_API_URL`, the app falls back to `http://localhost:4001` in code—still ensure that matches your backend `PORT`.

## Run locally (frontend + backend together)

From the **repository root**:

```bash
npm run dev
```

This builds `@zhimiry/shared`, then starts the Next.js app (usually [http://localhost:3000](http://localhost:3000)) and the API (port from `backend/.env` or default **4001**).

## Run locally (backend and frontend separately)

Use two terminals, both from the **repository root** after `npm install` and a one-time shared build.

**Terminal 1 — shared (once per clone or after changing shared types):**

```bash
npm run build -w @zhimiry/shared
```

**Terminal 1 — backend:**

```bash
npm run dev -w backend
```

**Terminal 2 — frontend:**

```bash
npm run dev -w frontend
```

If you change only the frontend, you do not need to rebuild shared. If you change `packages/shared`, run `npm run build -w @zhimiry/shared` again before relying on the backend or frontend.

## Production-style build

From the repo root:

```bash
npm run build
```

Then start the backend with `npm run start -w backend` (after `DATABASE_URL` and migrations/`db push` are correct) and the frontend with `npm run start -w frontend`.

## Docker

With Docker Engine and Compose v2:

```bash
npm run docker:up
```

Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `GEMINI_API_KEY` in your shell or a root `.env` file when Compose substitutes variables for the backend service. Point `NEXT_PUBLIC_API_URL` at the port the API exposes on the host (Compose maps **4001** by default).

## Project layout

- `frontend/` — Next.js App Router UI
- `backend/` — Express API and Prisma schema
- `packages/shared/` — Shared TypeScript types consumed by both apps
