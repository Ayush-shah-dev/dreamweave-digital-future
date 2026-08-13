import { createFileRoute } from "@tanstack/react-router";

import { NotFound } from "@/components/site/NotFound";

// Prerendered to /404.html and served by Apache/LiteSpeed via `ErrorDocument 404` (see
// public/.htaccess) so unknown URLs get the branded page with a real 404 status code.
export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [
      { title: "Page not found — Dreamweave Digital" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotFound,
});
