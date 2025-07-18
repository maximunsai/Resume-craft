// src/app/api/tts/route.ts

import { VOICE_MANIFEST } from '@/lib/voice-manifest';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(request: Request) {
    const { text, personaId } = await request.json();

    if (!text || !personaId || !ELEVENLABS_API_KEY) {
        return NextResponse.json({ error: 'Missing text, personaId, or API key' }, { status: 400 });
    }

    // Look up the actual ElevenLabs Voice ID from our secure manifest
    const selectedPersona = VOICE_MANIFEST.find(p => p.personaId === personaId);

    if (!selectedPersona) {
        return NextResponse.json({ error: 'Invalid personaId' }, { status: 400 });
    }

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
                voice_settings: { stability: 0.5, similarity_boost: 0.75 },
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