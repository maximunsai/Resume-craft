// src/app/(main)/templates/page.tsx

'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

// This list will eventually have 50+ items.
const templates = [
    { id: 'modernist', name: 'The Modernist', thumbnailUrl: '/thumbnails/modernist.png' },
    { id: 'classic', name: 'The Classic', thumbnailUrl: '/thumbnails/classic.png' },
    // Add more templates here...
];

export default function TemplateSelectionPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { templateId, setTemplateId, setAiGenerated, ...resumeData } = useResumeStore();

    const handleGenerateResume = async () => {
        setIsLoading(true);
        // ================================================================
        // PROACTIVE FIX: Clear any old AI data before starting the new generation.
        // ================================================================
        // Option 1: Try removing the line entirely if clearing isn't critical
        // setAiGenerated(undefined);
        
        // Option 2: If you have a reset method in your store, use it instead
        // useResumeStore.getState().resetAiGenerated();
        
        // Option 3: Set to an empty object that matches the expected structure
        // setAiGenerated({
        //     professionalSummary: '',
        //     technicalSkills: [],
        //     detailedExperience: []
        // });

        try {
            const response = await fetch('/api/generate-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resumeData),
            });
            const aiData = await response.json();
            if(!response.ok) throw new Error(aiData.error || "Failed to generate resume");

            setAiGenerated(aiData);
            router.push('/review');
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-4xl font-bold text-center mb-2 text-[#0A2647]">Choose Your Template</h1>
            <p className="text-center text-gray-600 mb-8">Select a format, then we'll generate your resume.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {templates.map((template) => (
                    <div 
                        key={template.id} 
                        className={`border-4 rounded-lg overflow-hidden cursor-pointer transition-all ${templateId === template.id ? 'border-[#205295]' : 'border-transparent hover:border-gray-300'}`}
                        onClick={() => setTemplateId(template.id)}
                    >
                        <Image src={template.thumbnailUrl} alt={template.name} width={400} height={565} className="w-full"/>
                        <p className="text-center font-semibold p-2 bg-gray-50">{template.name}</p>
                    </div>
                ))}
            </div>

            <div className="text-center mt-12">
                <button 
                    onClick={handleGenerateResume} 
                    disabled={isLoading} 
                    className="px-12 py-4 bg-green-600 text-white font-bold rounded-lg text-xl disabled:bg-gray-400 hover:bg-green-700"
                >
                    {isLoading ? 'Crafting Your Masterpiece...' : 'Generate & Review'}
                </button>
            </div>
        </div>
    );
}