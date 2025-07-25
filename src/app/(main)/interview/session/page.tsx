'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/store/resumeStore';
import { useInterviewStore, Message } from '@/store/interviewStore';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'; 
import { VoiceSelectionMenu } from '@/components/VoiceSelectionMenu';
import { Bot, User, Send, Mic, MicOff, Volume2, StopCircle, Flag, PlayCircle } from 'lucide-react';

export default function InterviewSessionPage() {
    // --- Store and State Hooks ---
    const { messages, addMessage, startNewInterview, selectedVoice, stage, setStage, selectedPersonaId } = useInterviewStore();
    const resumeState = useResumeStore();
    const [isThinking, setIsThinking] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [sessionActive, setSessionActive] = useState(false);
    const [lastSpokenMessageIndex, setLastSpokenMessageIndex] = useState<number | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // --- Voice Hooks ---
    const { text: speechToText, interimText, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();
    const { speak, cancel: cancelSpeech, isLoading: isAudioLoading, isSpeaking } = useSpeechSynthesis();

    // --- Effects ---
    useEffect(() => {
        if (speechToText) setUserInput(prev => (prev ? prev + ' ' : '').trim() + speechToText);
    }, [speechToText]);

    const displayedInput = isListening ? (userInput.endsWith(' ') ? userInput : userInput + ' ') + interimText : userInput;

    useEffect(() => {
        if (messages.length === 0) {
            startNewInterview(`Hello, ${resumeState.personal.name || 'there'}. Welcome to the forge. To start, could you please walk me through your resume?`);
        }
    }, [messages.length, resumeState.personal.name, startNewInterview]);

    // This effect handles speaking and prevents looping
    useEffect(() => {
        if (!sessionActive) return;
        const lastMessageIndex = messages.length - 1;
        const lastMessage = messages[lastMessageIndex];
        
        if (lastMessage && lastMessage.sender === 'AI' && lastMessage.text && !isThinking && lastSpokenMessageIndex !== lastMessageIndex) {
            const lowerCaseText = lastMessage.text.toLowerCase();
            if (!lowerCaseText.includes("technical round") && !lowerCaseText.includes("hr and situational")) {
                speak(lastMessage.text);
            }
            setLastSpokenMessageIndex(lastMessageIndex);
        }
    }, [messages, sessionActive, isThinking, speak, lastSpokenMessageIndex]);

    // This effect handles stage transitions
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.sender === 'AI' && lastMessage.text) {
            const lowerCaseText = lastMessage.text.toLowerCase();
            if (lowerCaseText.includes("technical round")) setStage('Technical');
            else if (lowerCaseText.includes("hr and situational")) setStage('Situational');
        }
    }, [messages, setStage]);

    useEffect(() => {
        if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages, isThinking]);

    // --- Handlers ---
    const handleStartSession = () => {
        setSessionActive(true);
        const firstMessage = messages[0];
        if (firstMessage && firstMessage.text) {
            speak(firstMessage.text);
        }
    };

    // =================================================================
    // THIS IS THE DEFINITIVELY CORRECTED FUNCTION
    // =================================================================
    const handleSubmitAnswer = async () => {
        const currentInput = displayedInput.trim();
        if (!currentInput || isThinking) return;

        if (isSpeaking) cancelSpeech();
        if (isListening) stopListening();

        const userMessage: Message = { sender: 'user', text: currentInput };
        addMessage(userMessage);
        setUserInput('');
        setIsThinking(true);
        addMessage({ sender: 'AI', text: '' });

        try {
            // FIX 1: Get the LATEST stage from the store right before the API call.
            const currentStage = useInterviewStore.getState().stage;

            const response = await fetch('/api/interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeData: { name: resumeState.personal.name, experience: resumeState.experience, skills: resumeState.skills },
                    conversationHistory: [...messages, userMessage],
                    stage: currentStage, // Pass the correct, up-to-date stage
                }),
            });

            if (!response.ok || !response.body) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                accumulatedText += chunk;
                
                // FIX 2: Use a proper immutable update for the streaming text.
                useInterviewStore.setState(state => {
                    const lastMessage = state.messages[state.messages.length - 1];
                    if (lastMessage && lastMessage.sender === 'AI') {
                        const updatedMessage = { ...lastMessage, text: accumulatedText };
                        const newMessages = [...state.messages.slice(0, -1), updatedMessage];
                        return { messages: newMessages };
                    }
                    return state;
                });
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown connection error occurred.";
            console.error("Failed to get response from interview API:", error);
            useInterviewStore.setState(state => {
                const lastMessage = state.messages[state.messages.length - 1];
                if (lastMessage && lastMessage.sender === 'AI') {
                    const updatedMessage = { ...lastMessage, text: `Sorry, a technical issue occurred: ${errorMessage}` };
                    const newMessages = [...state.messages.slice(0, -1), updatedMessage];
                    return { messages: newMessages };
                }
                return state;
            });
        } finally {
            setIsThinking(false);
        }
    };

        // =================================================================
    // THIS IS THE DEFINITIVE, FINAL, AND CORRECT FUNCTION
    // =================================================================
    const handleFinishInterview = async () => {
        // Prevent the user from clicking again while processing
        if (isThinking) return;

        // Immediately cancel any currently playing audio
        cancelSpeech();
        
        // Use the thinking state to show a loading indicator on the page
        setIsThinking(true);
        
        try {
            // Step 1: Call our backend to get the final analysis from the AI
            // We show a user-friendly alert while this is happening
            alert("Analyzing your performance... please wait a moment.");
            
            const analysisResponse = await fetch('/api/analyze-interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript: messages })
            });
            const analysisData = await analysisResponse.json();
            
            if (!analysisResponse.ok) {
                // If AI analysis fails, inform the user and stop.
                throw new Error(analysisData.error || "Failed to generate the final analysis from the AI.");
            }

            // Step 2: Call our backend to save the transcript and the new analysis to the database
            console.log("Saving interview results to the database...");
            const saveResponse = await fetch('/api/save-interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    transcript: messages, 
                    overall_feedback: analysisData.overall_feedback 
                })
            });
            const saveData = await saveResponse.json();
            
            if (!saveResponse.ok) {
                throw new Error(saveData.error || "Failed to save the interview session to your account.");
            }
            
            // Step 3: On success, redirect the user to their new, unique analytics page
            console.log(`Redirecting to analytics page for interview ID: ${saveData.interview_id}`);
            router.push(`/interview/analytics/${saveData.interview_id}`);

        } catch (error) {
            console.error("Failed to finish interview:", error);
            // Show a specific error message to the user
            alert(`An error occurred while finishing the interview: ${(error as Error).message}`);
            // IMPORTANT: Turn off the loading state if any step fails
            setIsThinking(false);
        }
        // Note: We don't set isThinking to false in a `finally` block here because
        // a successful run will navigate away from the page anyway.
    };
}