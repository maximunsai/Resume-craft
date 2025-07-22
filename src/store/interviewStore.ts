'use client';

import { create } from 'zustand';

// EXPORTED: This type is shared with other components.
export interface Message {
    sender: 'AI' | 'user';
    text: string;
    feedback?: string | null;
}

// EXPORTED: This is the critical type that was missing its export.
export interface AppVoice {
    voice: SpeechSynthesisVoice;
    name: string;
    lang: string;
}

export type InterviewStage = 'Behavioral' | 'Technical' | 'Situational';

// The full and correct interface for the store's state.
export interface InterviewState {
    messages: Message[];
    isAwaitingResponse: boolean;
    selectedPersonaId: string | null; // For premium ElevenLabs voice
    selectedVoice: AppVoice | null;   // For native browser fallback voice
    stage: InterviewStage;
    addMessage: (message: Message) => void;
    startNewInterview: (initialQuestion: string) => void;
    setSelectedPersonaId: (id: string | null) => void;
    setSelectedVoice: (voice: AppVoice | null) => void;
    setStage: (stage: InterviewStage) => void;
    clearInterview: () => void;
}

const initialState = {
    messages: [],
    isAwaitingResponse: false,
    selectedPersonaId: null,
    selectedVoice: null,
    stage: 'Behavioral' as InterviewStage,
};

export const useInterviewStore = create<InterviewState>((set) => ({
    ...initialState,
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    startNewInterview: (initialQuestion) => set({ ...initialState, messages: [{ sender: 'AI', text: initialQuestion }] }),
    setSelectedPersonaId: (id) => set({ selectedPersonaId: id }),
    setSelectedVoice: (voice) => set({ selectedVoice: voice }),
    setStage: (stage) => set({ stage }),
    clearInterview: () => set({ messages: [], stage: 'Behavioral' }),
    // Placeholders for any actions needed in the future
    setIsAwaitingResponse: (isLoading: any) => set({ isAwaitingResponse: isLoading }),
    addFeedbackToLastMessage: () => {}, 
}));