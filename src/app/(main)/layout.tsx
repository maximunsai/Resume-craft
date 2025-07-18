// src/app/(main)/layout.tsx - THE FINAL, CORRECT VERSION

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { AppInitializer } from '@/components/AppInitializer'; // Import our new component
import { SignOutButton } from '@/components/SignOutButton';
import Link from 'next/link';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // This useEffect is now ONLY for checking authentication.
    // It no longer handles data initialization.
    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/login');
            } else {
                setUserEmail(session.user.email || null);
                setLoading(false); // We can show the app as soon as we know they're logged in
            }
        };
        checkUser();
    }, [router]);

    // Show a full-screen loader while checking for a valid session
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    return (
        // The AppInitializer WRAPS the entire authenticated app.
        // It will trigger the data load, which happens in the background.
        // By the time the user navigates to the builder, the data will be loaded.
        <AppInitializer>
            <div className="min-h-screen">
                <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
                    <div className="container mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <Link href="/builder" className="font-poppins font-bold text-xl text-white">ResumeCraft</Link>
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="/builder" className="text-sm font-medium text-gray-300 hover:text-yellow-400">Resume Builder</Link>
                            <Link href="/interview" className="text-sm font-medium text-gray-300 hover:text-yellow-400">Mock Interview</Link>
                        </nav>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-400 hidden sm:block">{userEmail}</span>
                            <SignOutButton />
                        </div>
                    </div>
                </header>
                <main>{children}</main>
            </div>
        </AppInitializer>
    );
}