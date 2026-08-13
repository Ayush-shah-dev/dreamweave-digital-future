import { createFileRoute } from "@tanstack/react-router";
import { AdminEditorPage } from "@/components/admin/AdminEditorPage";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/testimonials/$id/edit")({
  component: AdminTestimonialEditRoute,
});

function AdminTestimonialEditRoute() {
  const { id } = Route.useParams();
  return (
    <AdminShell>
      <AdminEditorPage kind="testimonial" id={id} />
    </AdminShell>
  );
}
