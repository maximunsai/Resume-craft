// src/app/(main)/layout.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react';
import { SignOutButton } from '@/components/SignOutButton'; 

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient(); 

  // Check for an active user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user is found, redirect them to the login page.
  if (!user) {
    redirect('/login');
  }

  // If a user is found, render the protected content
  // WITH our new header that includes the Sign Out button.
  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* You can put your app logo or name here */}
          <h1 className="text-xl font-bold text-gray-800">ResumeCraft AI</h1>
          
          {/* User Info and Sign Out Button */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              {user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main>
        {children}
      </main>
    </div>
  );
}