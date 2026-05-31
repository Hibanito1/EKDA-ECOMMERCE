import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

let _supabase: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseClient(
  supabaseUrl: string,
  supabaseAnonKey: string
) {
  if (!_supabase) {
    _supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return _supabase;
}

export function createSupabaseServerClient(
  supabaseUrl: string,
  supabaseServiceKey: string
) {
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export { createClient };
export type { Database };
