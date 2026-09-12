import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL     ?? process.env.SUPABASE_URL ?? '';
const serviceRoleKey  = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY    ?? '';

/**
 * Server-side Supabase admin client.
 * Uses the service role / secret key — BYPASSES Row Level Security.
 *
 * ⚠️  NEVER import this in Client Components or expose to the browser.
 *     Only use in API Routes, Server Actions, or server-only utilities.
 *
 * NOTE: Credentials are validated lazily (at request time) so the build
 * does not fail when env vars are absent in CI / preview deployments.
 */
export const supabaseAdmin = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  serviceRoleKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Call this at the top of any server function that uses supabaseAdmin
 * to get an early, clear error if credentials are missing.
 */
export function assertSupabaseAdminConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and ' +
      'SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) in your .env.local file.'
    );
  }
}
