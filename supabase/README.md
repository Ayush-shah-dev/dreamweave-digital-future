# Supabase setup — Dreamweave Digital admin CMS

Hostinger only serves the built static frontend (`dist/client`) — there is no Node server.
Supabase provides everything dynamic: admin authentication, the blogs/testimonials
database, and image storage. The browser talks to Supabase directly using a
publishable key that is safe to ship in the frontend bundle, because access control is
enforced by Postgres Row Level Security (RLS), not by keeping that key secret.

**Never** put a service-role key, database password, or any other secret/admin API key in
frontend code, `.env`, or a committed file. Only these two values belong in the frontend:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (older projects call this the "anon" key —
  `VITE_SUPABASE_ANON_KEY` is accepted as a fallback)

## 1. Create a Supabase project

[supabase.com/dashboard](https://supabase.com/dashboard) → New project.

## 2. Copy the project URL and publishable key

Project Settings → API. Copy the **Project URL** and the **anon / publishable** key (not
`service_role`).

## 3. Copy the publishable key

(Same screen as above — listed separately here to match the setup checklist.)

## 4. Add environment variables

Copy `.env.example` to `.env` in the project root and fill in:

```sh
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_ADMIN_DEMO_MODE=false
```

## 5. Apply the migrations

Using the Supabase CLI (recommended):

```sh
supabase link --project-ref your-project-ref
supabase db push
```

Or paste the contents of each file, in order, into the Supabase Studio SQL editor and run it:

1. [`supabase/migrations/0001_admin_content.sql`](migrations/0001_admin_content.sql) —
   creates `admin_users`, `blogs`, `testimonials`, the `is_admin()` function, all RLS
   policies, and the `blog-images` / `testimonial-images` storage buckets.
2. [`supabase/migrations/0002_leads.sql`](migrations/0002_leads.sql) — creates
   `form_submissions` (Contact / Apply as Creator / Book Campaign leads) and
   `newsletter_subscribers`, both admin-only to read, publicly insertable so the site's
   forms can write to them without a session. Shown on the admin dashboard's Leads page.

## 6. Create the admin user in Supabase Authentication

Authentication → Users → **Add user** (email + password). There is no public sign-up in
this app — admin accounts are always created here, manually.

## 7. Retrieve the admin user's UUID

Copy the `id` column value for the user you just created (Authentication → Users, or
`select id from auth.users where email = 'you@example.com';` in the SQL editor).

## 8. Insert the user into `public.admin_users`

Run in the SQL editor (replace the UUID):

```sql
insert into public.admin_users (user_id, role)
values ('AUTH_USER_UUID_HERE', 'admin');
```

A Supabase Auth account alone does **not** grant admin access — this row is what does.
Without it, `/admin/login` will sign the account in and then immediately sign it back out
with an "access denied" message.

## 9. Configure Auth redirect URLs

Authentication → URL Configuration → **Redirect URLs**, add:

- `http://localhost:3000/admin/login` (or whatever port `npm run dev` uses locally)
- `https://yourdomain.com/admin/login` (the production Hostinger origin)

This is required for the "forgot password" email link to land back on the login page.

## 10. Create or verify storage buckets

The migration creates `blog-images` and `testimonial-images` (public read, 5MB limit,
JPEG/PNG/WebP only). Storage → Buckets in Supabase Studio to confirm both exist.

## 11. Test RLS policies

In Supabase Studio's SQL editor, or with three separate `supabase-js` clients:

- **Anonymous** (no session): can `select` only `status = 'published'` rows from `blogs`
  and `testimonials`; cannot read `admin_users`; cannot insert/update/delete anything.
- **Authenticated, not in `admin_users`**: same read access as anonymous; still cannot
  write, still cannot read drafts or `admin_users`.
- **Authenticated admin** (in `admin_users`): full read/write on `blogs` and
  `testimonials`; can read their own `admin_users` row; can upload/replace/delete files in
  both storage buckets.

## 12. Build the application

```sh
npm install
npm run build
```

The build must succeed even without `.env` present (it just means Supabase-backed pages
fall back to a "not configured" or static-fallback state instead of crashing).

## 13. Upload `dist/client` contents to Hostinger `public_html`

See [`DEPLOY.md`](../DEPLOY.md) for the full Hostinger upload steps — this project's
`npm run deploy:hostinger` script builds and zips `dist/client` for you.

---

### Why the schema looks like this

- `admin_users` is a separate authorization table, not a role on the Supabase Auth user —
  so granting/revoking admin access is one SQL statement (step 8) and never requires
  touching Supabase Auth itself.
- `is_admin()` is `SECURITY DEFINER` so RLS policies can call it without triggering a
  recursive RLS check on `admin_users` (a plain, non-definer function calling back into a
  table that is itself RLS-protected by that same function would deadlock).
- Blog slugs are generated/deduplicated by a Postgres trigger, not application code, so two
  admins creating "My Post" at the same time can never collide.
