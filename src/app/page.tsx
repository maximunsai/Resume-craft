// src/app/page.tsx - The new, intelligent homepage

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// This is an async Server Component, which is perfect for this task.
export default async function HomePage() {
  
  // Create a Supabase client to check the user's auth status on the server.
  const supabase = createClient();

  // Check if a user is currently logged in.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // THE LOGIC:
  // If a user is logged in, send them straight to the resume builder.
  // If no user is logged in, send them to the login page to get started.
  if (user) {
    redirect('/builder');
  } else {
    redirect('/login');
  }

  // This part of the component will never actually be rendered,
  // because the user will always be redirected first.
  // But we include it to have a valid return type.
  return null;
  
}