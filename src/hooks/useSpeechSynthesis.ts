// src/hooks/useSpeechSynthesis.ts - DEFINITIVE VERSION

'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useInterviewStore } from '@/store/interviewStore';

interface SpeechHook {
    speak: (text: string) => void;
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
    const { selectedPersonaId, selectedVoice } = useInterviewStore(state => ({
        selectedPersonaId: state.selectedPersonaId,
        selectedVoice: state.selectedVoice,
    }));

    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

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
    
    const speak = useCallback(async (text: string) => {
        if (!text || isSpeaking || isLoading) return;

        if (premiumAudio) premiumAudio.pause();
        window.speechSynthesis.cancel();
        
        setIsLoading(true);
        setIsSpeaking(false); // Reset speaking state

        if (selectedPersonaId) {
            try {
                const response = await fetch('/api/tts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, personaId: selectedPersonaId }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "API request failed");
                }
                
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                if (premiumAudio) {
                    premiumAudio.src = url;
                    await premiumAudio.play();
                }
                // setLoading is handled by the 'play' and 'ended' events now

            } catch (error)  {
                console.warn(`Premium TTS failed: ${(error as Error).message}. Falling back to native voice.`);
                fallbackToNative(text);
            } finally {
                // ==========================================================
                // THE FIX IS HERE: Ensure isLoading is always set to false
                // if the premium audio process completes or fails.
                // ==========================================================
                setIsLoading(false);
            }
        } else {
            fallbackToNative(text);
        }
    }, [isSpeaking, isLoading, selectedPersonaId, selectedVoice]);
    
    // Helper function for the native fallback voice
    const fallbackToNative = (text: string) => {
        setIsLoading(false); // Make sure loading is off for native
        if ('speechSynthesis' in window && selectedVoice) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice.voice;
            utterance.rate = 0.9;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

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