'use client';

import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

// =======================================================
// TYPE DEFINITIONS (Clean and Centralized)
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

// This interface defines the "shape" of our store: its data and its functions.
export interface ResumeState {
    // Data
    personal: PersonalDetails;
    experience: Experience[];
    skills: string;
    finalThoughts: string;
    aiGenerated: AiGeneratedContent | null;
    templateId: string;
    isInitialized: boolean; // NEW: To track if data has been loaded from DB

    // Actions (functions to modify the state)
    initialize: () => Promise<void>;
    setPersonal: (details: Partial<PersonalDetails>) => void;
    addExperience: () => void;
    updateExperience: (id: number, field: keyof Experience, value: string) => void;
    removeExperience: (id: number) => void;
    setSkills: (skills: string) => void;
    setFinalThoughts: (thoughts: string) => void;
    setAiGenerated: (data: AiGeneratedContent | null) => void;
    setTemplateId: (id: string) => void;
    resetStore: () => void;
}


// =======================================================
// DEBOUNCED DATABASE SAVING LOGIC
// =======================================================
const supabase = createClient();
let debounceTimer: NodeJS.Timeout;

const saveDataToDb = async (state: ResumeState) => {
    const { personal, experience, skills, finalThoughts } = state;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    console.log("Saving resume data to database...");
    const { error } = await supabase.from('resumes').upsert({
        user_id: session.user.id,
        updated_at: new Date().toISOString(),
        personal: personal,
        experience: experience,
        skills: skills,
        final_thoughts: finalThoughts,
    });

    if (error) console.error("Error saving resume data:", error);
};

// This function will be called by our actions to trigger a save
const triggerSave = (state: ResumeState) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        saveDataToDb(state);
    }, 1500); // Wait 1.5 seconds after the last change to save
};


// =======================================================
// THE ZUSTAND STORE IMPLEMENTATION
// =======================================================

const initialState = {
    personal: { name: '', email: '', phone: '', linkedin: '', github: '' },
    experience: [{ id: Date.now(), company: '', title: '', startDate: '', endDate: '', description: '' }],
    skills: '',
    finalThoughts: '',
    aiGenerated: null,
    templateId: 'modernist',
    isInitialized: false,
};

export const useResumeStore = create<ResumeState>((set, get) => ({
    ...initialState,

    // --- Actions ---

    initialize: async () => {
        if (get().isInitialized) return; // Prevent re-initializing

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            set({ isInitialized: true });
            return;
        };

        console.log("Loading user resume from database...");
        const { data, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

        if (data) {
            set({
                personal: data.personal || initialState.personal,
                // Ensure experience is always an array
                experience: data.experience && data.experience.length > 0 ? data.experience : initialState.experience,
                skills: data.skills || initialState.skills,
                finalThoughts: data.final_thoughts || initialState.finalThoughts,
            });
        }
        if (error && error.code !== 'PGRST116') {
             console.error("Error loading resume data:", error);
        }
        
        set({ isInitialized: true });
    },

    setPersonal: (details) => {
        set((state) => ({ personal: { ...state.personal, ...details } }));
        triggerSave(get());
    },
    addExperience: () => {
        set((state) => ({
            experience: [...state.experience, { id: Date.now(), company: '', title: '', startDate: '', endDate: '', description: '' }]
        }));
        triggerSave(get());
    },
    updateExperience: (id, field, value) => {
        set((state) => ({
            experience: state.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
        }));
        triggerSave(get());
    },
    removeExperience: (id) => {
        set((state) => ({
            experience: state.experience.filter(exp => exp.id !== id)
        }));
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

    // These setters don't need to save to the DB
    setAiGenerated: (data) => set({ aiGenerated: data }),
    setTemplateId: (id) => set({ templateId: id }),
    resetStore: () => set(initialState),
}));