'use client';

import { create } from 'zustand';

// EXPORTED: This type is shared with other components.
export interface Message {
    sender: 'AI' | 'user';
    text: string;
    feedback?: string | null;
}

// EXPORTED: This type is shared with the VoiceSelectionMenu.
export interface AppVoice {
    voice: SpeechSynthesisVoice;
    name: string;
    lang: string;
}

// This interface defines the "shape" of our store: its data and its functions.
interface InterviewState {
    messages: Message[];
    isAwaitingResponse: boolean;
    selectedPersonaId: string | null; // Stores the ID of the premium voice
    selectedVoice: AppVoice | null; // Stores the native browser voice object for fallback

    // Actions (functions to modify the state)
    addMessage: (message: Message) => void;
    startNewInterview: (initialQuestion: string) => void;
    setIsAwaitingResponse: (isLoading: boolean) => void;
    addFeedbackToLastMessage: (feedback: string) => void;
    setSelectedPersonaId: (id: string | null) => void;
    setSelectedVoice: (voice: AppVoice | null) => void;
    clearInterview: () => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
    // --- Initial State ---
    messages: [],
    isAwaitingResponse: false,
    selectedPersonaId: null,
    selectedVoice: null,

    // --- Actions Implementation ---
    addMessage: (message) => 
        set((state) => ({ messages: [...state.messages, message] })),

    startNewInterview: (initialQuestion) => 
        set({
            messages: [{ sender: 'AI', text: initialQuestion }],
            isAwaitingResponse: false,
        }),

    setIsAwaitingResponse: (isLoading) => 
        set({ isAwaitingResponse: isLoading }),

    addFeedbackToLastMessage: (feedback) => 
        set((state) => {
            const lastMessageIndex = state.messages.length - 1;
            // Only add feedback to the most recent user message
            if (lastMessageIndex >= 0 && state.messages[lastMessageIndex].sender === 'user') {
                const newMessages = [...state.messages];
                newMessages[lastMessageIndex] = { ...newMessages[lastMessageIndex], feedback };
                return { messages: newMessages };
            }
            return state; // Return state unmodified if no user message is last
        }),
    
    setSelectedPersonaId: (id) => 
        set({ selectedPersonaId: id }),
    
    setSelectedVoice: (voice) => 
        set({ selectedVoice: voice }),
        
    clearInterview: () =>
        set({ messages: [] }),
}));