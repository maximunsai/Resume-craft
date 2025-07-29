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

// The "shape" of our store's data
interface InterviewStateData {
    messages: Message[];
    isAwaitingResponse: boolean;
    selectedPersonaId: string | null; // For premium voices
    selectedVoice: AppVoice | null;   // For native fallback voices
    stage: InterviewStage;
}

// The "shape" of our store's functions (actions)
interface InterviewStateActions {
    addMessage: (message: Message) => void;
    startNewInterview: (initialQuestion: string) => void;
    setIsAwaitingResponse: (isLoading: boolean) => void;
    addFeedbackToLastMessage: (feedback: string) => void;
    setSelectedPersonaId: (id: string | null) => void;
    setSelectedVoice: (voice: AppVoice | null) => void;
    setStage: (stage: InterviewStage) => void;
    clearInterview: () => void;
}

export type InterviewStage = 'Behavioral' | 'Technical' | 'Situational';

// The final, complete state combines data and actions
export type InterviewState = InterviewStateData & InterviewStateActions;

// --- Initial State Definition ---
const initialState: InterviewStateData = {
    messages: [],
    isAwaitingResponse: false,
    selectedPersonaId: null,
    selectedVoice: null,
    stage: 'Behavioral',
};

export const useInterviewStore = create<InterviewState>((set) => ({
    ...initialState,

    // --- Actions Implementation ---
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    startNewInterview: (initialQuestion) => set({
        messages: [{ sender: 'AI', text: initialQuestion }],
        isAwaitingResponse: false,
        stage: 'Behavioral',
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
    setSelectedPersonaId: (id) => set({ selectedPersonaId: id }),
    setSelectedVoice: (voice) => set({ selectedVoice: voice }),
    setStage: (stage) => set({ stage }),
    clearInterview: () => set({ messages: [], stage: 'Behavioral'}),
}));