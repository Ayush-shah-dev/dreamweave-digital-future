import { createFileRoute } from "@tanstack/react-router";
import { AdminCollectionPage } from "@/components/admin/AdminCollectionPage";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/testimonials")({
  component: AdminTestimonialsRoute,
});

function AdminTestimonialsRoute() {
  return <AdminShell><AdminCollectionPage collection="testimonials" /></AdminShell>;
}
