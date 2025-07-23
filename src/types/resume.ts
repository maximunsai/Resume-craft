// src/types/resume.ts - THE SINGLE SOURCE OF TRUTH

export interface PersonalDetails {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
}

export interface Experience {
    id: number;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
    points?: string[]; // The AI-generated points are optional on the base type
}

export interface AiGeneratedContent {
    professionalSummary: string;
    technicalSkills: string[];
    // The AI only generates `id` and `points` for each experience
    detailedExperience: Array<{ id: number; points: string[] }>;
}

// This is the FINAL, COMPLETE type for our data object, used for rendering.
// It is the definitive "contract" that all components will use.
export interface ResumeData {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    professionalSummary: string;
    technicalSkills: string[];
    // The final experience object will have all original data PLUS the AI points.
    detailedExperience: Experience[];
}