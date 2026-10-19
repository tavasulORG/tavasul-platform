import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://auxdpgqqlcrpmdzjgnky.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1eGRwZ3FxbGNycG1kempnbmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MDk0MDEsImV4cCI6MjEwNzk4NTQwMX0.HEIR0-Sn0s84nJ7pArCG4wDTHTa6OvxlIO7S_hIZ48k";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
