// app/auth/confirm/route.ts

import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest ) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  // Create a redirect response to the desired page
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (token_hash && type) {
    const supabase = createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // Email confirmed successfully, redirect to the intended page
      redirectTo.searchParams.delete('next')
      return NextResponse.redirect(redirectTo)
    }
  }

  // If there's an error or the params are missing,
  // redirect to an error page with a message.
  redirectTo.pathname = '/auth-error'
  return NextResponse.redirect(redirectTo)
}
