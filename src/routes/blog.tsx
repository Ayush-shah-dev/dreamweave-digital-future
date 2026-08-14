import { createFileRoute, Outlet } from "@tanstack/react-router";

// Pure layout route — blog.$slug is a child of this route in TanStack Router's flat file-based
// routing, so this must render <Outlet/> for it to appear (otherwise every /blog/<slug> page
// renders the blog listing instead of the post). The listing itself lives in blog.index.tsx —
// deliberately not sharing a loader with this layout, so viewing a single post doesn't also
// re-fetch the full blog list.
export const Route = createFileRoute("/blog")({
  component: Outlet,
});
