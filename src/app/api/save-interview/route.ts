// src/app/api/save-interview/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { transcript, overall_feedback } = await request.json();
    
    const supabase = createRouteHandlerClient({ cookies });
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
        .select() // select() returns the newly created row
        .single(); // We expect only one row back

    if (error) {
        console.error("Error saving interview:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return the ID of the saved interview so we can redirect to its analytics page
    return NextResponse.json({ interview_id: data.id });
}