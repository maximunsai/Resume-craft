'use client';

import { useState, useEffect } from 'react';
import { type AppVoice } from '@/store/interviewStore'; // It also imports the type from the store

interface NativeSpeechSynthesisHook {
    voices: AppVoice[];
    supported: boolean;
}

export const useNativeSpeechSynthesis = (): NativeSpeechSynthesisHook => {
    const [voices, setVoices] = useState<AppVoice[]>([]);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setSupported(true);
            const handleVoicesChanged = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                const filteredVoices = availableVoices
                    .filter(voice => voice.lang.startsWith('en')) // A simpler, broader filter
                    .map(voice => ({ voice: voice, name: voice.name, lang: voice.lang }));
                setVoices(filteredVoices);
            };
            window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
            handleVoicesChanged(); 
            return () => { window.speechSynthesis.onvoiceschanged = null; };
        }
    }, []);

    return { voices, supported };
};