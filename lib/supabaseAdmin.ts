import { createClient } from "@supabase/supabase-js";

// SERVER ONLY. The service role key bypasses row level security; importing this module from
// browser code would ship the key in the JavaScript bundle, so fail loudly if that ever happens.
if (typeof window !== "undefined") {
  throw new Error("lib/supabaseAdmin.ts must never be imported from browser code");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://auxdpgqqlcrpmdzjgnky.supabase.co";
// Never hard-code this key: the repository is public. It comes from .env.local / the host's env.
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set; the admin API needs it (see README.md)");
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

