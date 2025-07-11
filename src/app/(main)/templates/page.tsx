// src/app/(main)/templates/page.tsx

'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

// =================================================================
// EXPANDED TEMPLATE LIST
// We are "stubbing" these out. You will need to create the corresponding
// .png files in your `/public/thumbnails/` folder.
// For now, you can just copy `modernist.png` and rename it for all of them as placeholders.
// =================================================================
const templates = [
    { id: 'modernist', name: 'Modernist', thumbnailUrl: '/thumbnails/modernist.png' },
    { id: 'classic', name: 'Classic', thumbnailUrl: '/thumbnails/classic.png' },
    { id: 'executive', name: 'Executive', thumbnailUrl: '/thumbnails/executive.png' },
    { id: 'minimalist', name: 'Minimalist', thumbnailUrl: '/thumbnails/minimalist.png' },
    { id: 'creative', name: 'Creative', thumbnailUrl: '/thumbnails/creative.png' },
    { id: 'academic', name: 'Academic', thumbnailUrl: '/thumbnails/academic.png' },
    { id: 'technical', name: 'Technical', thumbnailUrl: '/thumbnails/technical.png' },
    { id: 'corporate', name: 'Corporate', thumbnailUrl: '/thumbnails/corporate.png' },
    { id: 'onyx', name: 'Onyx', thumbnailUrl: '/thumbnails/onyx.png' },
    { id: 'harvard', name: 'Harvard', thumbnailUrl: '/thumbnails/harvard.png' },
    { id: 'stanford', name: 'Stanford', thumbnailUrl: '/thumbnails/stanford.png' },
    { id: 'aether', name: 'Aether', thumbnailUrl: '/thumbnails/aether.png' },
    { id: 'simple', name: 'Simple', thumbnailUrl: '/thumbnails/simple.png' },
    { id: 'bold', name: 'Bold', thumbnailUrl: '/thumbnails/bold.png' },
    { id: 'elegant', name: 'Elegant', thumbnailUrl: '/thumbnails/elegant.png' },
    { id: 'apex', name: 'Apex', thumbnailUrl: '/thumbnails/apex.png' },
    { id: 'cosmopolitan', name: 'Cosmopolitan', thumbnailUrl: '/thumbnails/cosmopolitan.png' },
    { id: 'pinnacle', name: 'Pinnacle', thumbnailUrl: '/thumbnails/pinnacle.png' },
    { id: 'cascade', name: 'Cascade', thumbnailUrl: '/thumbnails/cascade.png' },
    { id: 'metro', name: 'Metro', thumbnailUrl: '/thumbnails/metro.png' },
];

export default function TemplateSelectionPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    // We get the selected templateId and the setter function from our state store
    const { templateId, setTemplateId, setAiGenerated, ...resumeData } = useResumeStore();

    const handleGenerateResume = async () => {
        // ================================================================
        // THE FIX FOR PROBLEM 1 IS HERE
        // ================================================================
        // Define an array of templates that are actually ready for generation.
        const availableTemplates = ['modernist', 'classic', 'minimalist', 'executive', 'creative', 'technical'];

        // Check if the selected template is in our list of available ones.
        if (!availableTemplates.includes(templateId)) {
            alert(`Sorry, the "${templateId}" template is not yet available for generation. Please select one of the following: ${availableTemplates.join(', ')}.`);
            return; // Stop the function if the template isn't ready.
        }
        // ================================================================

        setIsLoading(true);
        // Clear any old AI data - removing the null assignment that causes type errors
        // The new AI data will overwrite the old data anyway

        try {
            const response = await fetch('/api/generate-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resumeData),
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

    return (
        <div className="max-w-6xl mx-auto p-8 bg-white">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800">Choose Your Template</h1>
                <p className="text-lg text-gray-500 mt-2">Select a professionally designed format. Click to preview, then generate.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {templates.map((template) => (
                    <div 
                        key={template.id} 
                        className="group cursor-pointer"
                        onClick={() => setTemplateId(template.id)}
                    >
                        <div 
                            className={`bg-white rounded-lg shadow-md overflow-hidden border-4 transition-all duration-300 ease-in-out ${templateId === template.id ? 'border-blue-600 scale-105 shadow-2xl' : 'border-transparent group-hover:border-blue-300 group-hover:shadow-xl'}`}
                        >
                            {/* The Image component with proper styling */}
                            <Image 
                                src={template.thumbnailUrl} 
                                alt={template.name} 
                                width={400} 
                                height={565} 
                                className="w-full h-auto object-cover object-top"
                            />
                        </div>
                        <p className="text-center font-semibold p-2 mt-1 text-gray-700">{template.name}</p>
                    </div>
                ))}
            </div>

            <div className="text-center mt-12">
                <button 
                    onClick={handleGenerateResume} 
                    disabled={isLoading} 
                    className="px-12 py-4 bg-green-600 text-white font-bold rounded-lg text-xl disabled:bg-gray-400 hover:bg-green-700 shadow-lg"
                >
                    {isLoading ? 'Crafting Your Masterpiece...' : 'Generate & Review'}
                </button>
            </div>
        </div>
    );
}