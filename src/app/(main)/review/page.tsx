// src/app/(main)/review/page.tsx

'use client';

import { useResumeStore } from '@/store/resumeStore';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type { ResumeData } from '@/components/PDFDownloader';

// Import all your preview components
import { Modernist } from '@/components/templates/Modernist';
import { Classic } from '@/components/templates/Classic'; // Your new template component

// Dynamically import the PDFDownloader to avoid SSR issues
const PDFDownloader = dynamic(
  () => import('@/components/PDFDownloader'),
  { ssr: false }
);

// A map to easily select the correct template component
const templateMap = {
    modernist: Modernist,
    classic: Classic,
};

export default function ReviewPage() {
    const data = useResumeStore(state => state);
    const router = useRouter();

    // Check if aiGenerated data exists, if not redirect
    if (!data.aiGenerated) {
        router.push('/');
        return null; // Return null to prevent rendering while redirecting
    }

    // This logic to combine data is correct, now with proper null checking
    const resumeData: ResumeData = { 
        ...data.personal, 
        professionalSummary: data.aiGenerated.professionalSummary,
        technicalSkills: data.aiGenerated.technicalSkills,
        detailedExperience: data.experience.map(exp => {
            const aiExp = data.aiGenerated!.detailedExperience.find(ai => ai.id === exp.id);
            return {
                id: exp.id,
                title: exp.title,
                company: exp.company,
                points: aiExp ? aiExp.points : []
            };
        })
    };

    // Dynamically select the component to render based on the stored templateId
    const SelectedTemplateComponent = templateMap[data.templateId as keyof typeof templateMap] || Modernist;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gray-100">
            <h1 className="text-3xl font-bold text-center mb-4">Review Your Resume</h1>
            <p className="text-center mb-8">Your professional resume is ready! If you are happy, download it as a PDF.</p>
            
            <div className="mb-8">
                {/* IMPORTANT: Pass the templateId to the downloader */}
                <PDFDownloader resumeData={resumeData} templateId={data.templateId} />
            </div>

            <div className="p-8 bg-white shadow-lg">
                {/* Render the dynamically selected template */}
                <SelectedTemplateComponent data={resumeData} />
            </div>
        </div>
    );
}