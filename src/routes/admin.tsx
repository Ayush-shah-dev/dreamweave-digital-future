import { createFileRoute } from "@tanstack/react-router";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  component: AdminRoute,
});

function AdminRoute() {
  return (
    <AdminShell>
      <AdminOverview />
    </AdminShell>
  );
}
