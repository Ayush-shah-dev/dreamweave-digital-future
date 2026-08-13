import { createFileRoute } from "@tanstack/react-router";
import { AdminEditorPage } from "@/components/admin/AdminEditorPage";
import { AdminShell } from "@/components/admin/AdminShell";
export const Route = createFileRoute("/admin/testimonials/new")({
  component: () => (
    <AdminShell>
      <AdminEditorPage kind="testimonial" id={undefined} />
    </AdminShell>
  ),
});
