'use client';

import { useState, useCallback } from 'react';

interface SpeechSynthesisHook {
    getPremiumAudioUrl: (text: string) => Promise<string | null>;
    isLoading: boolean;
}

export const useSpeechSynthesis = (): SpeechSynthesisHook => {
    const [isLoading, setIsLoading] = useState(false);

    const getPremiumAudioUrl = useCallback(async (text: string): Promise<string | null> => {
        if (!text) return null;

        setIsLoading(true);
        try {
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                const errorBody = await response.json();
                console.error("ElevenLabs API request failed:", errorBody);
                return null; // Return null on failure
            }
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            return url;

        } catch (error) {
            console.error(`Premium TTS fetch failed: ${(error as Error).message}.`);
            return null; // Return null on fetch error
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { getPremiumAudioUrl, isLoading };
};