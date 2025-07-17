import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// This is a special Next.js flag that ensures this route is always
// treated as a dynamic function, which is necessary for it to access
// real-time cookie information for authentication.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { transcript, overall_feedback } = await request.json();
        
        // This is the correct, modern way to create a Supabase client
        // inside a Next.js API Route when middleware is being used.
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
        
        // Thanks to our middleware, this call will now reliably find the user's session.
        const { data: { session } } = await supabase.auth.getSession();

        // If for any reason there is no session, we deny access.
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Insert the interview data into our database, associating it with the user.
        const { data, error } = await supabase
            .from('interviews')
            .insert({ 
                user_id: session.user.id, 
                transcript: transcript,
                overall_feedback: overall_feedback
            })
            .select('id') // We only need to return the ID of the new row.
            .single();

        // If there was a database error, report it.
        if (error) {
            console.error("Error saving interview to Supabase:", error.message);
            throw new Error(`Database error: ${error.message}`);
        }

        // On success, return the ID of the newly created interview record.
        return NextResponse.json({ interview_id: data.id });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error("Error in /api/save-interview route:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}