// src/app/(main)/builder/page.tsx - CORRECTED VERSION

'use client';
import { useResumeStore } from '@/store/resumeStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// --- The form components (PersonalForm, ExperienceForm) are correct. ---
// --- You can keep them exactly as they are. Here's a reminder of one: ---
const PersonalForm = () => {
    const { personal, setPersonal } = useResumeStore();
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4 text-[#0A2647]">Personal Details</h2>
        <input className="w-full p-2 border rounded mb-2" placeholder="Full Name" value={personal.name} onChange={e => setPersonal({ name: e.target.value })} />
        <input className="w-full p-2 border rounded mb-2" placeholder="Email" value={personal.email} onChange={e => setPersonal({ email: e.target.value })} />
        <input className="w-full p-2 border rounded mb-2" placeholder="Phone" value={personal.phone} onChange={e => setPersonal({ phone: e.target.value })} />
        <input className="w-full p-2 border rounded mb-2" placeholder="LinkedIn URL" value={personal.linkedin} onChange={e => setPersonal({ linkedin: e.target.value })} />
        <input className="w-full p-2 border rounded mb-2" placeholder="GitHub URL" value={personal.github} onChange={e => setPersonal({ github: e.target.value })} />
      </div>
    );
};

const ExperienceForm = () => {
    const { experience, addExperience, updateExperience, removeExperience } = useResumeStore();
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-[#0A2647]">Professional Experience</h2>
            {experience.map((exp) => (
                <div key={exp.id} className="p-4 border rounded mb-4 bg-white">
                    <input className="w-full p-2 border rounded mb-2" placeholder="Job Title" value={exp.title} onChange={e => updateExperience(exp.id, 'title', e.target.value)} />
                    <input className="w-full p-2 border rounded mb-2" placeholder="Company" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} />
                    {/* Add date pickers here in the future */}
                    <textarea className="w-full p-2 border rounded mb-2" placeholder="Describe your role, projects, and tasks..." value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} />
                    {experience.length > 1 && <button onClick={() => removeExperience(exp.id)} className="text-red-500">Remove</button>}
                </div>
            ))}
            <button onClick={addExperience} className="w-full p-2 bg-[#2C74B3] text-white rounded mt-2">Add Another Experience</button>
        </div>
    );
};


export default function BuilderPage() {
    const router = useRouter();

    // ================================================================
    // THE FIX IS HERE: This function now ONLY handles navigation.
    // ================================================================
    const handleChooseTemplate = () => {
        // You could add validation here if needed, e.g., check if name is filled out.
        router.push('/templates'); // Navigate to the template selection page
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-[#F8F7F4]">
            <h1 className="text-4xl font-bold text-center mb-8 text-[#0A2647]">Build Your Resume</h1>
            <div className="space-y-8">
                <PersonalForm />
                <ExperienceForm />
                {/* Your other form components like Skills go here */}
                 <div>
                    <h2 className="text-2xl font-bold mb-4 text-[#0A2647]">Anything Else?</h2>
                    <textarea 
                        className="w-full p-2 border rounded" 
                        placeholder="Key achievements, awards, career goals..." 
                        onChange={e => useResumeStore.getState().setFinalThoughts(e.target.value)} 
                    />
                </div>
            </div>
            <div className="text-center mt-8">
                {/* The button now calls the correct navigation function */}
                <button 
                  onClick={handleChooseTemplate} 
                  className="px-8 py-4 bg-[#205295] text-white font-bold rounded-lg text-xl hover:bg-[#143F6B] transition-colors"
                >
                    Next: Choose Template
                </button>
            </div>
        </div>
    );
}