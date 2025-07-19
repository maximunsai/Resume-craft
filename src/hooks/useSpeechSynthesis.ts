'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useInterviewStore } from '@/store/interviewStore';

// THE CORRECTED INTERFACE: It now includes isLoading and isSpeaking
interface SpeechHook {
    speak: (text: string, personaId: string) => void;
    cancel: () => void;
    isLoading: boolean;
    isSpeaking: boolean;
}

let premiumAudio: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') premiumAudio = new Audio();

export const useSpeechSynthesis = (): SpeechHook => {
    const { selectedVoice } = useInterviewStore(state => ({ selectedVoice: state.selectedVoice }));
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        const audio = premiumAudio;
        if (!audio) return;
        const handlePlay = () => setIsSpeaking(true);
        const handleEnd = () => setIsSpeaking(false);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handleEnd);
        audio.addEventListener('ended', handleEnd);
        audio.addEventListener('error', handleEnd);
        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handleEnd);
            audio.removeEventListener('ended', handleEnd);
            audio.removeEventListener('error', handleEnd);
        };
    }, []);
    
    const fallbackToNative = useCallback((text: string) => {
        // ... (This function is correct and unchanged)
    }, [selectedVoice]);

    const speak = useCallback(async (text: string, personaId: string) => {
        // ... (This function is correct and unchanged)
    }, [isSpeaking, isLoading, selectedVoice, fallbackToNative]);

    const cancel = useCallback(() => {
        // ... (This function is correct and unchanged)
    }, []);

    // The return statement is now correctly matched by the interface above
    return { speak, cancel, isLoading, isSpeaking };
};