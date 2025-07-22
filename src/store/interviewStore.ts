'use client';

import { create } from 'zustand';

export interface Message {
    sender: 'AI' | 'user';
    text: string;
    feedback?: string | null;
}

export interface AppVoice {
    voice: SpeechSynthesisVoice;
    name: string;
    lang: string;
}

export type InterviewStage = 'Behavioral' | 'Technical' | 'Situational';

export interface InterviewState {
    messages: Message[];
    isAwaitingResponse: boolean;
    selectedPersonaId: string | null;
    selectedVoice: AppVoice | null;
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
    setIsAwaitingResponse: (isLoading: any) => set({ isAwaitingResponse: isLoading }),
    addFeedbackToLastMessage: () => {}, // Placeholder if needed, or remove if unused
}));