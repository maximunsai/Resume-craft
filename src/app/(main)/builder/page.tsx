'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useRouter } from 'next/navigation';

// Input field styles for dark mode
const inputStyles = "w-full p-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors";
const textAreaStyles = `${inputStyles} min-h-24`;

// --- PersonalForm Component with dark theme ---
const PersonalForm = () => {
    const { personal, setPersonal } = useResumeStore();
    return (
      <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Personal Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className={inputStyles} placeholder="Full Name" value={personal.name} onChange={e => setPersonal({ name: e.target.value })} />
            <input className={inputStyles} placeholder="Email" value={personal.email} onChange={e => setPersonal({ email: e.target.value })} />
            <input className={inputStyles} placeholder="Phone Number" value={personal.phone} onChange={e => setPersonal({ phone: e.target.value })} />
            <input className={inputStyles} placeholder="LinkedIn URL" value={personal.linkedin} onChange={e => setPersonal({ linkedin: e.target.value })} />
            <input className={`${inputStyles} md:col-span-2`} placeholder="GitHub URL" value={personal.github} onChange={e => setPersonal({ github: e.target.value })} />
        </div>
      </div>
    );
};

// --- ExperienceForm Component with dark theme ---
const ExperienceForm = () => {
    const { experience, addExperience, updateExperience, removeExperience } = useResumeStore();
    return (
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-white">Professional Experience</h2>
            <div className="space-y-6">
                {experience.map((exp) => (
                    <div key={exp.id} className="p-6 border border-gray-700 rounded-lg bg-gray-900 space-y-4">
                        <input className={inputStyles} placeholder="Job Title" value={exp.title} onChange={e => updateExperience(exp.id, 'title', e.target.value)} />
                        <input className={inputStyles} placeholder="Company Name" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} />
                        <div className="flex gap-4">
                           <input className={inputStyles} placeholder="Start Date (e.g., Jan 2020)" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} />
                           <input className={inputStyles} placeholder="End Date (e.g., Present)" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} />
                        </div>
                        <textarea className={textAreaStyles} placeholder="Describe your role, projects, and key achievements..." value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} />
                        {experience.length > 1 && <button onClick={() => removeExperience(exp.id)} className="text-red-500 hover:text-red-400 text-sm font-semibold">Remove Experience</button>}
                    </div>
                ))}
            </div>
            <button onClick={addExperience} className="w-full p-3 mt-6 bg-gray-700 text-gray-300 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
                + Add Another Experience
            </button>
        </div>
    );
};

// --- Main BuilderPage Component ---
export default function BuilderPage() {
    const router = useRouter();
    const { setFinalThoughts, setSkills } = useResumeStore.getState();

    const handleChooseTemplate = () => {
        router.push('/templates');
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-poppins font-bold text-white">Let's Forge Your Resume</h1>
                <p className="text-lg text-gray-400 mt-2">Provide your career raw materials. We'll handle the rest.</p>
            </div>
            <div className="space-y-8">
                <PersonalForm />
                <ExperienceForm />
                 <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                    <h2 className="text-2xl font-bold mb-6 text-white">Skills & Final Touches</h2>
                    <div className="space-y-4">
                        <textarea className={textAreaStyles} placeholder="List your technical skills, separated by commas (e.g., Python, React, AWS)" onChange={e => setSkills(e.target.value)} />
                        <textarea className={textAreaStyles} placeholder="Is there anything else important we should know? (e.g., key achievements, awards, career goals)" onChange={e => setFinalThoughts(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="text-center mt-12">
                <button 
                  onClick={handleChooseTemplate} 
                  className="px-12 py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg text-xl hover:bg-yellow-500 transition-colors shadow-lg"
                >
                    Next: Choose Template
                </button>
            </div>
        </div>
    );
}