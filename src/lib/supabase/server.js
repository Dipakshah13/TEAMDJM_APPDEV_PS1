/**
 * @file server.js
 * Supabase server client — for use in Server Components, Server Actions,
 * and Route Handlers. Reads/writes cookies via next/headers.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for server-side use.
 * Must be called inside a Server Component, Action, or Route Handler.
 * @returns {Promise<import('@supabase/supabase-js').SupabaseClient>}
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Server Components can't set cookies — middleware handles refresh
          }
        },
      },
    }
  )
}
