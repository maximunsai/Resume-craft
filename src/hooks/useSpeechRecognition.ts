// src/hooks/useSpeechRecognition.ts - ROBUST AND CORRECTED

'use client';

import { useState, useEffect, useRef } from 'react';

// Define the shape of the hook's return value
interface SpeechRecognitionHook {
    text: string;
    interimText: string;
    isListening: boolean;
    startListening: () => void;
    stopListening: () => void;
    hasRecognitionSupport: boolean;
}

// This interface combines the two possible names for the SpeechRecognition API
// to satisfy TypeScript.
interface CustomSpeechRecognition extends SpeechRecognition {
    // No new properties needed, just extends the base type
}
declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
}


export const useSpeechRecognition = (): SpeechRecognitionHook => {
    const [text, setText] = useState('');
    const [interimText, setInterimText] = useState('');
    const [isListening, setIsListening] = useState(false);
    
    // Using a ref to hold the recognition instance is safer for re-renders.
    const recognitionRef = useRef<CustomSpeechRecognition | null>(null);

    useEffect(() => {
        // This check ensures the code only runs in the browser.
        if (typeof window === 'undefined') return;

        // Check for browser support and create an instance once.
        if (!recognitionRef.current) {
            const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognitionAPI) {
                recognitionRef.current = new SpeechRecognitionAPI() as CustomSpeechRecognition;
                const recognition = recognitionRef.current;
                
                recognition.continuous = true;
                recognition.lang = 'en-US';
                recognition.interimResults = true;

                recognition.onend = () => {
                    // When recognition ends naturally, update the listening state
                    setIsListening(false);
                };

                recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
                };
            }
        }
        
        // Cleanup function: stop listening if the component unmounts.
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []); // Empty dependency array means this setup runs only once.


    // This effect handles the results from the speech recognition API
    useEffect(() => {
        const recognition = recognitionRef.current;
        if (!recognition) return;

        if (isListening) {
            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let final_transcript = '';
                let interim_transcript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final_transcript += event.results[i][0].transcript;
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                    }
                }
                setText(prev => prev + final_transcript);
                setInterimText(interim_transcript);
            };
        }
    }, [isListening]);


    const startListening = () => {
        const recognition = recognitionRef.current;
        if (recognition && !isListening) {
            setText(''); // Clear the final text
            setInterimText(''); // Clear the interim text
            recognition.start();
            setIsListening(true);
        }
    };

    const stopListening = () => {
        const recognition = recognitionRef.current;
        if (recognition && isListening) {
            recognition.stop();
            setIsListening(false);
        }
    };

    return {
        text,
        interimText,
        isListening,
        startListening,
        stopListening,
        hasRecognitionSupport: !!recognitionRef.current,
    };
};