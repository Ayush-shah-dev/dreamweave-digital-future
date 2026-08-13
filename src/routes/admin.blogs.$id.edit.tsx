import { createFileRoute } from "@tanstack/react-router";
import { AdminEditorPage } from "@/components/admin/AdminEditorPage";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/blogs/$id/edit")({ component: AdminBlogEditRoute });

function AdminBlogEditRoute() {
  const { id } = Route.useParams();
  return (
    <AdminShell>
      <AdminEditorPage kind="blog" id={id} />
    </AdminShell>
  );
}
