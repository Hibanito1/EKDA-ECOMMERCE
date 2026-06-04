import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@ekda/database";

export function createClient() {
  return createClientComponentClient<Database>();
}

// Lazy singleton — only instantiated when first called, not at module import time.
// This prevents crashes during SSR/build when NEXT_PUBLIC_SUPABASE_URL is a placeholder.
let _supabase: ReturnType<typeof createClientComponentClient<Database>> | null = null;

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClientComponentClient<Database>();
  }
  return _supabase;
}

// Keep backward-compatible named export but as a getter to avoid eager init
export const supabase = {
  get auth() { return getSupabase().auth; },
  get from() { return getSupabase().from.bind(getSupabase()); },
  get storage() { return getSupabase().storage; },
  get channel() { return getSupabase().channel.bind(getSupabase()); },
} as ReturnType<typeof createClientComponentClient<Database>>;
