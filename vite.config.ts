// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Every route on this site is static (forms are client-side and hand off to WhatsApp), so the
// build prerenders each page to plain HTML and `nitro: false` skips the server bundle a host
// like Cloudflare/Vercel would need. `dist/client` is then the entire site — upload its contents
// to public_html on Hostinger shared hosting. See DEPLOY.md.
export default defineConfig({
  nitro: false,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // The prerenderer runs against this during the build; nothing is deployed from it.
    server: { entry: "server" },
    // Static routes are discovered from the route tree; crawlLinks picks up anything linked
    // from a prerendered page that discovery missed.
    prerender: {
      enabled: true,
      crawlLinks: true,
      // /about -> /about/index.html, so Apache/LiteSpeed serves it at the extensionless URL.
      autoSubfolderIndex: true,
      failOnError: true,
    },
    // Flat files: sitemap.xml and 404.html sit at the document root, where robots and
    // `ErrorDocument 404` expect them, rather than in a subfolder.
    pages: [
      { path: "/sitemap.xml", prerender: { enabled: true, autoSubfolderIndex: false } },
      { path: "/404", prerender: { enabled: true, outputPath: "/404.html" } },
    ],
  },
});
