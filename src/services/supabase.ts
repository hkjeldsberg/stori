import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type AnyClient = SupabaseClient<any, any, any>;

let cachedAnon: AnyClient | null = null;
let cachedService: AnyClient | null = null;

/** Read-only client backed by the anon key. Safe in the browser. */
export function getSupabaseClient(): AnyClient | null {
  if (cachedAnon) return cachedAnon;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  cachedAnon = createClient(url, anonKey, {
    db: { schema: "stori" },
  }) as AnyClient;
  return cachedAnon;
}

/**
 * Server-side write client backed by the service-role key. NEVER call this
 * from the browser — the service role bypasses RLS. Returns null when the
 * key is not configured.
 */
export function getSupabaseServiceClient(): AnyClient | null {
  if (cachedService) return cachedService;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  cachedService = createClient(url, serviceKey, {
    db: { schema: "stori" },
    auth: { persistSession: false, autoRefreshToken: false },
  }) as AnyClient;
  return cachedService;
}
