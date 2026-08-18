import { createFileRoute } from "@tanstack/react-router";
import { AdminLeads } from "@/components/admin/AdminLeads";
import { AdminShell } from "@/components/admin/AdminShell";

// Leaf route (no children), same shape as admin.index.tsx — blogs/testimonials get their own
// layout + Outlet because they have /new and /$id/edit children; leads has neither.
export const Route = createFileRoute("/admin/leads")({
  component: AdminLeadsRoute,
});

function AdminLeadsRoute() {
  return (
    <AdminShell>
      <AdminLeads />
    </AdminShell>
  );
}
