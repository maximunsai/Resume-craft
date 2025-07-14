// src/app/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LandingPageClient } from '@/components/LandingPageClient'; // Import our new client component

// This is a Server Component. It runs on the server before anything is sent to the browser.
export default async function Page() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If the user is logged in, redirect them immediately to the app.
    if (user) {
        redirect('/builder');
    }

    // If no user is logged in, render the beautiful landing page UI.
    return <LandingPageClient />;
}