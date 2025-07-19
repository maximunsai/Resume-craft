// src/types/resume.ts
export interface PersonalDetails {
    email: string | number | readonly string[] | undefined;
    phone: string | number | readonly string[] | undefined;
    linkedin: string | number | readonly string[] | undefined;
    github: string | number | readonly string[] | undefined;
    name: string;
}
export interface Experience {
    title: any;
    company: any;
    description: any;
    startDate: string;
    endDate: string;
    id: number;
}
export interface AiGeneratedContent {
    professionalSummary: string;
    technicalSkills: never[];
    detailedExperience: any;
}

// This goes inside /types/resume.ts

export interface ResumeData {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    professionalSummary: string;
    technicalSkills: string[];
    detailedExperience: {
        id: number;
        title: string;
        company: string;
        startDate: string;
        endDate: string;
        description: string;
        points: string[];
    }[];
}

