'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useInterviewStore } from '@/store/interviewStore';

// The hook's public interface remains the same, so no frontend changes are needed.
interface SpeechHook {
    speak: (text: string, personaId: string) => void;
    cancel: () => void;
    isLoading: boolean;
    isSpeaking: boolean;
}

// A single, global audio element is the most robust way to handle this.
let audio: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') {
    audio = new Audio();
}

export const useSpeechSynthesis = (): SpeechHook => {
    // We get the native voice from the store purely for the fallback.
    const { selectedVoice } = useInterviewStore(state => ({ selectedVoice: state.selectedVoice }));
    
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // This effect is the "state machine." It listens to the audio element's
    // own events to reliably determine if audio is playing or not.
    // This is the most important part of the fix.
    useEffect(() => {
        if (!audio) return;
        const handlePlay = () => setIsSpeaking(true);
        const handlePauseOrEnd = () => setIsSpeaking(false);

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePauseOrEnd);
        audio.addEventListener('ended', handlePauseOrEnd);
        audio.addEventListener('error', handlePauseOrEnd); // Also stop on any playback error

        // Cleanup function to prevent memory leaks
        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePauseOrEnd);
            audio.removeEventListener('ended', handlePauseOrEnd);
            audio.removeEventListener('error', handlePauseOrEnd);
        };
    }, []);

    // This is the native browser voice fallback function.
    const fallbackToNative = useCallback((text: string) => {
        setIsLoading(false); // Ensure loading is off for the fallback
        if ('speechSynthesis' in window && selectedVoice) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice.voice;
            utterance.rate = 0.9;
            // The utterance itself has events to manage the isSpeaking state
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    }, [selectedVoice]);

    // The main function called by our application.
    const speak = useCallback(async (text: string, personaId: string) => {
        if (!text || !personaId || isSpeaking || isLoading) return;

        // Ensure any previous audio (premium or native) is stopped.
        if (audio) audio.pause();
        window.speechSynthesis.cancel();
        
        setIsLoading(true);

        try {
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, personaId }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `API request failed with status ${response.status}`);
            }
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            if (audio) {
                audio.src = url;
                // ==========================================================
                // THE CRITICAL FIX: We do NOT `await` play().
                // We fire it and immediately move on. The event listeners
                // will handle setting `isSpeaking` to true when it starts.
                // We add a `.catch()` to handle browser autoplay blocks.
                // ==========================================================
                audio.play().catch(err => {
                    console.error("Browser blocked audio playback:", err);
                    alert("Your browser blocked audio playback. Please click the speaker icon again to play the message.");
                    // Reset state if play is blocked by the browser
                    setIsLoading(false);
                    setIsSpeaking(false);
                });
            }
        } catch (error) {
            console.warn(`Premium TTS failed: ${(error as Error).message}. Falling back to native voice.`);
            fallbackToNative(text);
        } finally {
            // This is the other critical fix: isLoading is set to false as soon
            // as the fetch is complete, not after the audio finishes playing.
            setIsLoading(false);
        }
    }, [isSpeaking, isLoading, selectedVoice, fallbackToNative]);

    const cancel = useCallback(() => {
        if (audio) {
            audio.pause();
            audio.src = '';
        }
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsLoading(false);
    }, []);

    return { speak, cancel, isLoading, isSpeaking };
};