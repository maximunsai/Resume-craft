'use client';

import { useState, useCallback, useEffect } from 'react';
import { useInterviewStore } from '@/store/interviewStore';

interface SpeechHook {
    speak: (text: string) => void; // The component ONLY needs to provide the text
    cancel: () => void;
    isLoading: boolean;
    isSpeaking: boolean;
}

let premiumAudio: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') premiumAudio = new Audio();

export const useSpeechSynthesis = (): SpeechHook => {
    // The hook subscribes to the store to get ALL voice preferences.
    const { selectedPersonaId, selectedVoice } = useInterviewStore(state => ({
        selectedPersonaId: state.selectedPersonaId,
        selectedVoice: state.selectedVoice,
    }));

    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        // ... (The audio event listener setup is correct and unchanged)
    }, []);
    
    // This is the main 'speak' function. The component just calls this.
    const speak = useCallback(async (text: string) => {
        if (!text || isSpeaking || isLoading) return;
        
        // Ensure any previous audio is stopped.
        if (premiumAudio) premiumAudio.pause();
        window.speechSynthesis.cancel();
        
        // This is the "master switch" logic.
        const usePremium = process.env.NEXT_PUBLIC_PREMIUM_VOICE_ENABLED === 'true';

        if (usePremium && selectedPersonaId) {
            // --- PREMIUM VOICE PATH ---
            setIsLoading(true);
            try {
                const response = await fetch('/api/tts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, personaId: selectedPersonaId }),
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || `API Error: Status ${response.status}`);
                }
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                if (premiumAudio) {
                    premiumAudio.src = url;
                    await premiumAudio.play();
                }
            } catch (error) {
                console.warn(`Premium TTS failed: ${(error as Error).message}. Falling back to native voice.`);
                fallbackToNative(text); // Fallback on error
            } finally {
                setIsLoading(false);
            }
        } else {
            // --- FREE BROWSER VOICE (FALLBACK) PATH ---
            fallbackToNative(text);
        }
    }, [isSpeaking, isLoading, selectedPersonaId, selectedVoice]);
    
    // The native fallback function is now an internal helper.
    const fallbackToNative = (text: string) => {
        if ('speechSynthesis' in window && selectedVoice) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice.voice;
            utterance.rate = 0.9;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = (e) => { setIsSpeaking(false); console.error("Native speech error", e); };
            window.speechSynthesis.speak(utterance);
        }
    };

    const cancel = useCallback(() => { /* ... Unchanged ... */ }, []);

    return { speak, cancel, isLoading, isSpeaking };
};