// src/store/resumeStore.ts - FULL REPLACEMENT (FIXED)
import { create } from 'zustand';

// --- DEFINE TYPES ---
type PersonalDetails = {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
};

type Experience = {
    id: number;
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    description: string;
};

// Define a specific type for the AI-generated content
type AiGeneratedContent = {
    professionalSummary: string;
    technicalSkills: string[];
    detailedExperience: { 
        id: number; 
        points: string[];
        // Also add company/title from the original experience for context
        company: string;
        title: string;
    }[];
};

type ResumeState = {
    personal: PersonalDetails;
    experience: Experience[];
    skills: string;
    finalThoughts: string;
    aiGenerated: AiGeneratedContent | null;
    setPersonal: (details: Partial<PersonalDetails>) => void;
    addExperience: () => void;
    updateExperience: (id: number, field: keyof Experience, value: string) => void;
    removeExperience: (id: number) => void;
    setSkills: (skills: string) => void;
    setFinalThoughts: (thoughts: string) => void;
    setAiGenerated: (data: AiGeneratedContent) => void; // Use the specific type here
    resetStore: () => void;
};

const initialState = {
    personal: { name: '', email: '', phone: '', linkedin: '', github: '' },
    experience: [{ id: 1, company: '', title: '', startDate: '', endDate: '', description: '' }],
    skills: '',
    finalThoughts: '',
    aiGenerated: null,
};

export const useResumeStore = create<ResumeState>((set) => ({
    ...initialState,
    setPersonal: (details) => set((state) => ({ personal: { ...state.personal, ...details } })),
    addExperience: () => set((state) => ({
        experience: [...state.experience, { id: Date.now(), company: '', title: '', startDate: '', endDate: '', description: '' }]
    })),
    updateExperience: (id, field, value) => set((state) => ({
        experience: state.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    })),
    removeExperience: (id) => set((state) => ({
        experience: state.experience.filter(exp => exp.id !== id)
    })),
    setSkills: (skills) => set({ skills }),
    setFinalThoughts: (thoughts) => set({ finalThoughts: thoughts }),
    setAiGenerated: (data) => set({ aiGenerated: data }), // This now expects the correct type
    resetStore: () => set(initialState)
}));