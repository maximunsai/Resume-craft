// src/app/(main)/review/page.tsx - FULL REPLACEMENT (FIXED)
'use client';
import { useResumeStore } from '@/store/resumeStore';
import dynamic from 'next/dynamic';
import { Modernist } from '@/components/templates/Modernist';
import { ResumeData } from '@/components/PDFDownloader'; // Import our standard type
import { useRouter } from 'next/navigation';

// Dynamically import the PDFDownloader to avoid SSR issues
const PDFDownloader = dynamic(
  () => import('@/components/PDFDownloader'),
  { ssr: false }
);

export default function ReviewPage() {
    const data = useResumeStore(state => state);
    const router = useRouter();

    // If the page is loaded without AI data, redirect back to the builder
    if (!data.aiGenerated) {
        if (typeof window !== 'undefined') {
          router.push('/builder');
        }
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl">No resume data found. Redirecting...</h1>
            </div>
        );
    }
    
    // CRITICAL FIX: Combine the user's original input with the AI-generated points
    // to create the final, complete resume data object.
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
                // Use the AI points if found, otherwise provide an empty array
                points: aiExp ? aiExp.points : []
            };
        })
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gray-100">
            <h1 className="text-3xl font-bold text-center mb-4">Review Your Resume</h1>
            {/* This text has been checked to ensure no unescaped characters */}
            <p className="text-center mb-8">
                Your professional resume is ready! If you are happy with the result, download it as a PDF.
            </p>
            
            <div className="mb-8">
                <PDFDownloader resumeData={resumeData} />
            </div>

            {/* Live Preview of the resume */}
            <div className="p-8 bg-white shadow-lg">
                <Modernist data={resumeData} />
            </div>
        </div>
    );
}