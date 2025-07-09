// src/lib/supabase/server.ts - FINAL, CORRECTED VERSION

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// This is the read-only client for use in Server Components.
// It uses the new, non-deprecated cookie handling API.
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
        // In a server component, we don't need to set cookies,
        // so we provide an empty function to satisfy the type.
        // The middleware will handle all cookie setting.
        setAll(cookiesToSet) {},
      },
    }
  )
}