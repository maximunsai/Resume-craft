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
export interface AiGeneratedContent { /* ... */ }