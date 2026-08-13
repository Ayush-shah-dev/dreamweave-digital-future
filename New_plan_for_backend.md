# Replace mock admin with real Supabase-backed admin (Dreamweave Digital)

## Context

Dreamweave Digital's admin dashboard (blogs + testimonials CMS) currently runs on
`src/lib/mock-auth.ts` (a hardcoded email/password checked against `localStorage`) and
`src/lib/admin-mock.ts` (static in-memory arrays). This needs to become a real backend:
Supabase for auth, Postgres, and image storage, while Hostinger continues to serve only
static files (no Node server). The legacy reference project
(`legacy-estate-nexus`) shows the *shape* of a working Supabase admin (auth context,
CRUD dialogs, RLS policies, storage buckets) but must not be copied directly — it hardcodes
a real Supabase project URL/anon key, a real admin email+password (inserted straight into
`auth.users` via SQL), an Edge Function URL+token, uses React Router (not TanStack Start),
and its migrations never actually contain a `CREATE TABLE public.blogs` /
`public.testimonials` (those tables were hand-created in the Supabase Studio UI, only
`ALTER`/`INSERT` migrations exist) — this project builds them from scratch per the schema
below.

**Key architectural fact discovered during research:** every route in this app is
prerendered to static HTML at build time (`vite.config.ts`: `tanstackStart.prerender.enabled
= true`, `crawlLinks: true`), including the admin routes — there is no separate "SSR mode."
This drives two decisions:

1. **Admin routes** must never crash or leak state during the Node prerender pass (no
   `window`/`localStorage` access outside effects). The correct behavior is: prerendered
   HTML for `/admin/*` always ships as a generic "loading" shell (since `useAdminAuth`'s
   initial state is `loading: true` and the real `getSession()` call only runs in a
   `useEffect`, which never executes in Node) — real auth/redirect logic only takes over
   after client hydration. This satisfies the spec's "no flash of dashboard content" and
   "no prerender crash" requirements for free, with no `vite.config.ts` changes needed.

2. **Public blog content** (`/blog`, `/blog/$slug`) will use a TanStack Start route
   `loader` that calls the new `src/lib/public-content.ts` helpers. Loaders run during the
   build-time prerender pass *and* on client-side navigation. This means: every published
   post gets a real prerendered `index.html` (direct URLs work on Hostinger with zero
   server, matching how every other page here already works and how `crawlLinks` already
   discovers linked pages), SEO stays intact, and the loading/error/empty states the spec
   asks for still show during client-side transitions between blog pages. This was
   confirmed with the user over the client-fetch-only alternative.

The Supabase browser client must be prerender-safe: `createClient()` is called at module
scope, so it must guard `window`/`localStorage` access (`typeof window !== "undefined"`)
so the Node build doesn't throw when the module is imported during prerender or inside a
loader.

## Scope / non-goals

- No Node server added to Hostinger; `nitro: false` stays.
- No public signup; admin account is created manually in Supabase, then inserted into
  `admin_users` via documented SQL.
- No real-estate tables (`properties`, `client_users`, `visitors`, `page_views`, `reviews`,
  `contact_submissions`) — only `admin_users`, `blogs`, `testimonials`.
- No rich HTML/WYSIWYG editor for blog content in this pass — plain textarea (content
  stored as plain text/markdown-ish text), per spec.
- Public site visual design is untouched; only data sources change.

## 1. Dependencies & environment

- `package.json`: add `@supabase/supabase-js` (latest 2.x). No `@supabase/ssr` (not
  needed — this app never does auth-cookie SSR, only a browser client).
- Run `npm install` to update `package-lock.json`. Also run `bun install` if `bun` is
  available on PATH to keep `bun.lock` in sync (best-effort; skip silently if bun isn't
  installed).
- `.env.example`: add
  ```
  VITE_SUPABASE_URL=https://your-project-ref.supabase.co
  VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
  VITE_ADMIN_DEMO_MODE=false
  ```
  (keep the existing `VITE_SITE_URL` line). Document `VITE_SUPABASE_ANON_KEY` as an
  accepted fallback name for the same value, preferring `VITE_SUPABASE_PUBLISHABLE_KEY`.

## 2. Supabase client — `src/integrations/supabase/client.ts` (new)

```ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(url && key);

const isBrowser = typeof window !== "undefined";

export const supabase = isSupabaseConfigured
  ? createClient<Database>(url, key, {
      auth: {
        persistSession: isBrowser,
        autoRefreshToken: isBrowser,
        detectSessionInUrl: isBrowser,
        storage: isBrowser ? window.localStorage : undefined,
      },
    })
  : null;
```

All call sites must null-check `supabase`/`isSupabaseConfigured` rather than assume a
client exists (never a fake client). `src/integrations/supabase/types.ts` (new): hand-written
`Database` type covering `admin_users`, `blogs`, `testimonials` tables (Row/Insert/Update
shapes matching the migration below) — no CLI codegen dependency needed for this pass.

## 3. Database migration — `supabase/migrations/0001_admin_content.sql` (new)

One consolidated migration (this is a fresh Supabase project, no need to mimic the
legacy repo's many incremental files):

- `public.admin_users(user_id uuid PK references auth.users on delete cascade, role text
  not null default 'admin' check (role = 'admin'), created_at timestamptz not null default
  now())`.
- `public.blogs` and `public.testimonials` exactly per the columns/constraints in the
  spec (status check draft/published, rating 1–5, reading_time > 0 or null, slug unique +
  not-empty title check, etc.).
- `public.slugify(text)` + `public.generate_unique_blog_slug(text)` helpers (adapted from
  legacy `20250820123943...sql`, kept as SQL/plpgsql with `SET search_path = public`), plus
  `BEFORE INSERT/UPDATE` triggers on `blogs` so a blank/omitted slug is generated from
  title and edited slugs stay unique — this satisfies "preserve manually edited slugs" and
  "prevent duplicate slugs" without any app-side uniqueness race.
- `public.update_updated_at_column()` trigger function + triggers on `blogs` and
  `testimonials` for `updated_at`.
- `public.is_admin()`: `stable`, `security definer`, `set search_path = public`, returns
  `exists (select 1 from public.admin_users where user_id = auth.uid() and role = 'admin')`.
  Security-definer + explicit search_path avoids the recursive-RLS trap the legacy
  `EXISTS (SELECT ... FROM admin_users)` inline pattern can hit once `admin_users` itself
  has RLS enabled referencing itself.
- RLS enabled on all three tables; policies exactly as specified in section 4 of the
  original brief (anon reads only `status = 'published'`; `is_admin()` gates all writes and
  full reads; no self-service insert into `admin_users`).
- Storage: `insert into storage.buckets (id, name, public) values ('blog-images',
  'blog-images', true), ('testimonial-images', 'testimonial-images', true)`, plus
  `storage.objects` policies — public `SELECT`, `is_admin()`-gated `INSERT/UPDATE/DELETE`,
  matching the legacy `property-images` policies but scoped to the two new buckets and to
  `{bucket}/{auth.uid()}/...` path ownership.

## 4. Data-access layer

- `src/lib/admin-content.ts` (new): `listBlogs/getBlogById/createBlog/updateBlog/
  deleteBlog/publishBlog/unpublishBlog` and the testimonial equivalents, all going through
  `supabase.from("blogs"|"testimonials")`. Used only by admin components (never during
  prerender).
- `src/lib/public-content.ts` (new): `listPublishedBlogs()`, `getPublishedBlogBySlug(slug)`,
  `listFeaturedTestimonials()`. Used by the public blog loader and by the homepage
  testimonials section. Relies on RLS to restrict to published rows (defense in depth: also
  add `.eq("status", "published")` explicitly).
- `src/lib/admin-storage.ts` (new): `validateImageFile`, `uploadBlogImage(file, userId)`,
  `uploadTestimonialImage(file, userId)`, `removeStorageObject(bucket, path)`,
  `getPublicStorageUrl(bucket, path)` — mirrors legacy upload logic but scopes paths as
  `{bucket}/{userId}/{uuid}.{ext}` and validates MIME (`image/jpeg|png|webp`) + 5MB limit
  client-side before upload (storage policies enforce it server-side too).

## 5. Auth — `src/hooks/useAdminAuth.tsx` (new)

Context provider (not a straight copy of legacy `useAuth.tsx`) exposing `user, session,
loading, isAdmin, isConfigured, signIn, signOut, requestPasswordReset,
refreshAdminStatus`. On mount: subscribe to `supabase.auth.onAuthStateChange` *before*
calling `supabase.auth.getSession()` (legacy ordering, avoids missing an early event), guard
every state update with a `mounted` ref to avoid "set state after unmount," and check
`admin_users` (via `is_admin()` RPC or a `select` scoped by RLS) whenever `session.user`
changes. When `isSupabaseConfigured` is false, `loading` resolves to `false` immediately and
`isConfigured` is `false` so the login page can show a configuration-error state instead of
hanging. Mounted in `src/routes/__root.tsx`, wrapping `<Outlet />` for both public and
admin routes (so `Nav.tsx`'s admin button can read auth state too).

## 6. Admin login — `src/components/admin/AdminLogin.tsx`

Replace the mock check with `signIn(email, password)` from `useAdminAuth`. Flow: call
`supabase.auth.signInWithPassword`, on success check `isAdmin`; if not admin, immediately
`supabase.auth.signOut()` + "Access denied" toast and stay on the page; if admin, success
toast + `navigate({ to: "/admin" })`. Forgot password calls
`supabase.auth.resetPasswordForEmail(email, { redirectTo: <origin>/admin/login })` (no
hardcoded Edge Function call, no token) with a generic "if an account exists..." message.
Remove the always-visible demo-credentials block; only render it when
`import.meta.env.DEV && import.meta.env.VITE_ADMIN_DEMO_MODE === "true"`, with a visible
"Demo mode" label — `mock-auth.ts` stops being imported from production paths (may still
export a couple of dev-only constants used solely by this gated block, or be deleted
entirely and the constants inlined — deleting is cleaner and matches "remove mock-auth.ts
from production flow").

## 7. Route protection — `src/components/admin/AdminShell.tsx`

Replace the render-time `if (!isMockAdminLoggedIn()) { navigate(...); return null; }` with
`useAdminAuth()` + a `useEffect` that redirects to `/admin/login` once `loading` is false
and either no user or `!isAdmin` (with an access-denied toast in the latter case). While
`loading`, render a loading screen instead of children — this is also exactly what ships in
the prerendered HTML, so there's no flash. Logout calls `supabase.auth.signOut()` then
navigates to `/`; since the shell re-checks auth on every render via the effect, hitting
`/admin` again after logout (including via back-button) redirects to `/admin/login`, no
extra "prevent back navigation" hack needed. Visual design/markup unchanged.

`src/components/site/Nav.tsx`: swap the always-`/admin/login` link for one that reads
`useAdminAuth()` and points to `/admin` when `isAdmin`, else `/admin/login`; `Footer.tsx`'s
admin link can stay pointed at `/admin/login` (it always resolves correctly either way).

## 8. Blog & testimonial admin CRUD

- `src/components/admin/AdminCollectionPage.tsx`: replace `MOCK_BLOGS`/`MOCK_TESTIMONIALS`
  with `useQuery` (react-query is already wired via `QueryClientProvider` in `__root.tsx`)
  calling `listBlogs()`/`listTestimonials()`; add search (title/category/slug or
  name/designation/company/quote), a status filter, loading/error/empty states, and a
  delete-confirmation flow (reuse the existing card/table markup, just data-driven).
- `src/components/admin/AdminEditorPage.tsx`: real form state per the field lists in the
  spec (blogs: title, slug, short_summary, content, category, author_name, reading_time,
  featured_image, seo_title, seo_description, status, published_date; testimonials: name,
  designation, company, quote, profile_image, rating, status, featured, display_order),
  wired to `createBlog/updateBlog` + `uploadBlogImage` (and testimonial equivalents), with
  client-side validation matching the spec's rules and Save-draft/Publish/Unpublish/Delete/
  Cancel actions.
- The four thin route files (`admin.blogs.tsx`, `admin.blogs.new.tsx`,
  `admin.blogs.$id.edit.tsx`, and the testimonial equivalents) stay structurally the same,
  just pass real `id` params through to the editor/collection components.
- `src/components/admin/AdminOverview.tsx`: replace the mock counts with a `useQuery` that
  derives published/draft blog counts, testimonial count, featured count, and "latest
  blogs/testimonials" lists from the same data-access layer, with skeleton/error/empty
  states; visual layout unchanged.

## 9. Public site integration

- `src/routes/blog.tsx`: add a `loader: () => listPublishedBlogs()` (falls back to the
  existing static `POSTS` data when `!isSupabaseConfigured`, so local dev without a
  Supabase project still shows content) and render real posts with existing category-filter
  UI/styling; loading state = TanStack Router's pending element, error state = route
  `errorComponent`, empty state = friendly "no posts yet" panel.
- `src/routes/blog.$slug.tsx` (new): `loader: ({ params }) => getPublishedBlogBySlug(params.slug)`,
  throwing/`notFound()` for missing or unpublished slugs (renders the existing `NotFound`
  component); shows title/category/author/date/reading time/cover image/content plus a
  small "related posts" strip and back-to-blog link, styled consistently with the rest of
  the site (glass-panel/Section primitives already in `src/components/site/Sections.tsx`).
- Homepage testimonials (`src/routes/index.tsx`'s `TESTIMONIALS` marquee) and `src/lib/
  site.ts`: add a loader (or a `useQuery`, since this section is decorative rather than the
  page's primary content) calling `listFeaturedTestimonials()`, ordered by `display_order`,
  falling back to the existing static `TESTIMONIALS` array when Supabase isn't configured —
  same marquee/animation markup, just swap the data source.
- `public/.htaccess`, `vite.config.ts`'s `pages` array, `scripts/pack-hostinger.mjs`: no
  changes required — `crawlLinks: true` already means the build discovers `/blog/$slug`
  URLs from the links rendered on the prerendered `/blog` listing page, the same mechanism
  that already prerenders every other static route here.

## 10. Cleanup

- Delete `src/lib/admin-mock.ts` and `src/lib/mock-auth.ts` once nothing references them
  (or keep a trimmed dev-only demo-credentials export from `mock-auth.ts` if that reads
  cleaner than inlining — final call made during implementation, but production code paths
  must not import either for auth/data).

## 11. Docs

- `supabase/README.md` (new): the 13-step setup checklist from the spec (create project →
  env vars → apply migration → create admin user in Supabase Studio → grab UUID → `insert
  into public.admin_users (user_id, role) values ('...', 'admin');` → configure redirect
  URLs for local + Hostinger origins → verify storage buckets → test RLS as anon/non-admin/
  admin → `npm run build` → upload `dist/client` to Hostinger). No real credentials in the
  doc.
- Update `.env.example`, `README.md`, `DEPLOY.md` with a short "Hostinger serves the static
  frontend; Supabase provides auth/DB/storage; the publishable key is browser-safe only
  because RLS enforces access; never put a service-role key in frontend code" note.

## Verification

1. `npm run build` — must succeed with **and** without `VITE_SUPABASE_URL`/
   `VITE_SUPABASE_PUBLISHABLE_KEY` set (simulates a Supabase-less static build not
   crashing), producing prerendered HTML for `/`, `/admin/login`, `/admin`, `/admin/blogs`,
   `/admin/blogs/new`, `/admin/testimonials`, `/admin/testimonials/new`, `/blog`, and (when
   configured against a real project with published rows) `/blog/<slug>`.
2. `rg -n "service_role|SUPABASE_SERVICE_ROLE|secret|password-reset" src public dist` (after
   a build) — confirm nothing beyond the publishable-key variable names appears, and no
   hardcoded legacy project URL/JWT/password shows up anywhere in `src` or `dist`.
3. Manual pass through the spec's testing checklist (section 17): login success/failure/
   non-admin-denied/session-persists-on-refresh/logout/redirect-after-logout, blog & testimonial
   CRUD incl. image upload validation (type/size), public site shows only published content,
   RLS spot-checked with the anon key, a non-admin authenticated key, and the admin session.
