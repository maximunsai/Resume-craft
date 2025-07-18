// src/app/api/voices/route.ts

import { VOICE_MANIFEST } from '@/lib/voice-manifest';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    // We only send the necessary, public-safe data to the client.
    const clientSafeVoices = VOICE_MANIFEST.map(v => ({
        personaId: v.personaId,
        name: v.name,
        description: v.description,
        gender: v.gender,
    }));

    return NextResponse.json(clientSafeVoices);
} 