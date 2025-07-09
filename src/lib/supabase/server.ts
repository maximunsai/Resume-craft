// src/lib/supabase/server.ts

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// This is the read-only client for use in Server Components.
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // The new `getAll` method returns all cookies at once.
        getAll() {
          return cookieStore.getAll()
        },
        // In a server component, we don't need to set cookies.
        // The parameter is prefixed with an underscore to indicate it's intentionally unused.
        setAll(_cookiesToSet) {
          // No-op
        },
      },
    }
  )
}
