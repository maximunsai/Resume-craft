'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useInterviewStore } from '@/store/interviewStore';

// The hook's public interface is now simple and clean.
interface SpeechHook {
    speak: (text: string) => void;
    cancel: () => void;
    isLoading: boolean;
    isSpeaking: boolean;
}

// A single, global audio element is the most robust way to handle playback.
let premiumAudio: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') {
    premiumAudio = new Audio();
}

export const useSpeechSynthesis = (): SpeechHook => {
    // This hook is "intelligent." It subscribes to the store to get the user's preferences.
    const { selectedPersonaId, selectedVoice } = useInterviewStore(state => ({
        selectedPersonaId: state.selectedPersonaId,
        selectedVoice: state.selectedVoice,
    }));

    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // This effect manages the isSpeaking state reliably via audio element events.
    useEffect(() => {
        if (!premiumAudio) return;
        const handlePlay = () => setIsSpeaking(true);
        const handleEnd = () => setIsSpeaking(false);
        premiumAudio.addEventListener('play', handlePlay);
        premiumAudio.addEventListener('pause', handleEnd);
        premiumAudio.addEventListener('ended', handleEnd);
        premiumAudio.addEventListener('error', handleEnd);
        return () => {
            premiumAudio?.removeEventListener('play', handlePlay);
            premiumAudio?.removeEventListener('pause', handleEnd);
            premiumAudio?.removeEventListener('ended', handleEnd);
            premiumAudio?.removeEventListener('error', handleEnd);
        };
    }, []);
    
    // Internal helper function for the native browser voice fallback.
    const fallbackToNative = useCallback((text: string) => {
        if ('speechSynthesis' in window && selectedVoice) {
            setIsLoading(false);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice.voice;
            utterance.rate = 0.9;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = (e) => { setIsSpeaking(false); console.error("Native speech error", e); };
            window.speechSynthesis.speak(utterance);
        } else {
            console.error("Native speech synthesis not supported or no voice selected.");
            setIsSpeaking(false);
        }
    }, [selectedVoice]);

    // The single, unified speak function. The component just calls this.
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
                fallbackToNative(text);
            } finally {
                setIsLoading(false);
            }
        } else {
            fallbackToNative(text);
        }
    }, [isSpeaking, isLoading, selectedPersonaId, selectedVoice, fallbackToNative]);

    const cancel = useCallback(() => {
        if (premiumAudio) {
            premiumAudio.pause();
            premiumAudio.src = '';
        }
        window.speechSynthesis.cancel();
        setIsLoading(false);
        setIsSpeaking(false);
    }, []);

    return { speak, cancel, isLoading, isSpeaking };
};