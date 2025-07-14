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
import { Academic } from '@/components/templates/Academic';
import { Corporate } from '@/components/templates/Corporate';
import { Simple } from '@/components/templates/Simple';
import { Bold } from '@/components/templates/Bold';
import { Elegant } from '@/components/templates/Elegant';
import { Apex } from '@/components/templates/Apex';
import { Cascade } from '@/components/templates/Cascade';
import { Metro } from '@/components/templates/Metro';
import { Pinnacle } from '@/components/templates/Pinnacle';
import { Onyx } from '@/components/templates/Onyx';
import { Cosmopolitan } from '@/components/templates/Cosmopolitan';

// Dynamically import the PDFDownloader to avoid SSR issues
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
    const { personal, experience, aiGenerated, templateId } = useResumeStore();
    const router = useRouter();

    if (!aiGenerated) {
        if (typeof window !== 'undefined') {
          router.push('/builder');
        }
        return <div className="text-center p-8 text-gray-400">Loading your masterpiece or redirecting...</div>;
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

    const SelectedTemplateComponent = templateMap[templateId as keyof typeof templateMap] || Modernist;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-poppins font-bold text-white">Your Forged Resume is Ready</h1>
                <p className="text-lg text-gray-400 mt-2">Review your masterpiece. If you're happy, download your weapon of choice.</p>
            </div>
            
            <div className="mb-8 max-w-sm mx-auto">
                <PDFDownloader resumeData={resumeData} templateId={templateId} />
            </div>

            {/* The resume preview card with a white background to make the content pop */}
            <div className="p-8 md:p-12 bg-white shadow-2xl rounded-lg">
                <SelectedTemplateComponent data={resumeData} />
            </div>
        </div>
    );
}