// src/app/api/tts/route.ts - THE FINAL, DEFINITIVE FIX

import { VOICE_MANIFEST } from '@/lib/voice-manifest';
import { NextResponse } from 'next/server';

// =================================================================
// THE CRITICAL FIX: We are removing `export const runtime = 'edge';`
// By removing this, we are telling Vercel to run this function in its
// standard Node.js serverless environment, which has full, unrestricted
// outbound network access by default. The Edge runtime can sometimes
// have limitations on external fetch calls.
// =================================================================

// We also keep the dynamic flag to prevent caching.
export const dynamic = 'force-dynamic';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(request: Request) {
    // We add verbose logging at the very start to confirm the function is running.
    console.log("TTS API route invoked in Node.js runtime.");

    try {
        const { text, personaId } = await request.json();

        if (!ELEVENLABS_API_KEY) {
            console.error("CRITICAL: ELEVENLABS_API_KEY is not available in this environment.");
            return NextResponse.json({ error: 'TTS service is not configured.' }, { status: 500 });
        }
        if (!text || !personaId) {
            return NextResponse.json({ error: 'Missing required parameters: text or personaId' }, { status: 400 });
        }

        const selectedPersona = VOICE_MANIFEST.find(p => p.personaId === personaId);
        if (!selectedPersona) {
            return NextResponse.json({ error: `Invalid personaId: ${personaId}` }, { status: 400 });
        }

        const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${selectedPersona.elevenLabsVoiceId}`;
        const modelId = "eleven_multilingual_v2";

        console.log(`Attempting to fetch from ElevenLabs for persona "${personaId}"...`);

        const response = await fetch(elevenLabsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY,
                'Accept': 'audio/mpeg',
            },
            body: JSON.stringify({
                text: text,
                model_id: modelId,
                voice_settings: { stability: 0.5, similarity_boost: 0.75 },
            }),
        });
        
        console.log(`Received status ${response.status} from ElevenLabs.`);

        if (!response.ok) {
            const errorBody = await response.text(); // Get raw text for better error diagnosis
            console.error("ElevenLabs API Error Response:", errorBody);
            throw new Error(`ElevenLabs API Error: Status ${response.status} - ${errorBody}`);
        }

        if (!response.body) {
            throw new Error("ElevenLabs API returned an empty response body.");
        }
        
        console.log("Successfully received audio stream. Forwarding to client.");
        
        // Return the audio stream directly to the client
        return new NextResponse(response.body, {
            headers: { 'Content-Type': 'audio/mpeg' },
        });

    } catch (error) {
        // This will now catch the fetch failure and provide a clear log.
        console.error("Catastrophic error in TTS route:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}