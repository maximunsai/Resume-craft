// src/hooks/useSpeechSynthesis.ts - THE FINAL VERSION

'use client';
import { useState, useCallback } from 'react';
import { useInterviewStore } from '@/store/interviewStore';
import { useAudioPlayer } from './useAudioPlayer'; // <-- Import our new hook

interface SpeechHook {
    speak: (text: string) => void;
    cancel: () => void;
    isLoading: boolean;
    isSpeaking: boolean;
}

export const useSpeechSynthesis = (): SpeechHook => {
    const { selectedPersonaId, selectedVoice } = useInterviewStore(state => ({
        selectedPersonaId: state.selectedPersonaId,
        selectedVoice: state.selectedVoice,
    }));

    const [isLoading, setIsLoading] = useState(false);
    // The audio player now manages its own isPlaying state
    const { playUrl: playPremiumAudio, cancel: cancelPremiumAudio, isPlaying: isSpeaking } = useAudioPlayer();

    // The native fallback does not use the audio player
    const fallbackToNative = useCallback((text: string) => {
        if ('speechSynthesis' in window && selectedVoice) {
            window.speechSynthesis.cancel(); // Cancel any lingering speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice.voice;
            utterance.rate = 0.9;
            // We can manage a separate speaking state for this if needed, but it's often not necessary
            window.speechSynthesis.speak(utterance);
        }
    }, [selectedVoice]);

    const speak = useCallback(async (text: string) => {
        if (!text || isSpeaking || isLoading) return;

        cancelPremiumAudio();
        window.speechSynthesis.cancel();
        
        if (selectedPersonaId) {
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
                
                // Hand off the URL to our reliable player
                playPremiumAudio(url);
                
            } catch (error)  {
                console.warn(`Premium TTS failed: ${(error as Error).message}. Falling back.`);
                fallbackToNative(text);
            } finally {
                setIsLoading(false);
            }
        } else {
            // If no premium voice is selected, go straight to fallback
            fallbackToNative(text);
        }
    }, [isSpeaking, isLoading, selectedPersonaId, playPremiumAudio, fallbackToNative, cancelPremiumAudio]);

    const cancel = useCallback(() => {
        cancelPremiumAudio();
        window.speechSynthesis.cancel();
    }, [cancelPremiumAudio]);

    return { speak, cancel, isLoading, isSpeaking };
};