// src/app/api/tts/route.ts

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensures this is not cached

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
// You can find Voice IDs in the "Voice Lab" on ElevenLabs' website.
// 'Rachel' is a popular, professional female voice.
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; 

export async function POST(request: Request) {
    const { text } = await request.json();

    if (!text || !ELEVENLABS_API_KEY) {
        return NextResponse.json({ error: 'Missing text or API key' }, { status: 400 });
    }

    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`;

    try {
        const response = await fetch(elevenLabsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY,
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_multilingual_v2', // A high-quality model
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                },
            }),
        });

        if (!response.ok || !response.body) {
            const errorBody = await response.text();
            console.error("ElevenLabs API Error:", errorBody);
            throw new Error(`ElevenLabs API responded with status ${response.status}`);
        }

        // Return the audio stream directly to the client
        return new NextResponse(response.body, {
            headers: { 'Content-Type': 'audio/mpeg' },
        });

    } catch (error) {
        console.error("Error in TTS route:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}