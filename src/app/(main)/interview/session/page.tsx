// src/app/(main)/interview/session/page.tsx - CORRECTED

'use client';

import { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { useInterviewStore, Message } from '@/store/interviewStore';
import { Bot, User, CornerDownLeft, Send } from 'lucide-react'; // Added Send icon

export default function InterviewSessionPage() {
    // --- The interview store logic is correct and remains the same ---
    const { messages, isAwaitingResponse, addMessage, startNewInterview, setIsAwaitingResponse, addFeedbackToLastMessage } = useInterviewStore();
    
    // =================================================================
    // THE FIX IS HERE: We get the full state object first, then select the data we need.
    // =================================================================
    const resumeState = useResumeStore();
    const resumeDataForApi = {
        name: resumeState.personal.name,
        experience: resumeState.experience,
        skills: resumeState.skills,
    };
    
    const [userInput, setUserInput] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Start the interview on first load
    useEffect(() => {
        if (messages.length === 0) {
            // Use the correctly accessed name for the initial question
            const initialQuestion = `Hello, ${resumeState.personal.name || 'there'}. Thanks for coming in today. To start, can you walk me through your resume?`;
            startNewInterview(initialQuestion);
        }
        // We only want this to run once on mount, so the dependency array is empty.
    }, []);

    // Auto-scroll to the bottom of the chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmitAnswer = async () => {
        if (!userInput.trim() || isAwaitingResponse) return;

        const userMessage: Message = { sender: 'user', text: userInput };
        addMessage(userMessage);
        setUserInput('');
        setIsAwaitingResponse(true);

        try {
            const response = await fetch('/api/interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Pass the correctly structured resume data to the API
                    resumeData: resumeDataForApi,
                    conversationHistory: [...messages, userMessage]
                }),
            });
            const data = await response.json();

            if (response.ok) {
                // Add feedback before the next question for better UX
                if (data.feedback) {
                    addFeedbackToLastMessage(data.feedback);
                }
                if (data.next_question) {
                    addMessage({ sender: 'AI', text: data.next_question });
                }
            } else {
                throw new Error(data.error || 'An unknown error occurred');
            }
        } catch (error) {
            addMessage({ sender: 'AI', text: "I seem to be having some trouble connecting. Let's try that again." });
            console.error(error);
        } finally {
            setIsAwaitingResponse(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 flex flex-col h-[calc(100vh-80px)]">
            {/* The chat container */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 p-4 rounded-t-lg bg-gray-800/50 border-x border-t border-gray-700">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'AI' && <div className="w-10 h-10 bg-yellow-400/20 text-yellow-400 rounded-full flex items-center justify-center flex-shrink-0"><Bot/></div>}
                        <div className={`max-w-lg p-4 rounded-xl ${msg.sender === 'AI' ? 'bg-gray-700 text-gray-200' : 'bg-blue-600 text-white'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            {msg.feedback && (
                                <div className="mt-3 pt-3 border-t border-blue-500/50 text-xs italic opacity-90">
                                    <strong>Feedback:</strong> {msg.feedback}
                                </div>
                            )}
                        </div>
                        {msg.sender === 'user' && <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0"><User/></div>}
                    </div>
                ))}
                {isAwaitingResponse && (
                     <div className="flex items-start gap-4">
                         <div className="w-10 h-10 bg-yellow-400/20 text-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse"><Bot/></div>
                         <div className="max-w-lg p-4 rounded-xl bg-gray-700 text-gray-400 italic">
                             Analyzing...
                         </div>
                     </div>
                )}
            </div>
            {/* The input form */}
            <div className="border border-gray-700 rounded-b-lg p-4 bg-gray-800">
                <div className="relative">
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmitAnswer();
                            }
                        }}
                        placeholder={isAwaitingResponse ? "Waiting for AI..." : "Type your answer here..."}
                        className="w-full p-4 pr-20 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none transition-colors"
                        rows={3}
                        disabled={isAwaitingResponse}
                    />
                    <button
                        onClick={handleSubmitAnswer}
                        disabled={!userInput.trim() || isAwaitingResponse}
                        className="absolute right-3 bottom-3 p-3 bg-yellow-400 text-gray-900 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-500 transition-colors"
                        aria-label="Send message"
                    >
                        <Send size={20}/>
                    </button>
                </div>
            </div>
        </div>
    );
}