// src/app/(main)/review/page.tsx - CORRECTED AND FINAL

'use client';

import { useResumeStore } from '@/store/resumeStore';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type { ResumeData } from '@/components/PDFDownloader';

// Import ALL your live preview components
import { Modernist } from '@/components/templates/Modernist';
import { Classic } from '@/components/templates/Classic';
import { Minimalist } from '@/components/templates/Minimalist';
import { Executive } from '@/components/templates/Executive';
import { Creative } from '@/components/templates/Creative';
import { Technical } from '@/components/templates/Technical';

// Dynamically import the PDFDownloader to avoid SSR issues
const PDFDownloader = dynamic(
  () => import('@/components/PDFDownloader'),
  { ssr: false }
);

// This map MUST have lowercase keys that match your template IDs
const templateMap = {
    modernist: Modernist,
    classic: Classic,
    minimalist: Minimalist,
    executive: Executive,
    creative: Creative,
    technical: Technical,
};

export default function ReviewPage() {
    // Select ALL necessary data from the Zustand store
    const { personal, experience, aiGenerated, templateId } = useResumeStore();
    const router = useRouter();

    // If the page is loaded without AI data, redirect back to the builder
    if (!aiGenerated) {
        if (typeof window !== 'undefined') {
          router.push('/builder');
        }
        return <div className="text-center p-8">Redirecting...</div>;
    }
    
    // Combine user data and AI data into the final object for rendering
    const resumeData: ResumeData = { 
        ...personal, 
        professionalSummary: aiGenerated.professionalSummary,
        technicalSkills: aiGenerated.technicalSkills,
        detailedExperience: experience.map(exp => {
            const aiExp = aiGenerated!.detailedExperience.find(ai => ai.id === exp.id);
            return {
                id: exp.id,
                title: exp.title,
                company: exp.company,
                points: aiExp ? aiExp.points : []
            };
        })
    };

    // =================================================================
    // THE FIX IS HERE: Dynamically select the component to render
    // based on the `templateId` from the store.
    // =================================================================
    const SelectedTemplateComponent = templateMap[templateId as keyof typeof templateMap] || Modernist;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gray-100">
            <h1 className="text-3xl font-bold text-center mb-4">Review Your Resume</h1>
            <p className="text-center mb-8">Your professional resume is ready! If you are happy, download it as a PDF.</p>
            
            <div className="mb-8">
                {/* 
                  THE SECOND FIX IS HERE: We pass both the `resumeData` AND the `templateId`
                  as props to the PDFDownloader component.
                */}
                <PDFDownloader resumeData={resumeData} templateId={templateId} />
            </div>

            <div className="p-8 bg-white shadow-lg">
                {/* Render the dynamically selected template for the live preview */}
                <SelectedTemplateComponent data={resumeData} />
            </div>
        </div>
    );
}