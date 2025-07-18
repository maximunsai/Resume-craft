'use client';

import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

// =======================================================
// TYPE DEFINITIONS (Clean and Exported for Reuse)
// =======================================================

export interface PersonalDetails {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
}

export interface Experience {
    id: number;
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface AiGeneratedContent {
    professionalSummary: string;
    technicalSkills: string[];
    detailedExperience: { 
        id: number; 
        points: string[];
        company: string;
        title: string;
    }[];
}

export interface ResumeState {
    personal: PersonalDetails;
    experience: Experience[];
    skills: string;
    finalThoughts: string;
    aiGenerated: AiGeneratedContent | null;
    templateId: string;
    isInitialized: boolean;
    isSaving: boolean;

    initialize: () => Promise<void>;
    setPersonal: (details: Partial<PersonalDetails>) => void;
    addExperience: () => void;
    updateExperience: (id: number, field: keyof Experience, value: string | number) => void;
    removeExperience: (id: number) => void;
    setSkills: (skills: string) => void;
    setFinalThoughts: (thoughts: string) => void;
    setAiGenerated: (data: AiGeneratedContent | null) => void;
    setTemplateId: (id: string) => void;
}


// =======================================================
// DEBOUNCED DATABASE SAVING LOGIC
// =======================================================
const supabase = createClient();
let debounceTimer: NodeJS.Timeout;

const saveDataToDb = async (state: ResumeState) => {
    const { personal, experience, skills, finalThoughts } = state;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        console.error("Cannot save data: no active session.");
        return;
    }

    useResumeStore.setState({ isSaving: true });
    console.log("Saving resume data to database...");
    
    const { error } = await supabase.from('resumes').upsert({
        user_id: session.user.id,
        updated_at: new Date().toISOString(),
        personal: personal,
        experience: experience,
        skills: skills,
        final_thoughts: finalThoughts,
    }, { onConflict: 'user_id' });

    if (error) {
        console.error("Error saving resume data:", error);
        alert("Error: Could not save your changes.");
    } else {
        console.log("Save successful!");
    }
    useResumeStore.setState({ isSaving: false });
};

const triggerSave = (state: ResumeState) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        saveDataToDb(state);
    }, 1500);
};

// =======================================================
// THE ZUSTAND STORE IMPLEMENTATION
// =======================================================
const initialState: Omit<ResumeState, 'initialize' | 'setPersonal' | 'addExperience' | 'updateExperience' | 'removeExperience' | 'setSkills' | 'setFinalThoughts' | 'setAiGenerated' | 'setTemplateId'> = {
    personal: { name: '', email: '', phone: '', linkedin: '', github: '' },
    experience: [{ id: Date.now(), company: '', title: '', startDate: '', endDate: '', description: '' }],
    skills: '',
    finalThoughts: '',
    aiGenerated: null,
    templateId: 'modernist',
    isInitialized: false,
    isSaving: false,
};

export const useResumeStore = create<ResumeState>((set, get) => ({
    ...initialState,

    // --- Actions ---
    initialize: async () => { /* ... unchanged ... */ },

    setPersonal: (details) => {
        set((state) => ({ personal: { ...state.personal, ...details } }));
        triggerSave(get());
    },
    addExperience: () => {
        set((state) => ({ experience: [...state.experience, { ...initialState.experience[0], id: Date.now() }] }));
        triggerSave(get());
    },

    // =======================================================
    // THE FIX IS HERE
    // =======================================================
    updateExperience: (id, field, value) => {
        set((state) => {
            const newExperience = state.experience.map(exp => {
                if (exp.id === id) {
                    // Create a new object with the updated field
                    return { ...exp, [field]: value };
                }
                return exp;
            });
            // Return the updated state
            return { experience: newExperience };
        });
        triggerSave(get());
    },
    // =======================================================

    removeExperience: (id) => {
        set((state) => ({ experience: state.experience.filter(exp => exp.id !== id) }));
        triggerSave(get());
    },
    setSkills: (skills) => {
        set({ skills });
        triggerSave(get());
    },
    setFinalThoughts: (thoughts) => {
        set({ finalThoughts: thoughts });
        triggerSave(get());
    },

    setAiGenerated: (data) => set({ aiGenerated: data }),
    setTemplateId: (id) => set({ templateId: id }),
}));