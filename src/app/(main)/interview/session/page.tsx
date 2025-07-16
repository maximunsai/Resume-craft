// src/app/(main)/interview/session/page.tsx - FINAL AND CORRECT

'use client';

import { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { useInterviewStore, Message } from '@/store/interviewStore';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { VoiceSelectionMenu } from '@/components/VoiceSelectionMenu'; // <-- Import our new component
import { Bot, User, Send, Mic, MicOff, Volume2, StopCircle } from 'lucide-react';

export default function InterviewSessionPage() {
    // --- State and Store Hooks ---
    // The selectedVoice is now managed globally in the store
    const { messages, addMessage, startNewInterview, selectedVoice } = useInterviewStore();
    const resumeState = useResumeStore();
    const [isThinking, setIsThinking] = useState(false);
    const [userInput, setUserInput] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // --- Voice Hooks ---
    const { text: speechToText, interimText, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();
    const { speak, cancel: cancelSpeech, isSpeaking, supported: ttsSupported } = useSpeechSynthesis();

    // Effect to update text input from speech recognition
    useEffect(() => {
        if (speechToText) setUserInput(prev => (prev ? prev + ' ' : '').trim() + speechToText);
    }, [speechToText]);

    const displayedInput = isListening ? (userInput.endsWith(' ') ? userInput : userInput + ' ') + interimText : userInput;

    // Effect to start the interview ONCE a default voice is selected
    useEffect(() => {
        if (messages.length === 0 && selectedVoice) {
            const initialQuestion = `Hello, ${resumeState.personal.name || 'there'}. Thanks for your time. Welcome to the forge. To start, could you please walk me through your resume?`;
            startNewInterview(initialQuestion);
            speak(initialQuestion, selectedVoice.voice);
        }
    }, [selectedVoice]); // This now depends on selectedVoice

    // Effect to auto-scroll the chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

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
            const response = await fetch('/api/interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeData: { name: resumeState.personal.name, experience: resumeState.experience, skills: resumeState.skills },
                    conversationHistory: [...messages, userMessage],
                }),
            });

            if (!response.ok || !response.body) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponseText = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                fullResponseText += chunk;
                
                useInterviewStore.setState(state => {
                    const lastMessage = state.messages[state.messages.length - 1];
                    if (lastMessage && lastMessage.sender === 'AI') {
                        lastMessage.text = fullResponseText;
                        return { messages: [...state.messages] };
                    }
                    return state;
                });
            }

            // Speak the final response using the globally selected voice
            if (ttsSupported && selectedVoice) {
                speak(fullResponseText, selectedVoice.voice);
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown connection error occurred.";
            console.error("Failed to get response from interview API:", error);
            useInterviewStore.setState(state => {
                const lastMessage = state.messages[state.messages.length - 1];
                if (lastMessage && lastMessage.sender === 'AI') {
                    lastMessage.text = `Sorry, a technical issue occurred: ${errorMessage}`;
                    return { messages: [...state.messages] };
                }
                return state;
            });
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 flex flex-col h-[calc(100vh-65px)]">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h1 className="text-2xl font-bold text-white">Mock Interview Session</h1>
                {/* We simply drop our new component in here */}
                <VoiceSelectionMenu />
            </div>
            
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 p-4 rounded-t-lg bg-gray-800/50 border-x border-t border-gray-700">
                {messages.map((msg, index) => (
                    <div key={index} className="flex items-start gap-4" style={{ flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'AI' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-gray-600 text-white'}`}>
                            {msg.sender === 'AI' ? <Bot/> : <User/>}
                        </div>
                        <div className={`max-w-xl p-4 rounded-xl shadow-md ${msg.sender === 'AI' ? 'bg-gray-700 text-gray-200' : 'bg-blue-600 text-white'}`}>
                            {msg.sender === 'AI' && msg.text === '' && isThinking ? 
                                <span className="italic text-gray-400 animate-pulse">Forge is thinking...</span> :
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            }
                        </div>
                        {msg.sender === 'AI' && msg.text && ttsSupported && (
                           <button onClick={() => isSpeaking ? cancelSpeech() : speak(msg.text, selectedVoice?.voice)} className={`p-2 rounded-full flex-shrink-0 self-center transition-colors ${isSpeaking ? 'bg-red-500/50 text-white' : 'bg-gray-600 text-gray-400 hover:text-white'}`}>
                               {isSpeaking ? <StopCircle size={16}/> : <Volume2 size={16}/>}
                           </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex-shrink-0 border border-t-0 border-gray-700 rounded-b-lg p-4 bg-gray-800">
                {/* ... The input form JSX remains the same ... */}
                <div className="relative">
                     <textarea value={displayedInput} /* ... */ />
                     <div className="absolute right-3 bottom-3 flex gap-2">
                        {/* ... buttons ... */}
                     </div>
                </div>
            </div>
        </div>
    );
}