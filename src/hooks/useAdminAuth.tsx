import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

// Skips the /admin/login redirect entirely so the dashboard shell renders without a real
// Supabase session. Same safety gate as AdminLogin's DEMO_MODE_ENABLED: `import.meta.env.DEV`
// is only ever true under `vite dev`, never in a production build, so this can't ship live no
// matter how the env var is set.
//
// This does NOT bypass Postgres Row Level Security — RLS is enforced server-side and has no
// client-side switch. With this on but no real signed-in admin, every admin-only table
// (form_submissions, newsletter_subscribers, draft blogs/testimonials) reads back as empty —
// RLS silently filters rows a caller can't see rather than erroring — not because there's no
// data, but because there's no real session to prove admin access. Use this to check the UI
// renders; sign in with a real admin account (supabase/README.md steps 6-8) to see real data.
const DEV_BYPASS_ENABLED =
  import.meta.env.DEV && import.meta.env["VITE_ADMIN_DEV_BYPASS"] === "true";

interface SignInResult {
  /** Human-readable error, or null on success. */
  error: string | null;
  isAdmin: boolean;
}

interface AdminAuthContextValue {
  user: User | null;
  session: Session | null;
  /** True until the initial session check (and admin lookup, if a session exists) resolves. */
  loading: boolean;
  isAdmin: boolean;
  /** False when VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY are missing. */
  isConfigured: boolean;
  /** True when VITE_ADMIN_DEV_BYPASS unlocked the dashboard without a real session — see above. */
  devBypass: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>;
  refreshAdminStatus: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

/** Calls the `is_admin()` Postgres function (SECURITY DEFINER — safe to call as any authenticated user). */
async function checkIsAdmin(): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // If Supabase isn't configured there is nothing to wait for — resolve immediately so the
  // login page can show a configuration error instead of spinning forever. Same for the dev
  // bypass: nothing to wait on, it never touches Supabase auth.
  const [loading, setLoading] = useState(isSupabaseConfigured && !DEV_BYPASS_ENABLED);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (DEV_BYPASS_ENABLED) {
      setLoading(false);
      return () => {
        mountedRef.current = false;
      };
    }

    if (!supabase) {
      setLoading(false);
      return () => {
        mountedRef.current = false;
      };
    }

    // Subscribe before checking the current session so no auth event fires unobserved.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mountedRef.current) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        void checkIsAdmin().then((admin) => {
          if (mountedRef.current) setIsAdmin(admin);
        });
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!mountedRef.current) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user) {
        void checkIsAdmin().then((admin) => {
          if (mountedRef.current) {
            setIsAdmin(admin);
            setLoading(false);
          }
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string): Promise<SignInResult> {
    if (!supabase) return { error: "Supabase is not configured.", isAdmin: false };

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message, isAdmin: false };

    const admin = await checkIsAdmin();
    if (!admin) {
      // Non-admin credentials are valid Supabase users but have no admin_users row —
      // never leave that session active in an admin surface.
      await supabase.auth.signOut();
      if (mountedRef.current) {
        setUser(null);
        setSession(null);
        setIsAdmin(false);
      }
      return { error: null, isAdmin: false };
    }

    if (mountedRef.current) {
      setSession(data.session);
      setUser(data.user);
      setIsAdmin(true);
    }
    return { error: null, isAdmin: true };
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    if (mountedRef.current) {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    }
  }

  async function requestPasswordReset(email: string): Promise<{ error: string | null }> {
    if (!supabase) return { error: "Supabase is not configured." };
    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/admin/login` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(
      email,
      redirectTo ? { redirectTo } : undefined,
    );
    return { error: error ? error.message : null };
  }

  async function refreshAdminStatus() {
    const admin = await checkIsAdmin();
    if (mountedRef.current) setIsAdmin(admin);
  }

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin: DEV_BYPASS_ENABLED || isAdmin,
        isConfigured: isSupabaseConfigured,
        devBypass: DEV_BYPASS_ENABLED,
        signIn,
        signOut,
        requestPasswordReset,
        refreshAdminStatus,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return context;
}
