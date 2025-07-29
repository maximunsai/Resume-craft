'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useResumeStore } from '@/store/resumeStore'; // Import resume store
import { useInterviewStore } from '@/store/interviewStore'; // Import interview store

export const SignOutButton = () => {
    const router = useRouter();
    
    // Get the reset functions from our stores
    const resetResumeStore = useResumeStore(state => state.reset);
    const clearInterview = useInterviewStore(state => state.clearInterview);

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();

        // =================================================================
        // THE FIX: After signing out, we explicitly reset all client-side state.
        // =================================================================
        resetResumeStore();
        clearInterview();

        // Navigate the user to the login page
        router.push('/login');
        // A full page refresh is a good idea to ensure all state is gone.
        router.refresh(); 
    };

    return (
        <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-semibold text-gray-900 bg-yellow-400 border border-transparent rounded-lg shadow-sm hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
            Sign Out
        </button>
    );
};