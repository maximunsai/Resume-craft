'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/store/resumeStore';
import { SignOutButton } from '@/components/SignOutButton';
import Link from 'next/link';
import { CheckCircle, Save } from 'lucide-react';

// =================================================================
// THE DEFINITIVE FIX IS HERE: The complete and correct implementation
// for the SaveStatusIndicator component. It now correctly returns JSX.
// =================================================================
const SaveStatusIndicator = () => {
    const isSaving = useResumeStore(state => state.isSaving);
    const [showSavedConfirmation, setShowSavedConfirmation] = useState(false);

    useEffect(() => {
        // This effect runs when the saving state changes.
        // `isSaving` is true when saving starts, and false when it ends.
        const wasSaving = sessionStorage.getItem('wasSaving') === 'true';

        if (wasSaving && !isSaving) {
            // If it *was* saving and now it's not, show the "Saved" confirmation.
            setShowSavedConfirmation(true);
            const timer = setTimeout(() => setShowSavedConfirmation(false), 2000); // Hide after 2 seconds
            return () => clearTimeout(timer);
        }

        // Keep track of the previous state using sessionStorage.
        sessionStorage.setItem('wasSaving', isSaving ? 'true' : 'false');
    }, [isSaving]);

    return (
        <div className="flex items-center gap-2 text-sm text-gray-400 w-24 h-6">
            {isSaving ? (
                <>
                    <Save className="animate-spin h-4 w-4" />
                    <span>Saving...</span>
                </>
            ) : showSavedConfirmation ? (
                <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Saved</span>
                </>
            ) : null}
        </div>
    );
};


// The main layout component is architecturally sound from the previous fix.
export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const { initialize, isInitialized } = useResumeStore(state => ({
        initialize: state.initialize,
        isInitialized: state.isInitialized,
    }));

    useEffect(() => {
        const checkUserAndLoadData = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/login');
                return;
            }
            
            setUserEmail(session.user.email || null);
            
            if (!isInitialized) {
                await initialize();
            }

            setIsLoading(false);
        };

        checkUserAndLoadData();
    }, [router, initialize, isInitialized]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
                    <p className="text-white mt-4">Loading Your Forge...</p>
                </div>
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
                         <SaveStatusIndicator />
                        <span className="text-sm text-gray-400 hidden sm:block">{userEmail}</span>
                        <SignOutButton />
                    </div>
                </div>
            </header>
            <main>{children}</main>
        </div>
    );
}