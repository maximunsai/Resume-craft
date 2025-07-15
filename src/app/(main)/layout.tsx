// src/app/(main)/layout.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react';
import { SignOutButton } from '@/components/SignOutButton'; 
import { Link } from 'lucide-react';

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
    // The main background color is now handled by globals.css
    <div className="min-h-screen">
      {/* App Header - Styled to match the landing page */}
      <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* App Logo/Name */}
          <h1 className="font-poppins font-bold text-xl text-white">ResumeCraft</h1>
          
          <nav className="flex items-center space-x-6">
    <Link href="/builder" className="text-sm font-medium text-gray-300 hover:text-yellow-400">Resume Builder</Link>
    <Link href="/interview" className="text-sm font-medium text-gray-300 hover:text-yellow-400">Mock Interview</Link>
</nav>

          {/* User Info and Sign Out Button */}
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