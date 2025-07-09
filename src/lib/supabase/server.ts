// src/lib/supabase/server.ts - FINAL FIX

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        // This comment tells the linter to ignore the "unused variable" error for the next line.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setAll(cookiesToSet) {
          // In server components, we don't need to set cookies. The middleware handles it.
          // This function is required to satisfy the type, but it can be empty.
        },
      },
    }
  )
}