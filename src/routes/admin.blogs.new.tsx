import { createFileRoute } from "@tanstack/react-router";
import { AdminEditorPage } from "@/components/admin/AdminEditorPage";
import { AdminShell } from "@/components/admin/AdminShell";
export const Route = createFileRoute("/admin/blogs/new")({
  component: () => (
    <AdminShell>
      <AdminEditorPage kind="blog" id={undefined} />
    </AdminShell>
  ),
});
