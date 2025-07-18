// src/app/(main)/layout.tsx

'use client'; // This must now be a client component to use hooks

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/store/resumeStore'; // Import our store
import { SignOutButton } from '@/components/SignOutButton';
import Link from 'next/link';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const initializeResumeStore = useResumeStore((state: { initialize: any; }) => state.initialize);

    useEffect(() => {
        const checkUserAndInitialize = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/login');
            } else {
                setUserEmail(session.user.email || null);
                // This is the critical call to load the user's data
                await initializeResumeStore();
                setLoading(false);
            }
        };

        checkUserAndInitialize();
    }, [router, initializeResumeStore]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    return (
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
    );
}