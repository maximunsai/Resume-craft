'use client';

import { useState, useEffect, useCallback } from 'react';

// Keep the AppVoice interface for the browser voice fallback and selection UI
export interface AppVoice {
    voice: SpeechSynthesisVoice;
    name: string;
    lang: string;
}

interface SpeechSynthesisHook {
    speak: (text: string, selectedBrowserVoice?: SpeechSynthesisVoice) => void;
    cancel: () => void;
    isSpeaking: boolean;
    isLoading: boolean; // NEW: To show when audio is being fetched
    supported: boolean;
    voices: AppVoice[];
}

// A global audio element to ensure only one sound plays at a time
let audio: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') {
    audio = new Audio();
}

export const useSpeechSynthesis = (): SpeechSynthesisHook => {
    // =================================================================
    // THE FIX IS HERE: Removed the incorrect quotes around `useState`
    // =================================================================
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // =================================================================

    const [supported, setSupported] = useState(false);
    const [voices, setVoices] = useState<AppVoice[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setSupported(true);

            const handleVoicesChanged = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                const filteredVoices = availableVoices
                    .filter(voice => voice.lang.startsWith('en') && (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Apple') || voice.name.includes('Daniel') || voice.name.includes('Karen')))
                    .map(voice => ({ voice, name: voice.name, lang: voice.lang }));
                setVoices(filteredVoices);
                if (audio) {
                    audio.pause();
                    audio.src = '';
                }
            };

            window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
            handleVoicesChanged(); 

            return () => {
                window.speechSynthesis.onvoiceschanged = null;
                if(audio) {
                    audio.pause();
                }
            };
        }
    }, []);

    const speakNative = useCallback((text: string, selectedBrowserVoice?: SpeechSynthesisVoice) => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedBrowserVoice) utterance.voice = selectedBrowserVoice;
        else utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onstart = () => {
            setIsLoading(false);
            setIsSpeaking(true);
        };
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [supported]);

    const speak = useCallback(async (text: string, selectedBrowserVoice?: SpeechSynthesisVoice) => {
        if (!text || isSpeaking || isLoading) return;

        if (audio) audio.pause();
        window.speechSynthesis.cancel();
        
        setIsLoading(true);
        setIsSpeaking(false);

        try {
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error('ElevenLabs API request failed');
            }
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            if (audio) {
                audio.src = url;
                audio.load(); // Ensure the new source is loaded
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        setIsLoading(false);
                        setIsSpeaking(true);
                    }).catch(error => {
                        console.error("Audio playback error:", error);
                        speakNative(text, selectedBrowserVoice);
                    });
                }
                
                audio.onended = () => setIsSpeaking(false);
                audio.onerror = () => {
                    console.error("Error playing premium audio, falling back.");
                    setIsLoading(false);
                    setIsSpeaking(false);
                    speakNative(text, selectedBrowserVoice);
                };
            } else {
                 throw new Error("Audio element not available.");
            }
        } catch (error) {
            console.warn(`Premium TTS failed: ${(error as Error).message}. Falling back to native browser voice.`);
            speakNative(text, selectedBrowserVoice);
        }
    }, [isSpeaking, isLoading, speakNative]);

    const cancel = useCallback(() => {
        if (audio) {
            audio.pause();
            audio.src = '';
        }
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsLoading(false);
    }, []);

    return { speak, cancel, isSpeaking, isLoading, supported, voices };
};