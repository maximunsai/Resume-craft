// src/lib/voice-manifest.ts

export interface VoicePersona {
    personaId: string;         // Our unique, stable internal name
    elevenLabsVoiceId: string; // The ID from ElevenLabs
    name: string;              // The name we show to the user in the dropdown
    description: string;       // A helpful description (optional)
    gender: 'male' | 'female';
}

// This is our single source of truth for all available voices.
export const VOICE_MANIFEST: VoicePersona[] = [
    // --- YOUR NEW VOICES ---
    {
        personaId: 'professional_indian_male_1',
        elevenLabsVoiceId: 'gRSnExGLhx9yFuwwquIU',
        name: 'Nikhil - Professional Indian Male',
        description: 'A clear and professional Indian male voice.',
        gender: 'male',
    },
    {
        personaId: 'calm_indian_female_1',
        elevenLabsVoiceId: 'OwIqdhRPD2fFMmedVUrS',
        name: 'Pavani - Calm Indian Female',
        description: 'A calm and engaging Indian female voice.',
        gender: 'female',
    },

    // --- OUR EXISTING VOICES ---
    {
        personaId: 'professional_american_male_1',
        elevenLabsVoiceId: '21m00Tcm4TlvDq8ikWAM',
        name: 'Adam - Professional US Narrator',
        description: 'A deep, calming, and clear voice.',
        gender: 'male',
    },
    {
        personaId: 'friendly_american_female_1',
        elevenLabsVoiceId: '2EiwWnXFnvU5JabPnv8n',
        name: 'Gigi - Friendly US Conversationalist',
        description: 'An animated, youthful, and engaging voice.',
        gender: 'female',
    },
];