import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Browser-safe values only. Never add a service-role/secret key here — this module ships
// in the client bundle. Access control is enforced by Postgres Row Level Security, not by
// keeping these values secret. See supabase/README.md.
const SUPABASE_URL = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const SUPABASE_KEY = (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
  import.meta.env["VITE_SUPABASE_ANON_KEY"]) as string | undefined;

/** True once both required env vars are present. UI should branch on this rather than assume `supabase` exists. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

// This module is imported by route loaders, which also run during the Node-side prerender
// build (no `window`/`localStorage`). Only touch browser storage when actually in a browser.
const isBrowser = typeof window !== "undefined";

/**
 * The Supabase browser client, or `null` if VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY
 * are not set. Never falls back to a fake/mock client — callers must check
 * `isSupabaseConfigured` (or that this is non-null) and show a real configuration error
 * instead of silently pretending auth or data access succeeded.
 */
export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(SUPABASE_URL!, SUPABASE_KEY!, {
      auth: {
        persistSession: isBrowser,
        autoRefreshToken: isBrowser,
        detectSessionInUrl: isBrowser,
        storage: isBrowser ? window.localStorage : undefined,
      },
    })
  : null;

/** Thrown by `requireSupabase()` — callers should show a real "not configured" state, never pretend to succeed. */
export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super("Supabase is not configured — set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.");
    this.name = "SupabaseNotConfiguredError";
  }
}

/** Narrows `supabase` to non-null or throws `SupabaseNotConfiguredError`. Use in data-access helpers. */
export function requireSupabase(): SupabaseClient<Database> {
  if (!supabase) throw new SupabaseNotConfiguredError();
  return supabase;
}
