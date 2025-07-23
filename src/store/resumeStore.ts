'use client';

import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { PersonalDetails, Experience, AiGeneratedContent } from '@/types/resume';


// =======================================================
// INTERFACE DEFINITIONS (The "Contract" for our store)
// =======================================================

export interface ResumeStateData {
    personal: PersonalDetails;
    experience: Experience[];
    skills: string;
    finalThoughts: string;
    jobDescription: string;
    aiGenerated: AiGeneratedContent | null;
    templateId: string;
    isInitialized: boolean;
    isSaving: boolean;
}



export interface ResumeStateActions {
    initialize: () => Promise<void>;
    setPersonal: (details: Partial<PersonalDetails>) => void;
    addExperience: () => void;
    updateExperience: (id: number, field: keyof Experience, value: string | number) => void;
    removeExperience: (id: number) => void;
    setSkills: (skills: string) => void;
    setFinalThoughts: (thoughts: string) => void;
    setJobDescription: (jd: string) => void;
    populateFromParsedResume: (parsedData: any) => void;
    setAiGenerated: (data: AiGeneratedContent | null) => void;
    setTemplateId: (id: string) => void;
    reset: () => void;
}

export type ResumeState = ResumeStateData & ResumeStateActions;


// =======================================================
// STORE IMPLEMENTATION
// =======================================================

const initialState: ResumeStateData = {
    personal: { name: '', email: '', phone: '', linkedin: '', github: '' },
    experience: [{ id: Date.now(), company: '', title: '', startDate: '', endDate: '', description: '' }],
    skills: '',
    finalThoughts: '',
    jobDescription: '',
    aiGenerated: null,
    templateId: 'modernist',
    isInitialized: false,
    isSaving: false,
};

export const useResumeStore = create<ResumeState>((set, get) => {
    const supabase = createClient();
    let debounceTimer: NodeJS.Timeout;

    const saveDataToDb = async (stateToSave: ResumeStateData) => {
        const { personal, experience, skills, finalThoughts, jobDescription } = stateToSave;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        set({ isSaving: true });
        console.log("Saving resume data to database...");

        const { error } = await supabase.from('resumes').upsert({
            user_id: session.user.id,
            updated_at: new Date().toISOString(),
            personal, experience, skills,
            final_thoughts: finalThoughts,
            job_description: jobDescription,
        }, { onConflict: 'user_id' });

        if (error) {
            console.error("Error saving resume data:", error);
            alert("Error: Could not save your changes.");
        } else {
            console.log("Save successful!");
        }
        set({ isSaving: false });
    };

    const triggerSave = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const currentState = get();
            saveDataToDb(currentState);
        }, 1500);
    };

    return {
        ...initialState,

        initialize: async () => {
            if (get().isInitialized) return;
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                set({ isInitialized: true });
                return;
            }
            const { data, error } = await supabase.from('resumes').select('*').eq('user_id', session.user.id).single();
            if (data) {
                set({
                    personal: data.personal || initialState.personal,
                    experience: data.experience?.length > 0 ? data.experience : initialState.experience,
                    skills: data.skills || initialState.skills,
                    finalThoughts: data.final_thoughts || initialState.finalThoughts,
                    jobDescription: data.job_description || initialState.jobDescription,
                });
            }
            if (error && error.code !== 'PGRST116') console.error("Error loading data:", error);
            set({ isInitialized: true });
        },

        setPersonal: (details) => {
            set(state => ({ personal: { ...state.personal, ...details } }));
            triggerSave();
        },
        addExperience: () => {
            set(state => ({ experience: [...state.experience, { ...initialState.experience[0], id: Date.now() }] }));
            triggerSave();
        },
        updateExperience: (id, field, value) => {
            set(state => ({
                experience: state.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
            }));
            triggerSave();
        },
        removeExperience: (id) => {
            set(state => ({ experience: state.experience.filter(exp => exp.id !== id) }));
            triggerSave();
        },
        setSkills: (skills) => {
            set({ skills });
            triggerSave();
        },
        setFinalThoughts: (thoughts) => {
            set({ finalThoughts: thoughts });
            triggerSave();
        },
        setJobDescription: (jd) => {
            set({ jobDescription: jd });
            triggerSave();
        },

        // =======================================================
        // THE DEFINITIVE FIX: Data Sanitization for AI responses
        // =======================================================
        populateFromParsedResume: (parsedData) => {
            const newState: Partial<ResumeStateData> = {};

            if (parsedData.personal && typeof parsedData.personal === 'object') {
                newState.personal = { ...get().personal, ...parsedData.personal };
            }
            
            if (parsedData.experience && Array.isArray(parsedData.experience)) {
                // We don't trust the AI's data. We build a new array of objects
                // that are GUARANTEED to match our `Experience` type.
                const sanitizedExperience: Experience[] = parsedData.experience.map((exp: any, index: number) => ({
                    id: Date.now() + index, // Always generate a new, valid number ID
                    company: exp.company || '',      // Provide fallback for every property
                    title: exp.title || '',
                    startDate: exp.startDate || '',
                    endDate: exp.endDate || '',
                    description: exp.description || '',
                }));
                newState.experience = sanitizedExperience;
            }

            if (typeof parsedData.skills === 'string') {
                newState.skills = parsedData.skills;
            }
            
            set(newState);

// <h4>This will trigger the save.</h4>
        },

        setAiGenerated: (data) => set({ aiGenerated: data }),
        setTemplateId: (id) => set({ templateId: id }),
        reset: () => set(initialState),
    };
});