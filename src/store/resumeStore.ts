'use client';

import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
// Assuming your types are in src/types/resume.ts
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
    reset: () => void; // The new reset action
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

            console.log("Loading user resume from database...");
            const { data, error } = await supabase.from('resumes').select('*').eq('user_id', session.user.id).single();

            if (data) {
                // User has existing data, so we load it.
                set({
                    personal: data.personal || initialState.personal,
                    experience: data.experience?.length > 0 ? data.experience : initialState.experience,
                    skills: data.skills || initialState.skills,
                    finalThoughts: data.final_thoughts || initialState.finalThoughts,
                    jobDescription: data.job_description || initialState.jobDescription,
                });
            } else {
                // =================================================================
                // THE SAFETY NET FIX: If a user has no data (they are new),
                // we explicitly reset the store to wipe any potential lingering data.
                // =================================================================
                set(initialState);
            }

            if (error && error.code !== 'PGRST116') { // Ignore "no rows found" error
                 console.error("Error loading resume data:", error);
            }
            
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
        populateFromParsedResume: (parsedData) => {
            const newState: Partial<ResumeStateData> = {};
            if (parsedData.personal) newState.personal = { ...get().personal, ...parsedData.personal };
            if (parsedData.experience?.length > 0) {
                newState.experience = parsedData.experience.map((exp: any, i: number) => ({
                    id: Date.now() + i,
                    company: exp.company || '', title: exp.title || '',
                    startDate: exp.startDate || '', endDate: exp.endDate || '',
                    description: exp.description || '',
                }));
            }
            if (parsedData.skills) newState.skills = parsedData.skills;
            set(newState);
            triggerSave();
        },

        setAiGenerated: (data) => set({ aiGenerated: data }),
        setTemplateId: (id) => set({ templateId: id }),
        
        // =================================================================
        // THE TRIGGER FIX: The complete and correct reset action.
        // =================================================================
        reset: () => {
            console.log("Resetting resume store to initial state.");
            set(initialState);
        },
    };
});