import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";

const navigation = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard },
  { label: "Blogs", to: "/admin/blogs", icon: FileText },
  { label: "Testimonials", to: "/admin/testimonials", icon: MessageSquare },
];

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f4f0e9]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/15 border-t-primary" />
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { loading, user, isAdmin, signOut } = useAdminAuth();

  // Redirects happen in an effect, never during render — otherwise this ships baked into the
  // prerendered HTML as a permanent redirect and can trigger React's "update during render"
  // warning. While loading (including the always-loading prerender pass), fall through to the
  // loading screen below instead.
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/admin/login" });
      return;
    }
    if (!isAdmin) {
      toast.error("Access denied. This account doesn't have admin access.");
      navigate({ to: "/admin/login" });
    }
  }, [loading, user, isAdmin, navigate]);

  if (loading || !user || !isAdmin) {
    return <LoadingScreen />;
  }

  async function handleLogout() {
    await signOut();
    toast.success("Logged out successfully.");
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-[#f4f0e9] text-[#171513]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#13110f] px-5 py-6 text-white transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link to="/admin" className="group" onClick={() => setMobileOpen(false)}>
            <p className="font-display text-xl tracking-tight">Dreamweave</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-primary">
              Admin studio
            </p>
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X className="h-5 w-5 text-white/60" />
          </button>
        </div>

        <nav className="mt-8 space-y-2">
          <p className="mb-3 px-3 text-[10px] uppercase tracking-[0.25em] text-white/35">
            Workspace
          </p>
          {navigation.map(({ label, to, icon: Icon }) => {
            const active = to === "/admin" ? pathname === to : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-white/60 hover:bg-white/8 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 border-t border-white/10 pt-5">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/60 hover:bg-white/8 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            View website
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white/60 hover:bg-white/8 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-black/8 bg-[#f4f0e9]/90 px-5 backdrop-blur-xl sm:px-8">
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3 text-right">
            <div>
              <p className="text-sm font-medium">Admin account</p>
              <p className="text-xs text-black/45">{user.email}</p>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#1b1815] text-sm text-primary">
              {(user.email ?? "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
