// src/lib/voice-manifest.ts

export interface VoicePersona {
    personaId: string; // Our internal, stable ID
    elevenLabsVoiceId: string; // The ID from ElevenLabs
    name: string; // The name we show to the user
    description: string;
    gender: 'male' | 'female';
}

export const VOICE_MANIFEST: VoicePersona[] = [
    {
        personaId: 'professional_male_1',
        elevenLabsVoiceId: '21m00Tcm4TlvDq8ikWAM', // Adam (Professional, calm)
        name: 'Adam - Professional Narrator',
        description: 'A deep, calming, and clear voice.',
        gender: 'male',
    },
    {
        personaId: 'friendly_female_1',
        elevenLabsVoiceId: '2EiwWnXFnvU5JabPnv8n', // Gigi (Youthful, animated)
        name: 'Gigi - Friendly Conversationalist',
        description: 'An animated, youthful, and engaging voice.',
        gender: 'female',
    },
    // TO ADD MORE VOICES, SIMPLY ADD A NEW OBJECT HERE.
    {
        personaId: 'Confident female',
        elevenLabsVoiceId: '56AoDkrOh6qfVPDXZ7Pt', 
        name: 'Cassidy',
        description: 'Smooth voice.',
        gender: 'female',
    },
     {
        personaId: 'calm_female_1',
        elevenLabsVoiceId: 'ThT5KcBeYPX3keUQqHPh', // Mimi
        name: 'Mimi - Calm Storyteller',
        description: 'A soft, soothing, and gentle voice.',
        gender: 'female',
    }
];