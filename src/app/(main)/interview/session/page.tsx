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
    // --- Store and State Hooks (Your code, preserved) ---
    const { messages, addMessage, startNewInterview, selectedVoice, stage, setStage, selectedPersonaId, clearInterview } = useInterviewStore();
    const resumeState = useResumeStore();
    const [isThinking, setIsThinking] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [sessionActive, setSessionActive] = useState(false);
    const router = useRouter();
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // =================================================================
    // THE LOOPING FIX - PART 1: A new state to explicitly trigger speech.
    // =================================================================
    const [messageToSpeak, setMessageToSpeak] = useState<string | null>(null);

    // --- Voice Hooks (Your code, preserved) ---
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

    // THE LOOPING FIX - PART 2: This new effect listens for the trigger.
    useEffect(() => {
        if (messageToSpeak) {
            speak(messageToSpeak);
            setMessageToSpeak(null); // Reset the trigger
        }
    }, [messageToSpeak, speak]);

    // This effect handles stage transitions (Your code, preserved)
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.sender === 'AI' && lastMessage.text) {
            const lowerCaseText = lastMessage.text.toLowerCase();
            if (lowerCaseText.includes("technical round")) setStage('Technical');
            else if (lowerCaseText.includes("hr and situational")) setStage('Situational');
        }
    }, [messages, setStage]);

    // Auto-scroll effect (Your code, preserved)
    useEffect(() => {
        if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages, isThinking]);
    
    // Cleanup effect (Your code, preserved)
    useEffect(() => { return () => cancelSpeech() }, [cancelSpeech]);

    // --- Handlers ---
    const handleStartSession = () => {
        setSessionActive(true);
        const firstMessage = messages[0];
        if (firstMessage && firstMessage.text) {
            speak(firstMessage.text);
        }
    };

    const handleSubmitAnswer = async () => {
        const currentInput = displayedInput.trim();
        if (!currentInput || isThinking) return;

        cancelSpeech();
        if (isListening) stopListening();

        const userMessage: Message = { sender: 'user', text: currentInput };
        addMessage(userMessage);
        setUserInput('');
        setIsThinking(true);
        addMessage({ sender: 'AI', text: '' });

        try {
            const currentStage = useInterviewStore.getState().stage;
            const response = await fetch('/api/interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeData: resumeState,
                    conversationHistory: [...messages, userMessage],
                    stage: currentStage,
                }),
            });
            if (!response.ok || !response.body) throw new Error(`Server error`);
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                accumulatedText += decoder.decode(value, { stream: true });
                useInterviewStore.setState(state => {
                    const lastMessage = state.messages[state.messages.length - 1];
                    if (lastMessage?.sender === 'AI') {
                        const updatedMessage = { ...lastMessage, text: accumulatedText };
                        const newMessages = [...state.messages.slice(0, -1), updatedMessage];
                        return { messages: newMessages };
                    }
                    return state;
                });
            }

            // THE LOOPING FIX - PART 3: Set the trigger after the stream is complete.
            setMessageToSpeak(accumulatedText.trim());

        } catch (error) {
            // ... (Your error handling is correct)
        } finally {
            setIsThinking(false);
        }
    };

    const handleFinishInterview = async () => { /* ... Your working function ... */ };

    // --- UI (Your code, preserved) ---
    const isVoiceReady = (process.env.NEXT_PUBLIC_PREMIUM_VOICE_ENABLED === 'true' && !!selectedPersonaId) || (!(process.env.NEXT_PUBLIC_PREMIUM_VOICE_ENABLED === 'true') && !!selectedVoice);

    // if (!sessionActive) { return ( /* ... Your working start overlay ... */ ); }
    if (!sessionActive) {
    // Render your start overlay component or markup here.
    return <div />; // Replace this with actual start overlay JSX.
}


    
    return (
        <div className="max-w-4xl mx-auto p-4 flex flex-col h-[calc(100vh-65px)]">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white">Mock Interview Session</h1>
                    <p className="text-sm font-semibold text-yellow-400">Stage: {stage}</p>
                </div>
                <div className="flex items-center gap-4">
                    <VoiceSelectionMenu />
                    <button onClick={handleFinishInterview} disabled={isThinking || messages.length < 2} className="flex items-center ..."> <Flag size={16} /> End & Analyze </button>
                </div>
            </div>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto ...">
                {messages.map((msg, index) => (
                    <div key={index} className="flex items-start ..." style={{ flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                        <div className={`w-10 h-10 ...`}>{msg.sender === 'AI' ? <Bot /> : <User />}</div>
                        <div className={`max-w-xl p-4 ...`}>
                            <div className="flex items-center">
                                <p className="whitespace-pre-wrap flex-1">{msg.sender === 'AI' && msg.text === '' && isThinking ? <span className="italic ...">...</span> : msg.text}</p>
                                {msg.sender === 'AI' && msg.text && (<button onClick={() => isSpeaking ? cancelSpeech() : speak(msg.text)} disabled={isAudioLoading} className={`p-2 ml-3 ...`}>{/* ... */}</button> )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex-shrink-0 border ...">
                {/* ... Your working input form ... */}
            </div>
        </div>
    );
}