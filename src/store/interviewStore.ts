// src/store/interviewStore.ts

import { create } from 'zustand';

export interface Message {
    sender: 'AI' | 'user';
    text: string;
    feedback?: string | null; // Optional feedback from AI on user's answer
}

interface InterviewState {
    messages: Message[];
    isAwaitingResponse: boolean; // To show a loading indicator
    addMessage: (message: Message) => void;
    startNewInterview: (initialQuestion: string) => void;
    setIsAwaitingResponse: (isLoading: boolean) => void;
    addFeedbackToLastMessage: (feedback: string) => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
    messages: [],
    isAwaitingResponse: false,
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    startNewInterview: (initialQuestion) => set({
        messages: [{ sender: 'AI', text: initialQuestion }],
        isAwaitingResponse: false,
    }),
    setIsAwaitingResponse: (isLoading) => set({ isAwaitingResponse: isLoading }),
    addFeedbackToLastMessage: (feedback) => set((state) => {
        const lastMessageIndex = state.messages.length - 1;
        if (lastMessageIndex >= 0 && state.messages[lastMessageIndex].sender === 'user') {
            const newMessages = [...state.messages];
            newMessages[lastMessageIndex] = { ...newMessages[lastMessageIndex], feedback };
            return { messages: newMessages };
        }
        return state;
    }),
}));