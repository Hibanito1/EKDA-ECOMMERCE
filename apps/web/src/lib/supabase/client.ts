import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@ekda/database";

export function createClient() {
  return createClientComponentClient<Database>();
}

export const supabase = createClientComponentClient<Database>();
