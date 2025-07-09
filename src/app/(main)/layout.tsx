// src/app/(main)/layout.tsx

import { createClient } from '@/lib/supabase/server'; // IMPORT FROM OUR NEW HELPER
import { redirect } from 'next/navigation';
import React from 'react';

// This layout component is now clean and focused on its one job:
// protecting the route.
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create the Supabase client using our new, correct helper function.
  const supabase = createClient();

  // Check for an active user session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user is logged in, redirect them to the login page.
  if (!user) {
    return redirect('/login');
  }

  // If a user is found, render the page they were trying to access.
  return <>{children}</>;
}