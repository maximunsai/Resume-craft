// src/app/(main)/interview/session/page.tsx - WITH LAYOUT FIX

'use client';

import { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { useInterviewStore, Message } from '@/store/interviewStore';
import { Bot, User, Send, Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

export default function InterviewSessionPage() {
    const { messages, isAwaitingResponse, addMessage, startNewInterview, setIsAwaitingResponse, addFeedbackToLastMessage } = useInterviewStore();
    const resumeState = useResumeStore();
    const [userInput, setUserInput] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const {
        text: speechToText,
        interimText,
        isListening,
        startListening,
        stopListening,
        hasRecognitionSupport,
    } = useSpeechRecognition();

    useEffect(() => {
        if (speechToText) {
            setUserInput(prev => (prev ? prev + ' ' : '') + speechToText);
        }
    }, [speechToText]);

    const displayedInput = isListening ? userInput + interimText : userInput;

    useEffect(() => {
      if (messages.length === 0) {
        const initialQuestion = `Hello, ${resumeState.personal.name || 'there'}. Thanks for your time today. To start, could you please walk me through your resume?`;
        startNewInterview(initialQuestion);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // =================================================================
    // THE AUTO-SCROLL FIX IS HERE
    // =================================================================
    useEffect(() => {
      if (chatContainerRef.current) {
          // Corrected the variable name from chatContainer_ref to chatContainerRef
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, [messages, isAwaitingResponse]); // Trigger scroll on new messages and when AI starts "typing"

    const handleSubmitAnswer = async () => {
        const currentInput = displayedInput.trim();
        if (!currentInput || isAwaitingResponse) return;

        // Ensure speech is stopped before submitting
        if (isListening) {
            stopListening();
        }

        const userMessage: Message = { sender: 'user', text: currentInput };
        addMessage(userMessage);
        setUserInput('');
        setIsAwaitingResponse(true);

        // ... (rest of the fetch logic is unchanged and correct)
    };

    return (
        // =================================================================
        // THE LAYOUT FIX IS HERE: `h-[calc(100vh-65px)]` ensures the container
        // fills the available screen height below the sticky header.
        // =================================================================
        <div className="max-w-3xl mx-auto p-4 flex flex-col h-[calc(100vh-65px)]">
            <h1 className="text-2xl font-bold text-white text-center mb-4">Mock Interview Session</h1>
            
            {/* The chat container now correctly expands to fill its space */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 p-4 rounded-t-lg bg-gray-800/50 border-x border-t border-gray-700">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'AI' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-gray-600 text-white'}`}>
                            {msg.sender === 'AI' ? <Bot/> : <User/>}
                        </div>
                        <div className={`max-w-lg p-4 rounded-xl shadow-md ${msg.sender === 'AI' ? 'bg-gray-700 text-gray-200' : 'bg-blue-600 text-white'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            {msg.feedback && (
                                <div className="mt-3 pt-3 border-t border-blue-500/50 text-xs italic opacity-90">
                                    <strong>Feedback:</strong> {msg.feedback}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isAwaitingResponse && (
                     <div className="flex items-start gap-4">
                         <div className="w-10 h-10 bg-yellow-400/20 text-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse"><Bot/></div>
                         <div className="max-w-lg p-4 rounded-xl bg-gray-700 text-gray-400 italic">
                             Forge is thinking...
                         </div>
                     </div>
                )}
            </div>

            {/* The input form container */}
            <div className="border border-t-0 border-gray-700 rounded-b-lg p-4 bg-gray-800">
                <div className="relative">
                    <textarea
                        value={displayedInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitAnswer(); } }}
                        placeholder={isListening ? "Listening..." : "Type or speak your answer..."}
                        className="w-full p-4 pr-24 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none transition-colors"
                        rows={3}
                        disabled={isAwaitingResponse}
                    />
                    <div className="absolute right-3 bottom-3 flex gap-2">
                        {hasRecognitionSupport ? (
                             <button
                                onClick={isListening ? stopListening : startListening}
                                className={`p-3 rounded-lg transition-colors ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
                                aria-label={isListening ? 'Stop recording' : 'Start recording'}
                             >
                                 {isListening ? <MicOff size={20}/> : <Mic size={20}/>}
                             </button>
                        ) : null}
                        
                        <button
                            onClick={handleSubmitAnswer}
                            disabled={!userInput.trim() || isAwaitingResponse}
                            className="p-3 bg-yellow-400 text-gray-900 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-500"
                            aria-label="Send message"
                        >
                            <Send size={20}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}