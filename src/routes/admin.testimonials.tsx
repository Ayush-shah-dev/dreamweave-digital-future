import { createFileRoute, Outlet } from "@tanstack/react-router";

// Pure layout route — admin.testimonials.new and admin.testimonials.$id.edit are children of
// this route in TanStack Router's flat file-based routing, so this must render <Outlet/> for
// them to appear. The /admin/testimonials list itself lives in admin.testimonials.index.tsx.
export const Route = createFileRoute("/admin/testimonials")({
  component: Outlet,
});
