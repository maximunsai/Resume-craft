// src/hooks/useSpeechSynthesis.ts - FINAL, DEFINITIVE VERSION

'use client';
import { useState, useCallback, useEffect } from 'react';
import { useInterviewStore } from '@/store/interviewStore';

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

        const handleEvents = () => setIsSpeaking(false);
        audio.addEventListener('pause', handleEvents);
        audio.addEventListener('ended', handleEvents);
        audio.addEventListener('error', handleEvents);
        audio.addEventListener('play', () => setIsSpeaking(true));

        return () => {
            audio.removeEventListener('pause', handleEvents);
            audio.removeEventListener('ended', handleEvents);
            audio.removeEventListener('error', handleEvents);
            audio.removeEventListener('play', () => setIsSpeaking(true));
        };
    }, []);
    
    const speak = useCallback(async (text: string, personaId: string) => {
        if (!text || !personaId || isSpeaking || isLoading) return;

        if (premiumAudio) premiumAudio.pause();
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

            if (premiumAudio) {
                premiumAudio.src = url;
                await premiumAudio.play();
            }
        } catch (error) {
            console.warn(`Premium TTS failed: ${(error as Error).message}. Falling back to native voice.`);
            if ('speechSynthesis' in window && selectedVoice) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.voice = selectedVoice.voice;
                utterance.rate = 0.9;
                utterance.onstart = () => setIsSpeaking(true);
                utterance.onend = () => setIsSpeaking(false);
                window.speechSynthesis.speak(utterance);
            }
        } finally {
            setIsLoading(false);
        }
    }, [isSpeaking, isLoading, selectedVoice]);

    const cancel = useCallback(() => {
        if (premiumAudio) {
            premiumAudio.pause();
            premiumAudio.src = '';
        }
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsLoading(false);
    }, []);

    return { speak, cancel, isLoading, isSpeaking };
};