import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://auxdpgqqlcrpmdzjgnky.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1eGRwZ3FxbGNycG1kempnbmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MDk0MDEsImV4cCI6MjEwNzk4NTQwMX0.HEIR0-Sn0s84nJ7pArCG4wDTHTa6OvxlIO7S_hIZ48k";

/**
 * The admin's live-preview iframe loads the public site in the same browser context as
 * the admin itself. Giving that copy its own (non-persisted) auth storage keeps the two
 * Supabase clients from sharing one session slot.
 */
const inPreviewFrame =
  typeof window !== "undefined" && window.self !== window.top && new URLSearchParams(window.location.search).get("preview") === "1";

function buildClient() {
  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    inPreviewFrame ? { auth: { storageKey: "sb-tawasul-preview", persistSession: false, autoRefreshToken: false } } : undefined
  );
}

// One client per document, even if the dev bundler evaluates this module more than once.
const globalRef = globalThis as typeof globalThis & { __tawasulSupabase?: ReturnType<typeof buildClient> };

export const supabase = globalRef.__tawasulSupabase ?? (globalRef.__tawasulSupabase = buildClient());

