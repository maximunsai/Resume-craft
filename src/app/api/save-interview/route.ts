// src/app/api/save-interview/route.ts

import { NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase/route-handler-client'; // <-- USE OUR NEW HELPER

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const { transcript, overall_feedback } = await request.json();
    
    // Create a Supabase client that can access the user's session
    const supabase = createRouteClient();

    // Get the user session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        // This error will be thrown if the cookies are not correctly passed
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Insert the data with the user's ID
    const { data, error } = await supabase
        .from('interviews')
        .insert({ 
            user_id: session.user.id, 
            transcript: transcript,
            overall_feedback: overall_feedback
        })
        .select('id')
        .single();

    if (error) {
        console.error("Error saving interview to Supabase:", error.message);
        return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ interview_id: data.id });
}