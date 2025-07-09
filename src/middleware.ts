// src/middleware.ts - FINAL, CORRECTED VERSION

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // This is the Supabase client that can write cookies.
  // It uses the new, non-deprecated cookie handling API.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // The new `getAll` method reads all cookies from the incoming request.
        getAll() {
          return request.cookies.getAll()
        },
        // The new `setAll` method writes all cookies to the response.
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => 
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  )

  // IMPORTANT: The `getUser` method must be called to refresh the session.
  await supabase.auth.getUser()

  return response
}

// Ensure middleware runs on all paths except static assets.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}