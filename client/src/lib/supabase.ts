/** Training Ledger design reminder: account configuration is explicit, local-friendly, and never exposes server-only secrets. */
import { createClient } from "@supabase/supabase-js";

declare global {
  interface Window {
    __TRAINING_LEDGER_SUPABASE__?: { url?: string; publishableKey?: string };
  }
}

const config = typeof window === "undefined" ? undefined : window.__TRAINING_LEDGER_SUPABASE__;
const url = config?.url?.trim();
const publishableKey = config?.publishableKey?.trim();

export const isSupabaseConfigured = Boolean(url && publishableKey);
export const supabase = isSupabaseConfigured
  ? createClient(url!, publishableKey!, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null;
