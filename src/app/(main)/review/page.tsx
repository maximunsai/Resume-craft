'use client';

import { useResumeStore } from '@/store/resumeStore';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type { ResumeData } from '@/types/resume';

// --- Import ALL 17 of your live preview template components ---
import { Modernist } from '@/components/templates/Modernist';
import { Classic } from '@/components/templates/Classic';
// ... import all the rest
import { Cosmopolitan } from '@/components/templates/Cosmopolitan';
import { Academic } from '@/components/templates/Academic';
import { Apex } from '@/components/templates/Apex';
import { Cascade } from '@/components/templates/Cascade';
import { Corporate } from '@/components/templates/Corporate';
import { Creative } from '@/components/templates/Creative';
import { Elegant } from '@/components/templates/Elegant';
import { Executive } from '@/components/templates/Executive';
import { Metro } from '@/components/templates/Metro';
import { Minimalist } from '@/components/templates/Minimalist';
import { Onyx } from '@/components/templates/Onyx';
import { Pinnacle } from '@/components/templates/Pinnacle';
import { Simple } from '@/components/templates/Simple';
import { Technical } from '@/components/templates/Technical';
import { Bold } from 'lucide-react';

const PDFDownloader = dynamic(
  () => import('@/components/PDFDownloader'),
  { ssr: false }
);

const templateMap = {
    modernist: Modernist, classic: Classic, executive: Executive,
    minimalist: Minimalist, creative: Creative, academic: Academic,
    technical: Technical, corporate: Corporate, simple: Simple,
    bold: Bold, elegant: Elegant, apex: Apex, cascade: Cascade,
    metro: Metro, pinnacle: Pinnacle, onyx: Onyx, cosmopolitan: Cosmopolitan,
};

export default function ReviewPage() {
    const { personal, experience, aiGenerated, templateId } = useResumeStore();
    const router = useRouter();

    if (!aiGenerated) {
        if (typeof window !== 'undefined') router.push('/builder');
        return <div className="text-center p-8 text-gray-400">Redirecting...</div>;
    }
    
    // =================================================================
    // THE DEFINITIVE FIX: A robust and correct data merging strategy.
    // =================================================================
    const resumeData: ResumeData = { 
        name: personal.name || '',
        email: personal.email || '',
        phone: personal.phone || '',
        linkedin: personal.linkedin || '',
        github: personal.github || '',
        
        professionalSummary: aiGenerated.professionalSummary || '',
        technicalSkills: aiGenerated.technicalSkills || [],

        detailedExperience: experience.map(originalExp => {
            // Find the corresponding experience object from the AI's response.
            const aiExperienceData = aiGenerated.detailedExperience.find(aiExp => aiExp.id === originalExp.id);
            
            // Create the final, complete object.
            return {
                ...originalExp, // 1. Start with ALL properties from the original experience object.
                points: aiExperienceData ? aiExperienceData.points : [originalExp.description], // 2. Overwrite `points` with the AI's version, or fallback to the original description.
            };
        })
    };

    const SelectedTemplateComponent = templateMap[templateId as keyof typeof templateMap] || Modernist;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-poppins font-bold text-white">Your Forged Resume is Ready</h1>
                <p className="text-lg text-gray-400 mt-2">Review your masterpiece. If you're happy, download it.</p>
            </div>
            
            <div className="mb-8 max-w-sm mx-auto">
                <PDFDownloader 
                    resumeData={resumeData} 
                    templateId={templateId} 
                    key={templateId} 
                />
            </div>

            <div className="p-8 md:p-12 bg-white shadow-2xl rounded-lg">
                <SelectedTemplateComponent data={resumeData} />
            </div>
        </div>
    );
}