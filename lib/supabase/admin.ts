import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase avec la clé service_role — outrepasse RLS et peut gérer
 * les comptes Auth (création, suppression). Ne jamais importer ce module
 * depuis un composant client : le import "server-only" fait échouer le build
 * si c'est le cas.
 */
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
