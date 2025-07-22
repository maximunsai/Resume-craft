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
    const { messages, addMessage, startNewInterview, selectedPersonaId, selectedVoice, stage, setStage, clearInterview } = useInterviewStore();
    const resumeState = useResumeStore();
    const [isThinking, setIsThinking] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [sessionActive, setSessionActive] = useState(false);
    const router = useRouter();
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    // THE LOOPING FIX PART 1: A new state to explicitly trigger speech.
    const [messageToSpeak, setMessageToSpeak] = useState<string | null>(null);

    // --- Voice Hooks ---
    const { text: speechToText, interimText, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();
    const { speak, cancel: cancelSpeech, isLoading: isAudioLoading, isSpeaking } = useSpeechSynthesis();

    // --- Effects ---
    useEffect(() => {
        if (speechToText) setUserInput(prev => (prev ? prev + ' ' : '').trim() + speechToText);
    }, [speechToText]);

    const displayedInput = isListening ? (userInput.endsWith(' ') ? userInput : userInput + ' ') + interimText : userInput;

    // THE LOOPING FIX PART 2: This dedicated effect listens for a message to be ready to speak.
    useEffect(() => {
        if (messageToSpeak) {
            speak(messageToSpeak);
            // After triggering speech, reset the state to prevent re-speaking.
            setMessageToSpeak(null);
        }
    }, [messageToSpeak, speak]);
    
    // This effect handles stage transitions based on AI's text.
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.sender === 'AI' && lastMessage.text) {
            const lowerCaseText = lastMessage.text.toLowerCase();
            if (lowerCaseText.includes("technical round")) setStage('Technical');
            else if (lowerCaseText.includes("hr and situational")) setStage('Situational');
        }
    }, [messages, setStage]);

    // This effect handles auto-scrolling.
    useEffect(() => {
        if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages, isThinking]);

    // --- Handlers ---
    const sendApiRequest = async (conversationHistory: Message[]) => {
        setIsThinking(true);
        const isInitialRequest = conversationHistory.length === 0;

        // Add placeholder for the AI response
        if (!isInitialRequest) {
            addMessage({ sender: 'AI', text: '' });
        }

        try {
            const currentStage = useInterviewStore.getState().stage;
            const response = await fetch('/api/interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeData: resumeState, conversationHistory, stage: currentStage }),
            });
            if (!response.ok || !response.body) throw new Error(`Server error`);
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                accumulatedText += decoder.decode(value, { stream: true });

                const action = isInitialRequest ? startNewInterview : (text: string) => useInterviewStore.setState(state => {
                    const last = state.messages[state.messages.length - 1];
                    if (last?.sender === 'AI') return { messages: [...state.messages.slice(0, -1), { ...last, text }] };
                    return state;
                });
                action(accumulatedText);
            }

            // THE LOOPING FIX PART 3: At the end of the stream, set the message to be spoken.
            const finalMessageText = accumulatedText.trim();
            if (finalMessageText) {
                setMessageToSpeak(finalMessageText);
            }
        } catch (error) {
            console.error("API stream failed:", error);
            useInterviewStore.setState(state => {
                const last = state.messages[state.messages.length - 1];
                if (last?.sender === 'AI') return { messages: [...state.messages.slice(0, -1), { ...last, text: "Sorry, I encountered a connection issue." }] };
                return state;
            });
        } finally {
            setIsThinking(false);
        }
    };
    
    const handleStartSession = () => {
        clearInterview();
        setSessionActive(true);
        sendApiRequest([]); // Fetch the first question from the AI
    };
    
    const handleSubmitAnswer = () => {
        const currentInput = displayedInput.trim();
        if (!currentInput || isThinking) return;

        cancelSpeech();
        if (isListening) stopListening();

        const userMessage: Message = { sender: 'user', text: currentInput };
        addMessage(userMessage);
        setUserInput('');
        
        sendApiRequest([...messages, userMessage]);
    };
    
    const handleFinishInterview = async () => { /* ... Your working function ... */ };
    
    const isVoiceReady = (process.env.NEXT_PUBLIC_PREMIUM_VOICE_ENABLED === 'true' && !!selectedPersonaId) || (!(process.env.NEXT_PUBLIC_PREMIUM_VOICE_ENABLED === 'true') && !!selectedVoice);

    if (!sessionActive) {
        return (
            <div className="max-w-4xl mx-auto p-8 flex flex-col items-center justify-center h-[calc(100vh-65px)] text-center">
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 w-full max-w-lg">
                    <h1 className="text-3xl font-poppins font-bold text-white mb-4">Mock Interview Ready</h1>
                    <p className="text-gray-400 mb-6">Your AI interviewer is ready. Select a voice and click start.</p>
                    <div className="mb-6 flex justify-center"><VoiceSelectionMenu /></div>
                    <button onClick={handleStartSession} disabled={!isVoiceReady} className="w-full flex items-center justify-center gap-3 px-12 py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg text-xl disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-yellow-500 shadow-lg">
                        <PlayCircle /> Start Interview
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto p-4 flex flex-col h-[calc(100vh-65px)]">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <div><h1 className="text-2xl font-bold text-white">Mock Interview Session</h1><p className="text-sm font-semibold text-yellow-400">Stage: {stage}</p></div>
                <div className="flex items-center gap-4"><VoiceSelectionMenu /><button onClick={handleFinishInterview} disabled={isThinking || messages.length < 2} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white ..."> <Flag size={16} /> End & Analyze </button></div>
            </div>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto ...">
                {messages.map((msg, index) => (
                    <div key={index} className="flex items-start ..." style={{ flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                        <div className={`w-10 h-10 ...`}>{msg.sender === 'AI' ? <Bot /> : <User />}</div>
                        <div className={`max-w-xl p-4 ...`}>
                            <div className="flex items-center">
                                <p className="whitespace-pre-wrap flex-1">{msg.sender === 'AI' && msg.text === '' && isThinking ? <span className="italic ...">Forge is thinking...</span> : msg.text}</p>
                                {msg.sender === 'AI' && msg.text && ( <button onClick={() => isSpeaking ? cancelSpeech() : speak(msg.text)} disabled={isAudioLoading} className={`p-2 ml-3 ...`}>{isAudioLoading ? <div className="animate-spin ..."></div> : (isSpeaking ? <StopCircle /> : <Volume2 />)}</button> )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex-shrink-0 border ...">
                <div className="relative">
                    <textarea value={displayedInput} /* ... */ />
                    <div className="absolute right-3 bottom-3 flex gap-2">
                        {hasRecognitionSupport && (<button onClick={isListening ? stopListening : startListening} /*...*/ >{isListening ? <MicOff /> : <Mic />}</button>)}
                        <button onClick={handleSubmitAnswer} /*...*/><Send /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}