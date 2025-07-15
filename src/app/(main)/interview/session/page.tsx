'use client';

import { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { useInterviewStore, Message } from '@/store/interviewStore';
import { Bot, User, Send } from 'lucide-react';

export default function InterviewSessionPage() {
    const { messages, isAwaitingResponse, addMessage, startNewInterview, setIsAwaitingResponse, addFeedbackToLastMessage } = useInterviewStore();
    
    // Correctly get the resume data from the store
    const resumeState = useResumeStore();
    const resumeDataForApi = {
        name: resumeState.personal.name,
        experience: resumeState.experience,
        skills: resumeState.skills,
    };
    
    const [userInput, setUserInput] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Start the interview on the first load
    useEffect(() => {
        // This check prevents restarting the interview if the user navigates away and comes back
        if (messages.length === 0) {
            const initialQuestion = `Hello, ${resumeState.personal.name || 'there'}. Thanks for your time today. To start, could you please walk me through your resume?`;
            startNewInterview(initialQuestion);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array ensures this runs only once on mount

    // Auto-scroll to the bottom of the chat on new messages
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // =================================================================
    // THE IMPROVED FUNCTION TO HANDLE SUBMITTING AN ANSWER
    // =================================================================
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
                    resumeData: resumeDataForApi,
                    conversationHistory: [...messages, userMessage]
                }),
            });
            
            const data = await response.json();

            if (!response.ok) {
                // This handles errors returned from our API route (e.g., if the AI response was bad)
                throw new Error(data.error || 'The server returned an error.');
            }

            if (data.feedback) {
                addFeedbackToLastMessage(data.feedback);
            }

            if (data.next_question) {
                addMessage({ sender: 'AI', text: data.next_question });
            } else {
                // If the AI decides the interview is over and provides no next question
                addMessage({ sender: 'AI', text: "That was my final question. Thank you for your time. This was a great session!" });
            }

        } catch (error) {
            // This catches network failures or issues with the fetch call itself
            console.error("Failed to get response from interview API:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown connection error occurred.";
            // Provide a more specific error message to the user in the chat
            addMessage({ sender: 'AI', text: `Sorry, I've encountered a technical issue: ${errorMessage} Please try rephrasing or try again shortly.` });
        } finally {
            setIsAwaitingResponse(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 flex flex-col h-[calc(100vh-80px)]">
            {/* The chat container */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 p-4 rounded-t-lg bg-gray-800/50 border-x border-t border-gray-700">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'AI' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-gray-600 text-white'}`}>
                            {msg.sender === 'AI' ? <Bot/> : <User/>}
                        </div>
                        <div className={`max-w-lg p-4 rounded-xl ${msg.sender === 'AI' ? 'bg-gray-700 text-gray-200' : 'bg-blue-600 text-white'}`}>
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
                             Analyzing...
                         </div>
                     </div>
                )}
            </div>
            {/* The input form */}
            <div className="border border-t-0 border-gray-700 rounded-b-lg p-4 bg-gray-800">
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
                        placeholder={isAwaitingResponse ? "Waiting for AI's response..." : "Type your answer here..."}
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