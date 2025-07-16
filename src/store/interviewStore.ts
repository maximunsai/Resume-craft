// src/store/interviewStore.ts

import { create } from 'zustand';

export interface Message {
    sender: 'AI' | 'user';
    text: string;
    feedback?: string | null;
}

// We need to export this type to use it in our new component
export interface AppVoice {
    voice: SpeechSynthesisVoice;
    name: string;
    lang: string;
}

interface InterviewState {
    messages: Message[];
    isAwaitingResponse: boolean;
    selectedVoice: AppVoice | null; // <-- NEW: To store the selected voice object
    addMessage: (message: Message) => void;
    startNewInterview: (initialQuestion: string) => void;
    setIsAwaitingResponse: (isLoading: boolean) => void;
    addFeedbackToLastMessage: (feedback: string) => void;
    setSelectedVoice: (voice: AppVoice | null) => void; // <-- NEW: Setter function
}

export const useInterviewStore = create<InterviewState>((set) => ({
    messages: [],
    isAwaitingResponse: false,
    selectedVoice: null, // <-- NEW: Initialize as null
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    startNewInterview: (initialQuestion) => set({
        messages: [{ sender: 'AI', text: initialQuestion }],
        isAwaitingResponse: false,
    }),
    setIsAwaitingResponse: (isLoading) => set({ isAwaitingResponse: isLoading }),
    addFeedbackToLastMessage: (feedback) => {
        // ... (this function is unchanged)
    },
    setSelectedVoice: (voice) => set({ selectedVoice: voice }), // <-- NEW: Implementation
}));