// src/components/SignOutButton.tsx

'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export const SignOutButton = () => {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        // Redirect to the login page and refresh the application state
        router.push('/login');
        router.refresh(); 
    };

    return (
        <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
            Sign Out
        </button>
    );
};