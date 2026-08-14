import { createFileRoute, Outlet } from "@tanstack/react-router";

// Pure layout route — TanStack Router's flat file-based routing treats any file matching
// `admin.*` as a child of this route, so this file must render <Outlet/> for those (including
// admin.login) to actually appear. The /admin overview page itself lives in admin.index.tsx.
export const Route = createFileRoute("/admin")({
  component: Outlet,
});
