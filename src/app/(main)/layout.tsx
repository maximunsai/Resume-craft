'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/store/resumeStore';
import { SignOutButton } from '@/components/SignOutButton';
import Link from 'next/link';
import { CheckCircle, Save } from 'lucide-react';

// This is our initializer, but now it's just part of the layout
const AppInitializer = ({ children }: { children: React.ReactNode }) => {
    const { initialize, isInitialized } = useResumeStore(state => ({
        initialize: state.initialize,
        isInitialized: state.isInitialized,
    }));

    useEffect(() => {
        if (!isInitialized) initialize();
    }, [initialize, isInitialized]);

    return <>{children}</>;
};

// A new component to show the save status
const SaveStatusIndicator = () => {
    const isSaving = useResumeStore(state => state.isSaving);
    const [showSaved, setShowSaved] = useState(false);

    useEffect(() => {
        if (!isSaving && useResumeStore.getState().isInitialized) {
            setShowSaved(true);
            const timer = setTimeout(() => setShowSaved(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isSaving]);

    return (
        <div className="flex items-center gap-2 text-sm text-gray-400">
            {isSaving ? (
                <>
                    <Save className="animate-spin h-4 w-4" />
                    <span>Saving...</span>
                </>
            ) : showSaved ? (
                <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Saved</span>
                </>
            ) : null}
        </div>
    );
};


export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
            } else {
                setUserEmail(session.user.email || null);
                setIsLoading(false);
           }
        };
        checkUser();
    }, [router]);

    if (isLoading) { /* ... Loading Spinner ... */ }

    return (
        <AppInitializer>
            <div className="min-h-screen">
                <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
                    <div className="container mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <Link href="/builder" className="font-poppins font-bold text-xl text-white">ResumeCraft</Link>
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="/builder" className="text-sm font-medium">Resume Builder</Link>
                            <Link href="/interview" className="text-sm font-medium">Mock Interview</Link>
                        </nav>
                        <div className="flex items-center space-x-4">
                             <SaveStatusIndicator /> {/* <-- NEW UI ELEMENT */}
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