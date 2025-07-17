// src/app/api/save-interview/route.ts - THE FINAL, CORRECTED VERSION

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { transcript, overall_feedback } = await request.json();
        
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );
        
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // =================================================================
        // THE DEFINITIVE FIX IS HERE: Change .select('id') to .select()
        // By default, .select() is the same as .select('*'), which is more robust.
        // =================================================================
        const { data, error } = await supabase
            .from('interviews')
            .insert({ 
                user_id: session.user.id, 
                transcript: transcript,
                overall_feedback: overall_feedback
            })
            .select() // This now selects all columns from the newly created row.
            .single();

        if (error) {
            console.error("Error saving interview to Supabase:", error.message);
            throw new Error(`Database error: ${error.message}`);
        }

        if (!data || !data.id) {
             throw new Error("Database insert succeeded but returned no data.");
        }

        // Now we can safely return the ID from the full data object.
        return NextResponse.json({ interview_id: data.id });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error("Error in /api/save-interview route:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}