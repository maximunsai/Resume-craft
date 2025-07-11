// src/components/templates/Cosmopolitan.tsx

import type { ResumeData } from '@/components/PDFDownloader';

export const Cosmopolitan = ({ data }: { data: ResumeData }) => (
    <div className="flex font-sans text-sm">
        {/* Vertical Name Banner */}
        <div className="w-16 bg-gray-800 flex items-center justify-center">
            <h1 className="text-white font-extrabold text-5xl uppercase tracking-[0.3em]" style={{ writingMode: 'vertical-rl' }}>{data.name}</h1>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
            <div className="mb-6">
                <h2 className="text-xl font-bold uppercase tracking-widest text-gray-500">Profile</h2>
                <p className="mt-2 text-gray-700">{data.professionalSummary}</p>
            </div>
            
            <div className="mb-6">
                <h2 className="text-xl font-bold uppercase tracking-widest text-gray-500">Experience</h2>
                {data.detailedExperience.map(exp => (
                    <div key={exp.id} className="mt-3">
                        <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                        <p className="text-md italic text-gray-600">{exp.company}</p>
                        <ul className="list-disc list-inside mt-1 text-gray-700 space-y-1">
                            {exp.points.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-bold uppercase tracking-widest text-gray-500">Skills</h2>
                    <p className="mt-2 text-xs">{data.technicalSkills.join(', ')}</p>
                </div>
                <div>
                    <h2 className="text-xl font-bold uppercase tracking-widest text-gray-500">Contact</h2>
                    <p className="mt-2 text-xs">{data.email}<br/>{data.phone}<br/>{data.linkedin}</p>
                </div>
            </div>
        </div>
    </div>
);