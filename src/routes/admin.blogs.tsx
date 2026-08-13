import { createFileRoute } from "@tanstack/react-router";
import { AdminCollectionPage } from "@/components/admin/AdminCollectionPage";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/blogs")({
  component: AdminBlogsRoute,
});

function AdminBlogsRoute() {
  return <AdminShell><AdminCollectionPage collection="blogs" /></AdminShell>;
}
