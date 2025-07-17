// src/app/api/save-interview/route.ts - WITH DYNAMIC FIX

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// =================================================================
// THE FIX IS HERE: This line forces the route to be treated as dynamic,
// ensuring that cookies() and other dynamic functions work correctly.
// =================================================================
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { transcript, overall_feedback } = await request.json();
        
        const cookieStore = cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

        // This call will now succeed because the route is dynamic.
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('interviews')
            .insert({ 
                user_id: session.user.id, 
                transcript: transcript,
                overall_feedback: overall_feedback
            })
            .select('id') // Only select the ID we need
            .single();

        if (error) {
            console.error("Error saving interview to Supabase:", error);
            throw new Error(error.message); // Throw error to be caught below
        }

        // Return the ID of the saved interview
        return NextResponse.json({ interview_id: data.id });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error("Error in /api/save-interview:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}