import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@ekda/database";

const missingSupabaseError = new Error(
  "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
);

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

function createMissingSupabaseClient(): SupabaseClient<Database> {
  const notConfigured = async () => ({ data: null, error: missingSupabaseError });

  return {
    auth: {
      signInWithPassword: notConfigured,
      signInWithOAuth: notConfigured,
      signUp: notConfigured,
    },
    from: () => ({
      upsert: notConfigured,
    }),
  } as unknown as SupabaseClient<Database>;
}

export function createClient() {
  if (!isSupabaseConfigured) {
    return createMissingSupabaseClient();
  }

  return createClientComponentClient<Database>();
}

export const supabase = createClient();
