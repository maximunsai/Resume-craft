// src/app/(main)/interview/session/page.tsx - THE STREAMING VERSION

'use client';

import { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { useInterviewStore, Message } from '@/store/interviewStore';
import { Bot, User, Send, Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

export default function InterviewSessionPage() {
    const { messages, addMessage, startNewInterview, setIsAwaitingResponse } = useInterviewStore();
    const resumeState = useResumeStore();
    const [userInput, setUserInput] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const { text: speechToText, interimText, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();
    
    // Using a local state for awaiting response to avoid store complexity
    const [isThinking, setIsThinking] = useState(false);

    useEffect(() => {
        if (speechToText) setUserInput(prev => (prev ? prev + ' ' : '') + speechToText);
    }, [speechToText]);

    const displayedInput = isListening ? userInput + interimText : userInput;

    useEffect(() => {
      if (messages.length === 0) {
        startNewInterview(`Hello, ${resumeState.personal.name || 'there'}. Thanks for your time. To start, can you walk me through your resume?`);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, [messages, isThinking]);

    const handleSubmitAnswer = async () => {
        const currentInput = displayedInput.trim();
        if (!currentInput || isThinking) return;

        if (isListening) stopListening();

        const userMessage: Message = { sender: 'user', text: currentInput };
        addMessage(userMessage);
        setUserInput('');
        setIsThinking(true);
        
        // Add a placeholder message for the AI's response that will be filled in
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

            // Read the stream from the response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                
                // Update the last AI message in the store with the new chunk of text
                useInterviewStore.setState(state => {
                    const lastMessage = state.messages[state.messages.length - 1];
                    lastMessage.text += chunk;
                    return { messages: [...state.messages] };
                });
            }

        } catch (error) {
            console.error("Failed to stream response from interview API:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown connection error occurred.";
            useInterviewStore.setState(state => {
                const lastMessage = state.messages[state.messages.length - 1];
                lastMessage.text = `Sorry, a connection error occurred: ${errorMessage}`;
                return { messages: [...state.messages] };
            });
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 flex flex-col h-[calc(100vh-65px)]">
            <h1 className="text-2xl font-bold text-white text-center mb-4">Mock Interview Session</h1>
            
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 p-4 rounded-t-lg bg-gray-800/50 border-x border-t border-gray-700">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'AI' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-gray-600 text-white'}`}>
                            {msg.sender === 'AI' ? <Bot/> : <User/>}
                        </div>
                        <div className={`max-w-lg p-4 rounded-xl shadow-md ${msg.sender === 'AI' ? 'bg-gray-700 text-gray-200' : 'bg-blue-600 text-white'}`}>
                            {/* Render an indicator if the AI is typing its first word */}
                            {msg.sender === 'AI' && msg.text === '' && isThinking 
                                ? <span className="italic text-gray-400 animate-pulse">Forge is thinking...</span>
                                : <p className="whitespace-pre-wrap">{msg.text}</p>
                            }
                        </div>
                    </div>
                ))}
            </div>

            <div className="border border-t-0 border-gray-700 rounded-b-lg p-4 bg-gray-800">
                <div className="relative">
                    <textarea value={displayedInput} onChange={(e) => setUserInput(e.target.value)} disabled={isThinking}
                     onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitAnswer(); } }}
                     placeholder={isListening ? "Listening..." : "Type or speak your answer..."}
                     className="w-full p-4 pr-24 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none transition-colors"
                     rows={3} />
                    <div className="absolute right-3 bottom-3 flex gap-2">
                         {hasRecognitionSupport && <button onClick={isListening ? stopListening : startListening} disabled={isThinking} className={`p-3 rounded-lg transition-colors ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}><MicOff/></button>}
                         <button onClick={handleSubmitAnswer} disabled={!userInput.trim() || isThinking} className="p-3 bg-yellow-400 text-gray-900 rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-500"><Send size={20}/></button>
                    </div>
                </div>
            </div>
        </div>
    );
}