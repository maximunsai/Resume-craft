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
    // --- All your state, hooks, and effects are preserved exactly as you provided them ---
    const { messages, addMessage, startNewInterview, selectedVoice, stage, setStage, selectedPersonaId, clearInterview } = useInterviewStore();
    const resumeState = useResumeStore();
    const [isThinking, setIsThinking] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [sessionActive, setSessionActive] = useState(false);
    const [lastSpokenMessageId, setLastSpokenMessageId] = useState<string>('');
    const router = useRouter();
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    const { text: speechToText, interimText, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();
    const { speak, cancel: cancelSpeech, isLoading: isAudioLoading, isSpeaking } = useSpeechSynthesis();
    
    useEffect(() => {
        if (speechToText) setUserInput(prev => (prev ? prev + ' ' : '').trim() + speechToText);
    }, [speechToText]);
    
    const displayedInput = isListening ? (userInput.endsWith(' ') ? userInput : userInput + ' ') + interimText : userInput;
    
    useEffect(() => {
        if (sessionActive && messages.length === 0) {
            sendApiRequest([]);
        }
    }, [sessionActive]);

    // FIXED: This effect now prevents voice looping by tracking message completion
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && 
            lastMessage.sender === 'AI' && 
            lastMessage.text && 
            !isThinking && // Only speak when AI is done thinking (streaming complete)
            lastSpokenMessageId !== `${messages.length - 1}-${lastMessage.text.length}`) { // Prevent re-speaking same complete message
            
            speak(lastMessage.text);
            setLastSpokenMessageId(`${messages.length - 1}-${lastMessage.text.length}`);
        }
    }, [messages, isThinking, speak, lastSpokenMessageId]);
    
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
    
    useEffect(() => {
        return () => {
            cancelSpeech();
        };
    }, [cancelSpeech]);

    // --- Handlers ---
    
    const sendApiRequest = async (conversationHistory: Message[]) => {
        setIsThinking(true);
        const isInitialRequest = conversationHistory.length === 0;

        if (isInitialRequest) {
            startNewInterview('');
        } else {
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
    };

    const handleSubmitAnswer = async () => {
        const currentInput = displayedInput.trim();
        if (!currentInput || isThinking) return;
        cancelSpeech();
        if (isListening) stopListening();
        const userMessage: Message = { sender: 'user', text: currentInput };
        addMessage(userMessage);
        setUserInput('');
        // Reset the spoken message tracker when user sends a new message
        setLastSpokenMessageId('');
        sendApiRequest([...messages, userMessage]);
    };

    // =================================================================
    // THIS IS THE DEFINITIVE, FINAL, AND CORRECT FUNCTION
    // =================================================================
    const handleFinishInterview = async () => {
        if (isThinking) return;
        cancelSpeech();
        setIsThinking(true);
        
        try {
            alert("Analyzing your performance... this may take a moment.");
            
            const analysisResponse = await fetch('/api/analyze-interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript: messages })
            });
            const analysisData = await analysisResponse.json();
            if (!analysisResponse.ok) {
                throw new Error(analysisData.error || "Failed to generate the final analysis from the AI.");
            }

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
            
            console.log(`Redirecting to analytics page for interview ID: ${saveData.interview_id}`);
            router.push(`/interview/analytics/${saveData.interview_id}`);

        } catch (error) {
            console.error("Failed to finish interview:", error);
            alert(`An error occurred while finishing the interview: ${(error as Error).message}`);
            setIsThinking(false);
        }
    };
    
    // --- UI (Preserved from your working version) ---
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
                <div>
                    <h1 className="text-2xl font-bold text-white">Mock Interview Session</h1>
                    <p className="text-sm font-semibold text-yellow-400">Stage: {stage}</p>
                </div>
                <div className="flex items-center gap-4">
                    <VoiceSelectionMenu />
                    <button onClick={handleFinishInterview} disabled={isThinking || messages.length < 2} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed">
                        <Flag size={16} />
                        End & Analyze
                    </button>
                </div>
            </div>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 p-4 rounded-t-lg bg-gray-800/50 border-x border-t border-gray-700">
                {messages.map((msg, index) => (
                    <div key={index} className="flex items-start gap-4" style={{ flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'AI' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-gray-600 text-white'}`}>{msg.sender === 'AI' ? <Bot /> : <User />}</div>
                        <div className={`max-w-xl p-4 rounded-xl shadow-md ${msg.sender === 'AI' ? 'bg-gray-700 text-gray-200' : 'bg-blue-600 text-white'}`}>
                            <div className="flex items-center">
                                <p className="whitespace-pre-wrap flex-1">{msg.sender === 'AI' && msg.text === '' && isThinking ? <span className="italic text-gray-400 animate-pulse">Forge is thinking...</span> : msg.text}</p>
                                {msg.sender === 'AI' && msg.text && (
                                    <button onClick={() => isSpeaking ? cancelSpeech() : speak(msg.text)} disabled={isAudioLoading} className={`p-2 ml-3 rounded-full flex-shrink-0 self-center transition-colors ${isSpeaking ? 'bg-red-500/50 text-white' : 'bg-gray-600 text-gray-400 hover:text-white'}`}>
                                        {isAudioLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : (isSpeaking ? <StopCircle size={16} /> : <Volume2 size={16} />)}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex-shrink-0 border border-t-0 border-gray-700 rounded-b-lg p-4 bg-gray-800">
                <div className="relative">
                    <textarea value={displayedInput} onChange={(e) => setUserInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitAnswer(); } }} placeholder={isListening ? "Listening..." : (isThinking ? "Waiting for AI's response..." : "Type or speak your answer...")} className="w-full p-4 pr-28 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none transition-colors" rows={3} disabled={isThinking} />
                    <div className="absolute right-3 bottom-3 flex gap-2">
                        {hasRecognitionSupport && (<button onClick={isListening ? stopListening : startListening} disabled={isThinking} className={`p-3 rounded-lg transition-colors ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`} aria-label={isListening ? 'Stop recording' : 'Start recording'}>{isListening ? <MicOff size={20} /> : <Mic size={20} />}</button>)}
                        <button onClick={handleSubmitAnswer} disabled={!userInput.trim() || isThinking || isListening} className="p-3 bg-yellow-400 text-gray-900 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-500" aria-label="Send message"><Send size={20} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}