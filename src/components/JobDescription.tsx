// src/components/JobDescription.tsx
'use client';
import { useResumeStore } from '@/store/resumeStore';

export const JobDescription = () => {
    const { jobDescription, setJobDescription } = useResumeStore((s: { jobDescription: any; setJobDescription: any; }) => ({
        jobDescription: s.jobDescription,
        setJobDescription: s.setJobDescription,
    }));
    // Note on OCR: A client-side library like Tesseract.js could be added here
    // to handle image uploads, but for a robust MVP, text is better.

    return (
        <div className="bg-gray-800 p-8 rounded-xl border border-yellow-400/50">
            <h2 className="text-2xl font-bold mb-4 text-white">Target Job Description (Optional)</h2>
            <p className="text-gray-400 mb-4">Paste the job description here. Our AI will tailor your resume to match its keywords and requirements.</p>
            <textarea 
                className="w-full p-3 min-h-40 border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Paste job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
            />
        </div>
    );
};