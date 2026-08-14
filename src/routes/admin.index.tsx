import { createFileRoute } from "@tanstack/react-router";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/")({
  component: AdminIndexRoute,
});

function AdminIndexRoute() {
  return (
    <AdminShell>
      <AdminOverview />
    </AdminShell>
  );
}
