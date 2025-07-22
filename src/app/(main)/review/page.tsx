'use client';

import { useResumeStore } from '@/store/resumeStore';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type { ResumeData } from '@/types/resume';

// --- Import ALL 17 of your live preview template components ---
import { Modernist } from '@/components/templates/Modernist';
import { Classic } from '@/components/templates/Classic';
import { Executive } from '@/components/templates/Executive';
// ... import all the rest, down to Cosmopolitan ...
import { Cosmopolitan } from '@/components/templates/Cosmopolitan';
import { Academic } from '@/components/templates/Academic';
import { Apex } from '@/components/templates/Apex';
import { Cascade } from '@/components/templates/Cascade';
import { Corporate } from '@/components/templates/Corporate';
import { Creative } from '@/components/templates/Creative';
import { Elegant } from '@/components/templates/Elegant';
import { Metro } from '@/components/templates/Metro';
import { Minimalist } from '@/components/templates/Minimalist';
import { Onyx } from '@/components/templates/Onyx';
import { Pinnacle } from '@/components/templates/Pinnacle';
import { Simple } from '@/components/templates/Simple';
import { Technical } from '@/components/templates/Technical';
import { Bold } from 'lucide-react';

// Dynamically import the PDFDownloader to avoid server-side rendering issues
const PDFDownloader = dynamic(
  () => import('@/components/PDFDownloader'),
  { ssr: false }
);

// This map MUST have lowercase keys that match your template IDs
const templateMap = {
    modernist: Modernist, classic: Classic, executive: Executive, minimalist: Minimalist,
    creative: Creative, academic: Academic, technical: Technical, corporate: Corporate,
    simple: Simple, bold: Bold, elegant: Elegant, apex: Apex, cascade: Cascade,
    metro: Metro, pinnacle: Pinnacle, onyx: Onyx, cosmopolitan: Cosmopolitan,
};

export default function ReviewPage() {
    // Select ALL necessary data from the Zustand store, including templateId
    const { personal, experience, aiGenerated, templateId } = useResumeStore();
    const router = useRouter();

    if (!aiGenerated) {
        if (typeof window !== 'undefined') router.push('/builder');
        return <div className="text-center p-8 text-gray-400">Redirecting...</div>;
    }
    
    // This logic correctly combines user data and AI data
    const resumeData: ResumeData = { 
        name: (personal.name || '') as string,
        email:( personal.email || '') as string,
        phone: (personal.phone || '') as string,
        linkedin: (personal.linkedin || '') as string,
        github: (personal.github || '') as string,
        professionalSummary: aiGenerated.professionalSummary || '',
        technicalSkills: aiGenerated.technicalSkills || [],
        detailedExperience: aiGenerated.detailedExperience.map((aiExp: { id: number; }) => {
            const originalExp = experience.find(exp => exp.id === aiExp.id);
            return {
                ...aiExp,
                // Ensure all fields from the original experience are preserved
                startDate: originalExp?.startDate || '',
                endDate: originalExp?.endDate || '',
                description: originalExp?.description || '',
            };
        })
    };

    // =================================================================
    // THE DEFINITIVE FIX - PART 1: Dynamic Component Selection
    // This line reads the `templateId` from the store and selects the
    // correct component from the map. The `|| Modernist` is a safe fallback.
    // =================================================================
    const SelectedTemplateComponent = templateMap[templateId as keyof typeof templateMap] || Modernist;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-poppins font-bold text-white">Your Forged Resume is Ready</h1>
                <p className="text-lg text-gray-400 mt-2">Review your masterpiece. If you're happy, download it.</p>
            </div>
            
            <div className="mb-8 max-w-sm mx-auto">
                {/* 
                  =================================================================
                  THE DEFINITIVE FIX - PART 2: Passing the templateId to the Downloader
                  This `key={templateId}` is CRITICAL. It tells React to create a
                  fresh instance of the downloader when the template changes.
                  =================================================================
                */}
                <PDFDownloader 
                    resumeData={resumeData} 
                    templateId={templateId} 
                    key={templateId} 
                />
            </div>

            <div className="p-8 md:p-12 bg-white shadow-2xl rounded-lg">
                {/* Render the dynamically selected template for the live preview */}
                <SelectedTemplateComponent data={resumeData} />
            </div>
        </div>
    );
}