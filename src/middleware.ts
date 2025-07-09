// src/middleware.ts

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // This `response` object will be passed through and modified by the Supabase client.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // The `getAll` method reads cookies from the incoming request.
        getAll() {
          return request.cookies.getAll()
        },
        // The `setAll` method writes cookies to the outgoing response.
        // This implementation is now cleaner and correctly uses the 'options' parameter.
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          });
        },
      },
    }
  )

  // IMPORTANT: The `getUser` method must be called to refresh the session.
  await supabase.auth.getUser()

  return response
}

// Ensure middleware runs on all paths except for static assets and API routes.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
