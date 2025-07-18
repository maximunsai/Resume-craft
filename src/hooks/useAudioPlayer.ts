// src/hooks/useAudioPlayer.ts

'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

interface AudioPlayerHook {
    playUrl: (url: string) => void;
    cancel: () => void;
    isPlaying: boolean;
}

export const useAudioPlayer = (): AudioPlayerHook => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Create the audio element once on mount
        audioRef.current = new Audio();
        const audio = audioRef.current;

        const handlePlay = () => setIsPlaying(true);
        const handlePauseOrEnd = () => setIsPlaying(false);

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePauseOrEnd);
        audio.addEventListener('ended', handlePauseOrEnd);
        audio.addEventListener('error', handlePauseOrEnd); // Also stop on error

        return () => {
            // Cleanup on unmount
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePauseOrEnd);
            audio.removeEventListener('ended', handlePauseOrEnd);
            audio.removeEventListener('error', handlePauseOrEnd);
            audio.pause();
        };
    }, []);

    const playUrl = useCallback((url: string) => {
        const audio = audioRef.current;
        if (audio) {
            audio.src = url;
            // The key is to not `await` this. We let the event listeners
            // handle the `isPlaying` state.
            audio.play().catch(err => {
                console.error("Audio playback was blocked by the browser:", err);
                setIsPlaying(false);
            });
        }
    }, []);

    const cancel = useCallback(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.pause();
            audio.src = '';
        }
    }, []);

    return { playUrl, cancel, isPlaying };
};