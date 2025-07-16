// src/hooks/useSpeechSynthesis.ts

'use client';

import { useState, useEffect } from 'react';

interface SpeechSynthesisHook {
    speak: (text: string) => void;
    cancel: () => void;
    isSpeaking: boolean;
    supported: boolean;
}

export const useSpeechSynthesis = (): SpeechSynthesisHook => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setSupported(true);
        }
    }, []);

    const speak = (text: string) => {
        if (!supported || isSpeaking) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9; // Slightly slower for clarity

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error('Speech synthesis error', e);
            setIsSpeaking(false);
        };
        
        window.speechSynthesis.speak(utterance);
    };

    const cancel = () => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    return { speak, cancel, isSpeaking, supported };
};