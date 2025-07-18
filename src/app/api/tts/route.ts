// src/app/api/tts/route.ts - MORE ROBUST VERSION

import { VOICE_MANIFEST } from '@/lib/voice-manifest';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(request: Request) {
    const { text, personaId } = await request.json();

    if (!text || !personaId || !ELEVENLABS_API_KEY) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const selectedPersona = VOICE_MANIFEST.find(p => p.personaId === personaId);

    if (!selectedPersona) {
        return NextResponse.json({ error: 'Invalid personaId' }, { status: 400 });
    }

    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${selectedPersona.elevenLabsVoiceId}`;

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
        
        // =================================================================
        // THE FIX IS HERE: We now handle non-OK responses explicitly
        // before trying to access the response body.
        // =================================================================
        if (!response.ok) {
            // Try to parse the error from ElevenLabs for better debugging
            const errorBody = await response.json().catch(() => ({ detail: { message: "Unknown API error" } }));
            console.error("ElevenLabs API Error:", errorBody);
            // Throw an error that our main catch block will handle
            throw new Error(errorBody.detail?.message || `ElevenLabs API responded with status ${response.status}`);
        }

        // Check if the response body exists
        if (!response.body) {
            throw new Error("ElevenLabs API returned an empty response body.");
        }

        // Return the audio stream directly to the client
        return new NextResponse(response.body, { headers: { 'Content-Type': 'audio/mpeg' } });

    } catch (error) {
        console.error("Error in TTS route:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}