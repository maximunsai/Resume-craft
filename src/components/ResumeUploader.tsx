// src/components/ResumeUploader.tsx
'use client';
import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { UploadCloud, Loader2 } from 'lucide-react';

export const ResumeUploader = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const populateFromParsedResume = useResumeStore((s: { populateFromParsedResume: any; }) => s.populateFromParsedResume);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await fetch('/api/parse-resume', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to parse resume.');
            
            populateFromParsedResume(data); // This populates our form!
        
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-white">Quick Start</h2>
            <p className="text-gray-400 mb-4">Upload your existing resume (PDF or DOCX) to automatically fill the fields below.</p>
            <label htmlFor="resume-upload" className="w-full flex justify-center items-center gap-3 px-6 py-4 bg-gray-700 text-gray-300 rounded-lg cursor-pointer hover:bg-gray-600">
                {isLoading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
                <span>{isLoading ? 'Parsing Your Resume...' : 'Upload Resume'}</span>
            </label>
            <input id="resume-upload" type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileChange} />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
    );
};