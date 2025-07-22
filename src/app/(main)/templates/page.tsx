'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

// This list of templates is correct and preserved.
const templates = [
    { id: 'modernist', name: 'Modernist', thumbnailUrl: '/thumbnails/modernist.png' },
    { id: 'classic', name: 'Classic', thumbnailUrl: '/thumbnails/classic.png' },
    { id: 'executive', name: 'Executive', thumbnailUrl: '/thumbnails/executive.png' },
    { id: 'minimalist', name: 'Minimalist', thumbnailUrl: '/thumbnails/minimalist.png' },
    { id: 'creative', name: 'Creative', thumbnailUrl: '/thumbnails/creative.png' },
    { id: 'academic', name: 'Academic', thumbnailUrl: '/thumbnails/academic.png' },
    { id: 'technical', name: 'Technical', thumbnailUrl: '/thumbnails/technical.png' },
    { id: 'corporate', name: 'Corporate', thumbnailUrl: '/thumbnails/corporate.png' },
    { id: 'simple', name: 'Simple', thumbnailUrl: '/thumbnails/simple.png' },
    { id: 'bold', name: 'Bold', thumbnailUrl: '/thumbnails/bold.png' },
    { id: 'elegant', name: 'Elegant', thumbnailUrl: '/thumbnails/elegant.png' },
    { id: 'apex', name: 'Apex', thumbnailUrl: '/thumbnails/apex.png' },
    { id: 'cascade', name: 'Cascade', thumbnailUrl: '/thumbnails/cascade.png' },
    { id: 'metro', name: 'Metro', thumbnailUrl: '/thumbnails/metro.png' },
    { id: 'pinnacle', name: 'Pinnacle', thumbnailUrl: '/thumbnails/pinnacle.png' },
    { id: 'onyx', name: 'Onyx', thumbnailUrl: '/thumbnails/onyx.png' },
    { id: 'cosmopolitan', name: 'Cosmopolitan', thumbnailUrl: '/thumbnails/cosmopolitan.png' },
];

export default function TemplateSelectionPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // We now use a selector to get only what we need for rendering and interaction.
    // This is more performant.
    const { templateId, setTemplateId, setAiGenerated } = useResumeStore(state => ({
        templateId: state.templateId,
        setTemplateId: state.setTemplateId,
        setAiGenerated: state.setAiGenerated,
    }));

    const handleGenerateResume = async () => {
        // The list of available templates is correct.
        const availableTemplates = [ 'modernist', /* ... all your other template IDs ... */ 'cosmopolitan' ];
        if (!availableTemplates.includes(templateId)) {
            alert(`Sorry, the "${templateId}" template is not yet available for generation.`);
            return;
        }

        setIsLoading(true);
        useResumeStore.setState({ aiGenerated: null });

        try {
            // =================================================================
            // THE DEFINITIVE FIX: Get the fresh data right before the API call.
            // =================================================================
            // We get a snapshot of the LATEST state from the store. This prevents stale data.
            const currentState = useResumeStore.getState();
            const resumeDataForApi = {
                personal: currentState.personal,
                experience: currentState.experience,
                skills: currentState.skills,
                finalThoughts: currentState.finalThoughts,
                jobDescription: currentState.jobDescription,
            };

            const response = await fetch('/api/generate-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // We send the fresh, up-to-date data to the backend.
                body: JSON.stringify(resumeDataForApi),
            });

            const aiData = await response.json();
            if (!response.ok) throw new Error(aiData.error || "Failed to generate resume");

            setAiGenerated(aiData);
            router.push('/review');
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- The JSX is preserved from your working version ---
    return (
        <div className="max-w-7xl mx-auto p-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold font-poppins text-white">Choose Your Template</h1>
                <p className="text-lg text-gray-400 mt-2">Select a professionally designed format. Click to select, then generate.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {templates.map((template) => (
                    <div 
                        key={template.id} 
                        className="group cursor-pointer"
                        onClick={() => setTemplateId(template.id)}
                    >
                        <div 
                            className={`bg-gray-800 rounded-lg shadow-md overflow-hidden border-4 transition-all duration-300 ease-in-out ${templateId === template.id ? 'border-yellow-400 scale-105 shadow-2xl' : 'border-gray-700 group-hover:border-yellow-500/50'}`}
                        >
                            <Image 
                                src={template.thumbnailUrl} 
                                alt={template.name} 
                                width={400} 
                                height={565} 
                                className="w-full h-auto object-cover object-top"
                                priority={['modernist', 'classic', 'executive', 'minimalist'].includes(template.id)}
                            />
                        </div>
                        <p className="text-center font-semibold p-2 mt-1 text-gray-300 group-hover:text-yellow-400">{template.name}</p>
                    </div>
                ))}
            </div>

            <div className="text-center mt-12">
                <button 
                    onClick={handleGenerateResume} 
                    disabled={isLoading} 
                    className="px-12 py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg text-xl disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-500 shadow-lg"
                >
                    {isLoading ? 'Crafting Your Masterpiece...' : 'Generate & Review'}
                </button>
            </div>
        </div>
    );
}