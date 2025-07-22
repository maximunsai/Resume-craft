'use client';

import { useState, useCallback, useEffect } from 'react';
import { useInterviewStore } from '@/store/interviewStore';

interface SpeechHook {
    speak: (text: string) => void;
    cancel: () => void;
    isLoading: boolean;
    isSpeaking: boolean;
    supported: boolean;
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
        if (!premiumAudio) return;
        const handlePlay = () => setIsSpeaking(true);
        const handleEnd = () => setIsSpeaking(false);
        premiumAudio.addEventListener('play', handlePlay);
        premiumAudio.addEventListener('pause', handleEnd);
        premiumAudio.addEventListener('ended', handleEnd);
        premiumAudio.addEventListener('error', handleEnd);
        return () => { /* Cleanup listeners */ };
    }, []);
    
    const fallbackToNative = useCallback((text: string) => {
        if (supported && selectedVoice) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice.voice;
            utterance.rate = 0.9;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    }, [supported, selectedVoice]);

    const speak = useCallback(async (text: string) => {
        if (!text || isSpeaking || isLoading) return;
        
        if (premiumAudio) premiumAudio.pause();
        window.speechSynthesis.cancel();

        const usePremium = process.env.NEXT_PUBLIC_PREMIUM_VOICE_ENABLED === 'true';

        if (usePremium && selectedPersonaId) {
            setIsLoading(true);

            try {
                const response = await fetch('/api/tts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, personaId: selectedPersonaId }),
                });
                if (!response.ok) throw new Error("API request failed");
                
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                if (premiumAudio) await premiumAudio.play();
            } catch (error) {
                console.warn(`Premium TTS failed: ${(error as Error).message}. Falling back.`);
                fallbackToNative(text);
            } finally {
                setIsLoading(false);
            }
        } else {
            fallbackToNative(text);
        }
    }, [isSpeaking, isLoading, selectedPersonaId, selectedVoice, fallbackToNative]);

    const cancel = useCallback(() => { /* ... cancel logic ... */ }, []);

    return { speak, cancel, isLoading, isSpeaking, supported };
};