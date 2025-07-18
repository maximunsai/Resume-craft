// src/app/api/tts/route.ts - THE DYNAMIC VERSION

import { VOICE_MANIFEST } from '@/lib/voice-manifest';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(request: Request) {
    // 1. Read the text AND the chosen personaId from the request body
    const { text, personaId } = await request.json();

    if (!text || !personaId || !ELEVENLABS_API_KEY) {
        return NextResponse.json({ error: 'Missing text, personaId, or API key' }, { status: 400 });
    }

    // 2. Look up the actual ElevenLabs Voice ID from our secure manifest on the server
    const selectedPersona = VOICE_MANIFEST.find(p => p.personaId === personaId);

    if (!selectedPersona) {
        return NextResponse.json({ error: 'Invalid personaId provided' }, { status: 400 });
    }

    // 3. Use the dynamically found voice ID in the API call
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${selectedPersona.elevenLabsVoiceId}/stream`;

    try {
        const response = await fetch(elevenLabsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY,
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                },
            }),
        });

        if (!response.ok || !response.body) {
            const errorBody = await response.text();
            throw new Error(`ElevenLabs API Error: ${errorBody}`);
        }

        return new NextResponse(response.body, { headers: { 'Content-Type': 'audio/mpeg' } });

    } catch (error) {
        console.error("Error in TTS route:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}