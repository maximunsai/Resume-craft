// src/lib/supabase/route-handler-client.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// This is the ONLY function you should use inside API Routes to get a Supabase client.
export const createRouteClient = () => {
    const cookieStore = cookies();
    // The generic type <Database> is for type safety with your specific tables.
    // If you haven't set up types, you can use createRouteHandlerClient({ cookies: () => cookieStore })
    return createRouteHandlerClient<any>({ cookies: () => cookieStore });
};