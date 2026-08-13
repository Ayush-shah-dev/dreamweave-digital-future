import { Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const DEMO_MODE_ENABLED = import.meta.env.DEV && import.meta.env["VITE_ADMIN_DEMO_MODE"] === "true";
const DEMO_EMAIL = "admin@dreamweave.test";
const DEMO_PASSWORD = "Dreamweave123!";

export function AdminLogin() {
  const { loading, user, isAdmin, isConfigured, signIn, requestPasswordReset } = useAdminAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already an authenticated admin — bounce to the dashboard. Runs in an effect, not during
  // render, so this component still renders once (avoiding a render-time navigate()).
  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate({ to: "/admin" });
    }
  }, [loading, user, isAdmin, navigate]);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isConfigured) {
      toast.error(
        "Admin login isn't configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
      );
      return;
    }
    if (!email.trim() || !password) {
      toast.error("Enter your email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await signIn(email.trim(), password);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (!result.isAdmin) {
        toast.error("Access denied. This account doesn't have admin access.");
        return;
      }
      toast.success("Logged in successfully. Welcome to the admin studio.");
      navigate({ to: "/admin" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isConfigured) {
      toast.error("Admin login isn't configured yet.");
      return;
    }
    if (!email.trim()) {
      toast.error("Enter your email address.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await requestPasswordReset(email.trim());
      if (result.error) {
        toast.error(result.error);
        return;
      }
      // Deliberately generic — never confirms or denies whether the address has an account.
      toast.success("If an account exists for that email, a reset link is on its way.");
      setMode("login");
    } finally {
      setSubmitting(false);
    }
  }

  // Still resolving the initial session — render nothing rather than flash the form.
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4f0e9]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/15 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden bg-[#13110f] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <p className="font-display text-2xl">Dreamweave</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-primary">Admin studio</p>
        </div>
        <div className="relative max-w-lg">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Behind the scenes</p>
          <h1 className="mt-5 font-display text-6xl leading-[0.95]">
            Shape the stories people remember.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/50">
            A quiet workspace for the blogs, testimonials, and campaign stories behind every frame.
          </p>
        </div>
        <p className="relative text-xs text-white/35">Content workspace · Dreamweave Digital</p>
      </div>

      <div className="flex min-h-screen items-center justify-center bg-[#f4f0e9] px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to website
          </Link>

          <div className="mt-12">
            <p className="text-xs uppercase tracking-[0.25em] text-primary">Private access</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">
              {mode === "login" ? "Welcome back." : "Reset your password."}
            </h2>
            <p className="mt-3 text-sm leading-6 text-black/50">
              {mode === "login"
                ? "Sign in to manage Dreamweave content."
                : "Enter your email and we'll send a reset link if an account exists."}
            </p>
          </div>

          {!isConfigured && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">Admin login isn't configured</p>
                <p className="mt-1 text-xs leading-5 text-amber-900/80">
                  Set <span className="font-mono">VITE_SUPABASE_URL</span> and{" "}
                  <span className="font-mono">VITE_SUPABASE_PUBLISHABLE_KEY</span>. See
                  supabase/README.md.
                </p>
              </div>
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleSignIn} className="mt-8 space-y-5">
              <label className="block text-sm font-medium">
                Email address
                <span className="relative mt-2 block">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    required
                    placeholder="admin@dreamweave.digital"
                    className="h-12 w-full rounded-xl border border-black/10 bg-white/70 pl-10 pr-4 text-sm outline-none focus:border-primary"
                  />
                </span>
              </label>
              <label className="block text-sm font-medium">
                Password
                <span className="relative mt-2 block">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-black/10 bg-white/70 px-10 text-sm outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/35 hover:text-primary"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>
              <div className="flex items-center justify-end text-xs">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="h-12 w-full rounded-xl bg-[#1b1815] text-sm font-medium text-white transition hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Signing in…" : "Sign in"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="mt-8 space-y-5">
              <label className="block text-sm font-medium">
                Email address
                <span className="relative mt-2 block">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    required
                    placeholder="admin@dreamweave.digital"
                    className="h-12 w-full rounded-xl border border-black/10 bg-white/70 pl-10 pr-4 text-sm outline-none focus:border-primary"
                  />
                </span>
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="h-12 w-full rounded-xl bg-[#1b1815] text-sm font-medium text-white transition hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send reset link"}
              </button>
              <button
                type="button"
                onClick={() => setMode("login")}
                className="flex w-full items-center justify-center gap-1.5 text-xs text-black/50 hover:text-primary"
              >
                <ArrowLeft className="h-3 w-3" /> Back to sign in
              </button>
            </form>
          )}

          {DEMO_MODE_ENABLED && (
            <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs leading-5 text-black/55">
              <p className="flex items-center gap-2 font-semibold text-black/75">
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-primary">
                  Demo mode
                </span>
                Local development only
              </p>
              <p className="mt-1">
                Email: <span className="font-mono text-black/75">{DEMO_EMAIL}</span>
              </p>
              <p>
                Password: <span className="font-mono text-black/75">{DEMO_PASSWORD}</span>
              </p>
              <p className="mt-2 text-black/40">
                These credentials only work if you've created a matching Supabase user and
                admin_users row — this panel never grants access on its own.
              </p>
            </div>
          )}

          <p className="mt-8 text-center text-xs text-black/35">
            Admin access is restricted to authorized Dreamweave users.
          </p>
        </div>
      </div>
    </div>
  );
}
