'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/store/resumeStore';
import { useInterviewStore, Message } from '@/store/interviewStore';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'; // Our new unified hook
import { VoiceSelectionMenu } from '@/components/VoiceSelectionMenu';
import { Bot, User, Send, Mic, MicOff, Volume2, StopCircle, Flag } from 'lucide-react';

export default function InterviewSessionPage() {
    // Store hooks
    const { messages, addMessage, startNewInterview } = useInterviewStore();
    const resumeState = useResumeStore();
    
    // Local state
    const [isThinking, setIsThinking] = useState(false);
    const [userInput, setUserInput] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Voice Hooks - The component's interaction is now much simpler
    const { text: speechToText, interimText, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();
    const { speak, cancel: cancelSpeech, isLoading: isAudioLoading, isSpeaking } = useSpeechSynthesis();

    // Effects
    useEffect(() => {
        if (speechToText) setUserInput(prev => (prev ? prev + ' ' : '').trim() + speechToText);
    }, [speechToText]);

    const displayedInput = isListening ? (userInput.endsWith(' ') ? userInput : userInput + ' ') + interimText : userInput;

    useEffect(() => {
        // Start interview only after the first message is added
        if (messages.length === 1) {
            speak(messages[0].text);
        }
    }, [messages, speak]);
    
    useEffect(() => {
        if (messages.length === 0) {
            const initialQuestion = `Hello, ${resumeState.personal.name || 'there'}. Welcome to the forge. To start, could you please walk me through your resume?`;
            startNewInterview(initialQuestion);
        }
    }, [messages.length, resumeState.personal.name, startNewInterview]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

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
            let fullResponseText = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                fullResponseText += chunk;
                
                useInterviewStore.setState(state => {
                    const lastMessage = state.messages[state.messages.length - 1];
                    if (lastMessage?.sender === 'AI') {
                        lastMessage.text = fullResponseText;
                        return { messages: [...state.messages] };
                    }
                    return state;
                });
            }

            // The component just calls 'speak'. The hook handles the rest.
            speak(fullResponseText);

        } catch (error) {
            // ... (error handling)
        } finally {
            setIsThinking(false);
        }
    };
    
    const handleFinishInterview = async () => { /* ... */ };

    return (
        <div className="max-w-4xl mx-auto p-4 flex flex-col h-[calc(100vh-65px)]">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h1 className="text-2xl font-bold text-white">Mock Interview Session</h1>
                <VoiceSelectionMenu />
            </div>
            
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 p-4 rounded-t-lg bg-gray-800/50 border-x border-t border-gray-700">
                {messages.map((msg, index) => (
                    <div key={index} className="flex items-start gap-4" style={{ flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                        <div className={`w-10 h-10 rounded-full ...`}>
                            {msg.sender === 'AI' ? <Bot/> : <User/>}
                        </div>
                        <div className={`max-w-xl p-4 ...`}>
                            <div className="flex items-center">
                                <p className="whitespace-pre-wrap flex-1">
                                    {/* ... thinking indicator ... */}
                                    {msg.text}
                                </p>
                                {msg.sender === 'AI' && msg.text && (
                                   <button 
                                     onClick={() => isSpeaking ? cancelSpeech() : speak(msg.text)} 
                                     disabled={isAudioLoading}
                                     className={`...`}>
                                       {isAudioLoading ? <div className="animate-spin ..."></div> : (isSpeaking ? <StopCircle size={16}/> : <Volume2 size={16}/>)}
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