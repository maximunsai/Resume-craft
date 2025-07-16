// src/app/(main)/interview/session/page.tsx - WITH AI VOICE

'use client';

import { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { useInterviewStore, Message } from '@/store/interviewStore';
import { Bot, User, Send, Mic, MicOff, Volume2, StopCircle } from 'lucide-react'; // Import new icons
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis'; // Import our new TTS hook

export default function InterviewSessionPage() {
    const { messages, addMessage, startNewInterview } = useInterviewStore();
    const resumeState = useResumeStore();
    const [userInput, setUserInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    // Speech Recognition Hook (Input)
    const { text: speechToText, interimText, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();
    
    // =================================================================
    // NEW: Speech Synthesis Hook (Output)
    // =================================================================
    const { speak, cancel, isSpeaking, supported: ttsSupported } = useSpeechSynthesis();

    // This effect handles appending transcribed text to the input
    useEffect(() => {
        if (speechToText) setUserInput(prev => (prev ? prev + ' ' : '') + speechToText);
    }, [speechToText]);

    const displayedInput = isListening ? userInput + interimText : userInput;

    // This effect starts the interview and speaks the first question
    useEffect(() => {
        if (messages.length === 0) {
            const initialQuestion = `Hello, ${resumeState.personal.name || 'there'}. Thanks for your time. To start, could you please walk me through your resume?`;
            startNewInterview(initialQuestion);
            // Speak the initial question
            speak(initialQuestion);
        }
    // We disable the exhaustive-deps rule here because we truly only want this to run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // This effect handles auto-scrolling
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    const handleSubmitAnswer = async () => {
        const currentInput = displayedInput.trim();
        if (!currentInput || isThinking) return;

        // Stop any currently playing AI speech before submitting
        cancel(); 
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

            if (!response.body) throw new Error("The response body is empty.");
            if (!response.ok) throw new Error(`Server error: ${response.statusText}`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponseText = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                fullResponseText += chunk; // Accumulate the full text
                
                useInterviewStore.setState(state => {
                    const lastMessage = state.messages[state.messages.length - 1];
                    lastMessage.text = fullResponseText;
                    return { messages: [...state.messages] };
                });
            }
            
            // Once the entire message is received, speak it
            speak(fullResponseText);

        } catch (error) {
            // ... (error handling logic remains the same)
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 flex flex-col h-[calc(100vh-65px)]">
            <h1 className="text-2xl font-bold text-white text-center mb-4">Mock Interview Session</h1>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto ...">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* ... User/Bot avatar logic ... */}
                        <div className={`max-w-lg p-4 rounded-xl shadow-md ${msg.sender === 'AI' ? 'bg-gray-700 text-gray-200' : 'bg-blue-600 text-white'}`}>
                           {/* ... message display logic ... */}
                           {/* NEW: Add a speaker icon to AI messages */}
                           {msg.sender === 'AI' && msg.text && ttsSupported && (
                               <button onClick={() => isSpeaking ? cancel() : speak(msg.text)} className="ml-2 text-gray-400 hover:text-white">
                                   {isSpeaking ? <StopCircle size={16}/> : <Volume2 size={16}/>}
                               </button>
                           )}
                        </div>
                    </div>
                ))}
            </div>
            {/* ... input form logic ... */}
        </div>
    );
}