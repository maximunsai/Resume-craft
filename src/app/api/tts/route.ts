// src/app/api/tts/route.ts - PRODUCTION-GRADE REWRITE

import { VOICE_MANIFEST } from '@/lib/voice-manifest';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(request: Request) {
    console.log("TTS API route invoked."); // Observability Step 1

    const { text, personaId } = await request.json();

    if (!ELEVENLABS_API_KEY) {
        console.error("ElevenLabs API key is not configured.");
        return NextResponse.json({ error: 'TTS service is not configured.' }, { status: 500 });
    }

    if (!text || !personaId) {
        return NextResponse.json({ error: 'Missing required parameters: text or personaId' }, { status: 400 });
    }

    const selectedPersona = VOICE_MANIFEST.find(p => p.personaId === personaId);

    if (!selectedPersona) {
        return NextResponse.json({ error: `Invalid personaId: ${personaId}` }, { status: 400 });
    }

    // The API endpoint for streaming is slightly different and recommended for performance
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${selectedPersona.elevenLabsVoiceId}/stream`;
    
    // CRITICAL FIX: Ensure we use a model that supports multiple languages and accents.
    const modelId = "eleven_multilingual_v2";

    console.log(`Requesting TTS for persona "${selectedPersona.name}" (ID: ${selectedPersona.elevenLabsVoiceId}) with model "${modelId}"`); // Observability Step 2

    try {
        const response = await fetch(elevenLabsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY,
                'Accept': 'audio/mpeg', // Be explicit about what we want
            },
            body: JSON.stringify({
                text: text,
                model_id: modelId,
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                },
            }),
        });
        
        // CRITICAL FIX: Robustly handle API errors from ElevenLabs
        if (!response.ok) {
            // Attempt to parse the JSON error body from ElevenLabs for a clear message
            const errorBody = await response.json().catch(() => ({})); // Graceful catch if body isn't JSON
            const errorMessage = errorBody.detail?.message || `API Error: Status ${response.status}`;
            console.error(`ElevenLabs API Error for persona "${personaId}":`, errorMessage);
            // Return a clean, understandable error to our frontend
            return NextResponse.json({ error: errorMessage }, { status: response.status });
        }

        // Check if the response body exists before creating the stream
        if (!response.body) {
            throw new Error("ElevenLabs API returned an empty response body.");
        }

        console.log(`Successfully received audio stream for persona "${personaId}". Forwarding to client.`); // Observability Step 3
        
        // Stream the audio data directly back to the client
        return new NextResponse(response.body, {
            headers: { 'Content-Type': 'audio/mpeg' },
        });

    } catch (error) {
        console.error("Catastrophic error in TTS route:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}