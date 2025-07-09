// src/app/(main)/review/page.tsx
'use client';
import { useResumeStore } from '@/store/resumeStore';
import dynamic from 'next/dynamic';
import { Modernist } from '@/components/templates/Modernist';

// Dynamically import the PDFDownloader to avoid SSR issues with the library
const PDFDownloader = dynamic(
  () => import('@/components/PDFDownloader'),
  { ssr: false }
);

export default function ReviewPage() {
    const data = useResumeStore(state => state);

    if (!data.aiGenerated) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl">No resume data found.</h1>
                <p>Please go back to the builder to create your resume.</p>
            </div>
        );
    }
    
    const resumeData = { ...data.personal, ...data.aiGenerated };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gray-100">
            <h1 className="text-3xl font-bold text-center mb-4">Review Your Resume</h1>
            <p className="text-center mb-8">Your resume is ready! If you're happy, download it as a PDF.</p>
            
            <div className="mb-8">
                <PDFDownloader resumeData={resumeData} />
            </div>

            {/* Live Preview */}
            <div className="p-8 bg-white shadow-lg">
                <Modernist data={resumeData} />
            </div>
        </div>
    );
}