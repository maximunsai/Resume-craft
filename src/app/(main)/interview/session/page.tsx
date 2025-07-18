'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/store/resumeStore';
import { useInterviewStore, Message } from '@/store/interviewStore';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
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

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                useInterviewStore.setState(state => {
                    const lastMessage = state.messages[state.messages.length - 1];
                    if (lastMessage?.sender === 'AI') {
                        lastMessage.text += chunk;
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

    const handleFinishInterview = async () => { /* ... Your working function ... */ };

    // =================================================================
    // THE DEFINITIVE UI FIX IS HERE
    // =================================================================
    return (
        <div className="max-w-4xl mx-auto p-4 flex flex-col h-[calc(100vh-65px)]">
            {/* Header section with Title and Buttons */}
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h1 className="text-2xl font-bold text-white">Mock Interview Session</h1>
                <div className="flex items-center gap-4">
                    <VoiceSelectionMenu />
                    <button
                        onClick={handleFinishInterview}
                        disabled={isThinking || messages.length < 2}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        <Flag size={16} />
                        End & Analyze
                    </button>
                </div>
            </div>

            {/* Main Chat History Area */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 p-4 rounded-t-lg bg-gray-800/50 border-x border-t border-gray-700">
                {messages.map((msg, index) => (
                    <div key={index} className="flex items-start gap-4" style={{ flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'AI' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-gray-600 text-white'}`}>
                            {msg.sender === 'AI' ? <Bot /> : <User />}
                        </div>
                        <div className={`max-w-xl p-4 rounded-xl shadow-md ${msg.sender === 'AI' ? 'bg-gray-700 text-gray-200' : 'bg-blue-600 text-white'}`}>
                            <div className="flex items-center">
                                <p className="whitespace-pre-wrap flex-1">
                                    {msg.sender === 'AI' && msg.text === '' && isThinking
                                        ? <span className="italic text-gray-400 animate-pulse">Forge is thinking...</span>
                                        : msg.text}
                                </p>
                                {msg.sender === 'AI' && msg.text && (
                                    <button
                                        onClick={() => isSpeaking ? cancelSpeech() : speak(msg.text)}
                                        disabled={isAudioLoading}
                                        className={`p-2 ml-3 rounded-full flex-shrink-0 self-center transition-colors ${isSpeaking ? 'bg-red-500/50 text-white' : 'bg-gray-600 text-gray-400 hover:text-white'}`}
                                    >
                                        {isAudioLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : (isSpeaking ? <StopCircle size={16} /> : <Volume2 size={16} />)}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Form Area */}
            <div className="flex-shrink-0 border border-t-0 border-gray-700 rounded-b-lg p-4 bg-gray-800">
                <div className="relative">
                    <textarea
                        value={displayedInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitAnswer(); } }}
                        placeholder={isListening ? "Listening..." : (isThinking ? "Waiting for AI's response..." : "Type or speak your answer...")}
                        className="w-full p-4 pr-28 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none transition-colors"
                        rows={3}
                        disabled={isThinking}
                    />
                    <div className="absolute right-3 bottom-3 flex gap-2">
                        {hasRecognitionSupport && (
                            <button
                                onClick={isListening ? stopListening : startListening}
                                disabled={isThinking}
                                className={`p-3 rounded-lg transition-colors ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
                                aria-label={isListening ? 'Stop recording' : 'Start recording'}
                            >
                                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>
                        )}
                        <button
                            onClick={handleSubmitAnswer}
                            disabled={!userInput.trim() || isThinking || isListening}
                            className="p-3 bg-yellow-400 text-gray-900 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-500"
                            aria-label="Send message"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}