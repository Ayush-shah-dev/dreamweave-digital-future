import { createFileRoute, Outlet } from "@tanstack/react-router";

// Pure layout route — admin.blogs.new and admin.blogs.$id.edit are children of this route in
// TanStack Router's flat file-based routing, so this must render <Outlet/> for them to appear.
// The /admin/blogs list itself lives in admin.blogs.index.tsx.
export const Route = createFileRoute("/admin/blogs")({
  component: Outlet,
});
