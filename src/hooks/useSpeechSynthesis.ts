// src/hooks/useSpeechSynthesis.ts - UPGRADED FOR VOICE SELECTION

'use client';

import { useState, useEffect } from 'react';

// Define the shape of a voice object
export interface AppVoice {
    voice: SpeechSynthesisVoice;
    name: string;
    lang: string;
}

interface SpeechSynthesisHook {
    speak: (text: string, selectedVoice?: SpeechSynthesisVoice) => void;
    cancel: () => void;
    isSpeaking: boolean;
    supported: boolean;
    voices: AppVoice[]; // Expose the list of available voices
}

export const useSpeechSynthesis = (): SpeechSynthesisHook => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);
    const [voices, setVoices] = useState<AppVoice[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setSupported(true);

            const handleVoicesChanged = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                const filteredVoices = availableVoices
                    // Filter for high-quality English voices
                    .filter(voice => voice.lang.startsWith('en') && voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Daniel') || voice.name.includes('Karen'))
                    .map(voice => ({ voice, name: voice.name, lang: voice.lang }));
                
                setVoices(filteredVoices);
            };

            // The 'voiceschanged' event fires when the list of voices is ready
            window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
            // Also call it once manually in case the event already fired
            handleVoicesChanged(); 

            // Cleanup
            return () => {
                window.speechSynthesis.onvoiceschanged = null;
            };
        }
    }, []);

    // The speak function now accepts an optional voice object
    const speak = (text: string, selectedVoice?: SpeechSynthesisVoice) => {
        if (!supported || isSpeaking) return;

        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        } else {
            // Fallback to a default preferred voice if none is selected
            utterance.lang = 'en-US';
        }
        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error('Speech synthesis error', e);
            setIsSpeaking(false);
        };
        
        // Cancel any previous speech before starting a new one
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };

    const cancel = () => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    return { speak, cancel, isSpeaking, supported, voices };
};