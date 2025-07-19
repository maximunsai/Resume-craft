'use client';

import { useResumeStore } from '@/store/resumeStore';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
// Ensure ResumeData is imported from its central location, e.g., your types file
import type { ResumeData } from '@/types/resume';

// Import ALL your live preview components
import { Modernist } from '@/components/templates/Modernist';
import { Classic } from '@/components/templates/Classic';
// ... import all 17 template components

// Dynamically import the PDFDownloader
const PDFDownloader = dynamic(
    () => import('@/components/PDFDownloader'),
    { ssr: false }
);

// The map of all your templates
const templateMap = {
    modernist: Modernist,
    classic: Classic,
    // ... all 17 templates
};

export default function ReviewPage() {
    const { personal, experience, aiGenerated, templateId } = useResumeStore();
    const router = useRouter();

    if (!aiGenerated) {
        if (typeof window !== 'undefined') router.push('/builder');
        return <div className="text-center p-8 text-gray-400">Loading your masterpiece or redirecting...</div>;
    }

    // =================================================================
    // THE DEFINITIVE FIX IS HERE: We construct the `resumeData` object
    // with explicit properties and default fallbacks.
    // =================================================================
    const resumeData: ResumeData = {
        // Provide a default empty string for every personal field
        name: (personal.name || '') as string,
        email: (personal.email || '') as string,
        phone: (personal.phone || '') as string,
        linkedin: (personal.linkedin || '') as string,
        github: (personal.github || '') as string,


        // Use the AI-generated content
        professionalSummary: aiGenerated.professionalSummary || 'No summary generated.',
        technicalSkills: aiGenerated.technicalSkills || [],

        // The logic to merge experience data is crucial
        detailedExperience: experience.map(exp => {
            const aiExp = aiGenerated.detailedExperience.find((ai: { id: number; }) => ai.id === exp.id);
            return {
                // Ensure all original properties are preserved with fallbacks
                id: exp.id,
                title: exp.title || '',
                company: exp.company || '',
                startDate: exp.startDate || '',
                endDate: exp.endDate || '',
                // The original description is not needed here as we use AI points
                description: '',
                // Use the AI points if they exist, otherwise provide an empty array
                points: aiExp ? aiExp.points : [],
            };
        })
    };

    // This logic remains correct
    const SelectedTemplateComponent = templateMap[templateId as keyof typeof templateMap] || Modernist;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-poppins font-bold text-white">Your Forged Resume is Ready</h1>
                <p className="text-lg text-gray-400 mt-2">Review your masterpiece. If you're happy, download your weapon of choice.</p>
            </div>

            <div className="mb-8 max-w-sm mx-auto">
                <PDFDownloader resumeData={resumeData} templateId={templateId} key={templateId} />
            </div>

            <div className="p-8 md:p-12 bg-white shadow-2xl rounded-lg">
                <SelectedTemplateComponent data={resumeData} />
            </div>
        </div>
    );
}