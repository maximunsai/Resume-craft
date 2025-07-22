// This is the single source of truth for our main data structures.

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
    points?: string[]; // The AI-generated points are optional
}

export interface AiGeneratedContent {
    professionalSummary: string;
    technicalSkills: string[];
    detailedExperience: Array<{
        title: string;
        company: string; id: number; points: string[] 
}>;
}

// This is the main interface we will be importing everywhere
export type ResumeData = PersonalDetails & AiGeneratedContent & {
    detailedExperience: Experience[];
};