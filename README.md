# Dreamweave Digital

Marketing site and content admin for Dreamweave Digital, built with TanStack Start,
React and Vite. Every page is prerendered to static HTML at build time.

## Architecture

- **Hostinger** (shared hosting) serves only the static build output — `dist/client` — via
  Apache/LiteSpeed. There is no Node server in production.
- **Supabase** provides everything dynamic behind that static frontend: admin
  authentication, the Postgres database for blogs/testimonials, and image storage. The
  browser talks to Supabase directly with a publishable key; access is enforced by
  Postgres Row Level Security, not by keeping that key secret. See
  [`supabase/README.md`](supabase/README.md) for full setup, and
  [`.env.example`](.env.example) for the required environment variables.
- Public pages (`/`, `/blog`, `/blog/$slug`, …) render published content only. The admin
  studio (`/admin/*`) is a client-authenticated dashboard for managing blogs and
  testimonials — see [`src/hooks/useAdminAuth.tsx`](src/hooks/useAdminAuth.tsx).

## Local development

```sh
npm install
cp .env.example .env   # fill in VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY
npm run dev
```

Without Supabase configured, public pages fall back to static placeholder content and
`/admin/login` shows a configuration notice instead of crashing.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build (prerendered static site) |
| `npm run deploy:hostinger` | Build, then zip `dist/client` for Hostinger's File Manager |
| `npm run preview:static` | Serve the built `dist/client` locally the way Hostinger will |
| `npm run lint` / `npm run format` | Lint / format |

## Deploying

See [`DEPLOY.md`](DEPLOY.md) for uploading to Hostinger, and
[`supabase/README.md`](supabase/README.md) for the Supabase project setup (database
migration, admin user creation, storage buckets, RLS).
