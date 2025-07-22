'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useInterviewStore } from '@/store/interviewStore';

// The final, correct interface
interface SpeechHook {
    speak: (text: string) => void;
    cancel: () => void;
    isLoading: boolean;
    isSpeaking: boolean;
    supported: boolean; // Add the missing property
}

let premiumAudio: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') premiumAudio = new Audio();

export const useSpeechSynthesis = (): SpeechHook => {
    const { selectedPersonaId, selectedVoice } = useInterviewStore(state => ({
        selectedPersonaId: state.selectedPersonaId,
        selectedVoice: state.selectedVoice,
    }));

    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) setSupported(true);
        // ... (rest of audio event listener setup is correct)
    }, []);
    
    const fallbackToNative = useCallback((text: string) => {
        if (supported && selectedVoice) {
            // ... (native fallback logic is correct)
        }
    }, [supported, selectedVoice]);

    const speak = useCallback(async (text: string) => {
        if (!text || isSpeaking || isLoading) return;
        // ... (cancel logic is correct)

        const usePremium = process.env.NEXT_PUBLIC_PREMIUM_VOICE_ENABLED === 'true';

        if (usePremium && selectedPersonaId) {
            // ... (premium voice logic is correct)
        } else {
            fallbackToNative(text);
        }
    }, [isSpeaking, isLoading, selectedPersonaId, selectedVoice, fallbackToNative]);

    const cancel = useCallback(() => { /* ... cancel logic ... */ }, []);

    // The return now matches the interface perfectly
    return { speak, cancel, isLoading, isSpeaking, supported };
};