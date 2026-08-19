# Deploying to Hostinger (shared hosting)

The site builds to plain static files — every page is prerendered to HTML at build time, there is
no Node process to run. That makes it a straight fit for a Hostinger **shared hosting** plan, where
you only get Apache/LiteSpeed serving files out of `public_html`.

## 1. Build

```sh
npm install
npm run deploy:hostinger
```

That runs the production build and packs it into **`dist/dreamweave-site.zip`**.

If the live domain is not `dreamweavedigitalinfluencers.com`, set the origin first so `sitemap.xml` contains the
right absolute URLs (copy `.env.example` to `.env` and edit it, or set the variable inline):

```sh
# .env
VITE_SITE_URL=https://yourdomain.com
```

Also update the `Sitemap:` line in [public/robots.txt](public/robots.txt) to match.

## 2. Check it locally before uploading

```sh
npm run preview:static
```

Serves `dist/client` at http://localhost:4173 exactly the way the server will: extensionless URLs,
no SSR, `404.html` for unknown paths. What you see here is what goes live.

## 3. Upload

**hPanel File Manager (simplest)**

1. hPanel → **Files → File Manager** → open `public_html`.
2. Delete whatever is already in there (a fresh Hostinger account has a `default.php` placeholder).
3. Upload `dist/dreamweave-site.zip`.
4. Right-click the uploaded zip → **Extract** → extract into `public_html`.
5. Delete the zip.

`public_html` should now contain `index.html`, `.htaccess`, `404.html`, `robots.txt`,
`sitemap.xml`, `assets/`, and one folder per page (`about/`, `services/`, …).

> The File Manager hides dotfiles by default — turn on **Settings → Show hidden files** to confirm
> `.htaccess` made it. The site still loads without it, but pretty URLs, HTTPS redirects, caching
> and the 404 page all depend on it.

**FTP alternative**

Use the FTP account from hPanel → **Files → FTP Accounts** and upload the *contents* of
`dist/client` (not the folder itself) into `public_html`. Make sure your FTP client is set to show
and transfer hidden files so `.htaccess` is included.

## 4. Domain and HTTPS

1. hPanel → **Domains** — point the domain at this hosting plan (or update nameservers if the
   domain is registered elsewhere).
2. hPanel → **Security → SSL** — install the free SSL certificate and turn on **Force HTTPS**.
   The `.htaccess` also redirects to HTTPS, so either path is covered.

## 5. Redeploying after changes

Run `npm run deploy:hostinger` again and re-upload. Since page HTML is served with
`must-revalidate` and assets are content-hashed, visitors pick up the new build immediately without
a cache purge.

## What's in the build

| Path | What it is |
| --- | --- |
| `index.html`, `about/index.html`, … | Prerendered HTML for every route — full content in the source, so crawlers see it without running JS |
| `assets/*` | Hashed JS/CSS/images, cached for a year by `.htaccess` |
| `404.html` | Prerendered not-found page, wired up via `ErrorDocument 404` |
| `sitemap.xml` | Generated from [src/routes/sitemap[.]xml.ts](src/routes/sitemap%5B.%5D.xml.ts) at build time |
| `.htaccess` | Pretty URLs, HTTPS redirect, compression, cache headers, security headers |

## Admin studio & Supabase

The `/admin` dashboard (blogs and testimonials) is not a Hostinger backend — it's a static
page that talks directly to Supabase from the browser for auth, data and image storage. Set
`VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env` **before** running
`npm run build` (they're baked into the build like `VITE_SITE_URL`). The publishable key is
safe to ship in the bundle — access is enforced by Postgres Row Level Security, never by
keeping that key secret. A service-role/secret key must never be added to this project's
frontend code or environment files. See [`supabase/README.md`](supabase/README.md) for the
full project setup (migration, admin user, storage buckets).

## Notes and limits

- **No backend.** All forms (contact, apply, book-campaign, footer) validate in the browser and
  hand off to WhatsApp — nothing is posted to a server. If you later want emailed form submissions,
  that needs either a form service (Formspree, Web3Forms) or a PHP handler in `public_html`; the
  static build can't do it alone.
- **Serving from a subfolder** (e.g. `public_html/site/`) is not configured — the build assumes it
  sits at the document root. Use a subdomain with its own document root instead.
- **Don't upload `dist/server/`.** It's the build-time renderer used to produce the HTML and has no
  role on shared hosting.
- Hostinger's Node.js hosting (VPS/Cloud plans) isn't needed here, and switching to it would mean
  re-enabling the nitro server build in [vite.config.ts](vite.config.ts).
