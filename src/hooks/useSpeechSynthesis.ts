// src/hooks/useSpeechSynthesis.ts - THE UNIFIED, FINAL VERSION

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useInterviewStore } from '@/store/interviewStore'; // The hook now accesses the store directly

interface SpeechHook {
    speak: (text: string) => void; // The component only needs to provide the text
    cancel: () => void;
    isLoading: boolean;
    isSpeaking: boolean;
}

export const useSpeechSynthesis = (): SpeechHook => {
    // This hook now subscribes to the store to get the user's voice preferences
    const { selectedPersonaId, selectedVoice } = useInterviewStore(state => ({
        selectedPersonaId: state.selectedPersonaId,
        selectedVoice: state.selectedVoice,
    }));

    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create a single, persistent audio element
        audioRef.current = new Audio();
        const audio = audioRef.current;
        audio.onplay = () => setIsSpeaking(true);
        audio.onpause = () => setIsSpeaking(false);
        audio.onended = () => setIsSpeaking(false);

        // Cleanup on unmount
        return () => { audio?.pause(); };
    }, []);
    
    // The main 'speak' function, now simplified from the component's perspective
    const speak = useCallback(async (text: string) => {
        if (!text || isSpeaking || isLoading) return;

        // Ensure any previous audio is stopped
        if (audioRef.current) audioRef.current.pause();
        window.speechSynthesis.cancel();
        
        setIsLoading(true);

        // --- Premium API First ---
        if (selectedPersonaId) {
            try {
                const response = await fetch('/api/tts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, personaId: selectedPersonaId }),
                });

                if (!response.ok) throw new Error("ElevenLabs API request failed");
                
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                if (audioRef.current) {
                    audioRef.current.src = url;
                    await audioRef.current.play();
                }
                setIsLoading(false);
                return; // Success! Exit the function.

            } catch (error) {
                console.warn(`Premium TTS failed for persona '${selectedPersonaId}': ${(error as Error).message}. Falling back.`);
                // If it fails, we fall through to the native voice below.
            }
        }
        
        // --- Fallback to Native Browser Voice ---
        setIsLoading(false); // No loading for native voice
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            if (selectedVoice) {
                utterance.voice = selectedVoice.voice;
            } else {
                utterance.lang = 'en-US'; // Default if no voice selected
            }
            utterance.rate = 0.9;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        } else {
            console.error("Speech synthesis not supported by this browser.");
        }
    }, [isSpeaking, isLoading, selectedPersonaId, selectedVoice]);

    const cancel = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsLoading(false);
    }, []);

    return { speak, cancel, isLoading, isSpeaking };
};