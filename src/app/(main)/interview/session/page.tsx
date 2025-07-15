// src/app/(main)/interview/session/page.tsx - USING THE NEW HOOK

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
        text: speechToText, // This is the FINAL transcript after pausing
        interimText,       // This is the LIVE transcript as you speak
        isListening,
        startListening,
        stopListening,
        hasRecognitionSupport,
    } = useSpeechRecognition();

    // This effect appends the FINAL transcript to the input box once listening stops
    useEffect(() => {
        if (speechToText) {
            setUserInput(prev => (prev ? prev + ' ' : '') + speechToText);
        }
    }, [speechToText]);

    // This effect updates the input box with the LIVE transcript while listening
    // We combine the final part of the last transcript with the new interim part
    const displayedInput = isListening ? userInput + interimText : userInput;

    // --- The rest of the logic remains largely the same ---
    useEffect(() => {
      // Initialize interview logic
      if (messages.length === 0) {
        const initialQuestion = `Hello, ${resumeState.personal.name || 'there'}. Thanks for your time today. To start, could you please walk me through your resume?`;
        startNewInterview(initialQuestion);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      // Auto-scroll logic
      if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, [messages, interimText]); // Also scroll on interim text

    const handleSubmitAnswer = async () => { /* ... this function is unchanged ... */ };

    return (
        <div className="max-w-3xl mx-auto p-4 flex flex-col h-[calc(100vh-80px)]">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto ...">
                {/* ... existing message mapping logic ... */}
            </div>
            
            <div className="border border-t-0 border-gray-700 rounded-b-lg p-4 bg-gray-800">
                <div className="relative">
                    <textarea
                        value={displayedInput} // Use our combined display value
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={isListening ? "Listening..." : "Type or speak your answer..."}
                        className="w-full p-4 pr-24 ... "
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
                        ) : <p className="text-xs text-gray-500">Voice not supported</p>}
                        
                        <button
                            onClick={handleSubmitAnswer}
                            disabled={!userInput.trim() || isAwaitingResponse || isListening}
                            className="p-3 bg-yellow-400 text-gray-900 rounded-lg disabled:bg-gray-600 ..."
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