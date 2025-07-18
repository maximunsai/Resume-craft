// src/hooks/useSpeechSynthesis.ts - THE UNIFIED, FINAL VERSION

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
// THE HOOK NOW ACCESSES THE STORE DIRECTLY TO GET THE USER'S PREFERENCES
import { useInterviewStore } from '@/store/interviewStore'; 

interface SpeechHook {
    speak: (text: string) => void; // The component ONLY needs to provide the text
    cancel: () => void;
    isLoading: boolean;
    isSpeaking: boolean;
}

// Global audio element to prevent overlapping sounds
let premiumAudio: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') {
    premiumAudio = new Audio();
}

export const useSpeechSynthesis = (): SpeechHook => {
    // This hook subscribes to the store to get the user's voice preferences
    const { selectedPersonaId, selectedVoice } = useInterviewStore(state => ({
        selectedPersonaId: state.selectedPersonaId,
        selectedVoice: state.selectedVoice,
    }));

    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Effect to set up event listeners for the audio element
    useEffect(() => {
        const audio = premiumAudio;
        if (!audio) return;

        const handlePlay = () => setIsSpeaking(true);
        const handlePauseOrEnd = () => setIsSpeaking(false);

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePauseOrEnd);
        audio.addEventListener('ended', handlePauseOrEnd);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePauseOrEnd);
            audio.removeEventListener('ended', handlePauseOrEnd);
        };
    }, []);
    
    // The main 'speak' function. Its logic is now entirely self-contained.
    const speak = useCallback(async (text: string) => {
        if (!text || isSpeaking || isLoading) return;

        // Ensure any previous audio is stopped before starting new audio
        if (premiumAudio) premiumAudio.pause();
        window.speechSynthesis.cancel();
        
        // --- Try Premium API First ---
        if (selectedPersonaId) {
            setIsLoading(true);
            try {
                const response = await fetch('/api/tts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, personaId: selectedPersonaId }),
                });

                if (!response.ok) throw new Error("ElevenLabs API request failed");
                
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                if (premiumAudio) {
                    premiumAudio.src = url;
                    await premiumAudio.play();
                }
                setIsLoading(false);
                return; // Success! Exit the function.

            } catch (error)  {
                console.warn(`Premium TTS failed for persona '${selectedPersonaId}': ${(error as Error).message}. Falling back to native browser voice.`);
                // If premium fails, we intentionally fall through to the native voice logic below.
            }
        }
        
        // --- Fallback to Native Browser Voice ---
        setIsLoading(false); // No loading for native voice
        if ('speechSynthesis' in window && selectedVoice) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice.voice;
            utterance.rate = 0.9;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        } else {
            console.error("Speech synthesis not supported or no native voice selected.");
        }
    }, [isSpeaking, isLoading, selectedPersonaId, selectedVoice]);

    const cancel = useCallback(() => {
        if (premiumAudio) {
            premiumAudio.pause();
            premiumAudio.src = '';
        }
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsLoading(false);
    }, []);

    return { speak, cancel, isLoading, isSpeaking };
};