'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useInterviewStore } from '@/store/interviewStore';

// The hook's public interface is now clean and simple.
interface SpeechHook {
    speak: (text: string) => void;
    cancel: () => void;
    isLoading: boolean;
    isSpeaking: boolean;
}

// Global audio element to prevent conflicts and handle playback reliably.
let premiumAudio: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') {
    premiumAudio = new Audio();
}

export const useSpeechSynthesis = (): SpeechHook => {
    // This hook is now "intelligent." It subscribes to the store to know the user's preferences.
    const { selectedPersonaId, selectedVoice } = useInterviewStore(state => ({
        selectedPersonaId: state.selectedPersonaId,
        selectedVoice: state.selectedVoice,
    }));

    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // This effect manages the isSpeaking state reliably via the audio element's events.
    useEffect(() => {
        if (!premiumAudio) return;
        const handlePlay = () => setIsSpeaking(true);
        const handleEnd = () => setIsSpeaking(false);
        premiumAudio.addEventListener('play', handlePlay);
        premiumAudio.addEventListener('pause', handleEnd);
        premiumAudio.addEventListener('ended', handleEnd);
        premiumAudio.addEventListener('error', (e) => {
            console.error("HTMLAudioElement error:", e);
            handleEnd();
        });
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
            setIsLoading(false); // No loading for native
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice.voice;
            utterance.rate = 0.9;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = (e) => { setIsSpeaking(false); console.error("Native speech error", e); };
            window.speechSynthesis.speak(utterance);
        } else {
            console.error("Native speech synthesis not supported or no voice selected.");
            setIsSpeaking(false); // Ensure state is reset
        }
    }, [selectedVoice]);

    // The single, unified speak function. It's the "brain" of our voice system.
    const speak = useCallback(async (text: string) => {
        if (!text || isSpeaking || isLoading) return;
        
        // Ensure any previous audio (premium or native) is stopped.
        if (premiumAudio) premiumAudio.pause();
        window.speechSynthesis.cancel();

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