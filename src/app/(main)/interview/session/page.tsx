'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/store/resumeStore';
import { useInterviewStore, Message } from '@/store/interviewStore';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'; // The new, intelligent hook
import { VoiceSelectionMenu } from '@/components/VoiceSelectionMenu';
import { Bot, User, Send, Mic, MicOff, Volume2, StopCircle, Flag } from 'lucide-react';

export default function InterviewSessionPage() {
    // --- Store and State Hooks ---
    const { messages, addMessage, startNewInterview } = useInterviewStore();
    const resumeState = useResumeStore();
    const [isThinking, setIsThinking] = useState(false);
    const [userInput, setUserInput] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // --- Voice Hooks ---
    const { text: speechToText, interimText, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();
    // THE COMPONENT IS NOW "DUMB". It just gets the functions it needs.
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

    // This effect is now simplified: it speaks the latest AI message.
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.sender === 'AI' && lastMessage.text) {
            speak(lastMessage.text);
        }
    }, [messages, speak]);

    useEffect(() => {
        if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages, isThinking]);

    // --- Handlers ---
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
            const response = await fetch('/api/interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeData: { name: resumeState.personal.name, experience: resumeState.experience, skills: resumeState.skills },
                    conversationHistory: [...messages, userMessage],
                }),
            });

            if (!response.ok || !response.body) throw new Error(`Server error`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            // This is now an effect-driven process, so we remove the `speak` call from here.
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                useInterviewStore.setState(state => {
                    const lastMessage = state.messages[state.messages.length - 1];
                    if (lastMessage?.sender === 'AI') {
                        lastMessage.text += chunk; // Append chunk
                        return { messages: [...state.messages] };
                    }
                    return state;
                });
            }
        } catch (error) {
            // ... (error handling)
        } finally {
            setIsThinking(false);
        }
    };
    
    const handleFinishInterview = async () => { /* ... */ };

    // --- JSX ---
    return (
        <div className="max-w-4xl mx-auto p-4 flex flex-col h-[calc(100vh-65px)]">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h1 className="text-2xl font-bold text-white">Mock Interview Session</h1>
                <VoiceSelectionMenu />
            </div>
            
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto ...">
                {messages.map((msg, index) => (
                    <div key={index} /* ... */>
                        {/* ... Avatars ... */}
                        <div /* ... */>
                            <div className="flex items-center">
                                <p /* ... */>{msg.text}</p>
                                {msg.sender === 'AI' && msg.text && (
                                   <button 
                                     // The onClick is now simple.
                                     onClick={() => isSpeaking ? cancelSpeech() : speak(msg.text)} 
                                     /* ... */>
                                       {/* ... icons ... */}
                                   </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex-shrink-0 border ...">
                {/* ... The Text Input Form ... */}
            </div>
        </div>
    );
}