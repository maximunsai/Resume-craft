'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// The public interface of our hook. This MUST match what the component expects.
interface SpeechHook {
    speak: (text: string, personaId: string) => void;
    cancel: () => void;
    isLoading: boolean;
    isSpeaking: boolean;
}

// A single, global audio element is the most robust way to handle playback.
let audio: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') {
    audio = new Audio();
}

export const useSpeechSynthesis = (): SpeechHook => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // This effect manages the isSpeaking state reliably via the audio element's own events.
    useEffect(() => {
        if (!audio) return;
        const handlePlay = () => setIsSpeaking(true);
        const handleEnd = () => setIsSpeaking(false);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handleEnd);
        audio.addEventListener('ended', handleEnd);
        audio.addEventListener('error', (e) => {
            console.error("HTMLAudioElement error:", e);
            handleEnd();
        });
        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handleEnd);
            audio.removeEventListener('ended', handleEnd);
            audio.removeEventListener('error', handleEnd);
        };
    }, []);

    const cancel = useCallback(() => {
        if (audio) {
            audio.pause();
            audio.src = '';
        }
        setIsLoading(false);
        setIsSpeaking(false);
    }, []);

    // This is the main function called by the component.
    const speak = useCallback(async (text: string, personaId: string) => {
        if (isLoading || isSpeaking) return;
        
        cancel(); // Cancel any previous audio first
        setIsLoading(true);

        try {
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, personaId }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `API Error: Status ${response.status}`);
            }
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            if (audio) {
                audio.src = url;
                // This is a fire-and-forget play call. Event listeners handle state.
                audio.play().catch(err => {
                    console.error("Browser blocked audio playback:", err);
                    alert("Your browser may be blocking audio playback. Please click the speaker icon again to play.");
                    // Reset state if the browser blocks playback
                    setIsLoading(false);
                    setIsSpeaking(false);
                });
            }
        } catch (error) {
            console.error(`Failed to play audio for persona "${personaId}":`, error);
            alert(`Voice Generation Failed: ${(error as Error).message}`);
            // Ensure state is always reset on ANY failure
            setIsLoading(false);
            setIsSpeaking(false);
        } finally {
            // This ensures the loading spinner for the network request ALWAYS stops
            setIsLoading(false);
        }
    }, [isLoading, isSpeaking, cancel]);


    // Return the correctly named functions that the component expects.
    return { speak, cancel, isLoading, isSpeaking };
};