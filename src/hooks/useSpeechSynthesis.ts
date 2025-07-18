'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// Define the hook's return type for clarity
interface SpeechHook {
    playAudio: (text: string, personaId: string) => void;
    cancelAudio: () => void;
    isLoading: boolean;
    isSpeaking: boolean;
}

// Create one global audio element to prevent conflicts
let audio: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') {
    audio = new Audio();
}

export const useSpeechSynthesis = (): SpeechHook => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // This effect manages the isSpeaking state based on the audio element's events.
    useEffect(() => {
        if (!audio) return;
        const handlePlay = () => setIsSpeaking(true);
        const handleEnd = () => setIsSpeaking(false);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handleEnd);
        audio.addEventListener('ended', handleEnd);
        audio.addEventListener('error', handleEnd);
        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handleEnd);
            audio.removeEventListener('ended', handleEnd);
            audio.removeEventListener('error', handleEnd);
        };
    }, []);

    const cancelAudio = useCallback(() => {
        if (audio) {
            audio.pause();
            audio.src = '';
        }
        setIsLoading(false);
        setIsSpeaking(false);
    }, []);

    const playAudio = useCallback(async (text: string, personaId: string) => {
        // Prevent new audio from starting if something is already happening
        if (isLoading || isSpeaking) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, personaId }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `API request failed with status ${response.status}`);
            }
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            if (audio) {
                audio.src = url;
                // Don't await this. Let the event listeners handle state.
                audio.play().catch(err => {
                    // This catch is crucial for autoplay policy errors
                    console.error("Audio playback error:", err);
                    // Reset state if play is blocked
                    setIsLoading(false);
                    setIsSpeaking(false);
                    alert("Browser blocked audio playback. Please click the speaker icon to play.");
                });
            }
        } catch (error) {
            console.error(`Premium TTS failed: ${(error as Error).message}.`);
            // Show an alert so the user knows exactly what failed
            alert(`Failed to generate audio: ${(error as Error).message}`);
        } finally {
            // This is the key: setIsLoading is called right after the fetch is done,
            // not after the audio finishes playing.
            setIsLoading(false);
        }
    }, [isLoading, isSpeaking]);


    return { playAudio, cancelAudio, isLoading, isSpeaking };
};