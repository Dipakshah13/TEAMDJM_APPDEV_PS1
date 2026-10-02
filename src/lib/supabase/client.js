/**
 * @file client.js
 * Supabase browser client — safe to use in Client Components.
 * Only the two NEXT_PUBLIC_ vars are exposed to the browser.
 */

import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for use in browser (Client Components).
 * Call once and reuse; it handles session cookies automatically.
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
