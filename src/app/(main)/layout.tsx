// src/app/(main)/layout.tsx - THE CORRECT AND FINAL VERSION

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react';
import { SignOutButton } from '@/components/SignOutButton';
import Link from 'next/link'; // Make sure Link is imported

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen">
      {/* 
        ==================================================================
        THE FIX IS HERE: This is the single, correct header structure.
        It has a clear left, middle, and right section.
        ==================================================================
      */}
      <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          {/* Left Side: App Name */}
          <div className="flex-shrink-0">
            <Link href="/builder" className="font-poppins font-bold text-xl text-white">
              ResumeCraft
            </Link>
          </div>

          {/* Middle: Main Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
              <Link href="/builder" className="text-sm font-medium text-gray-300 hover:text-yellow-400">
                Resume Builder
              </Link>
              <Link href="/interview" className="text-sm font-medium text-gray-300 hover:text-yellow-400">
                Mock Interview
              </Link>
          </nav>

          {/* Right Side: User Info and Sign Out */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400 hidden sm:block">
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