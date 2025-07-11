// src/components/templates/Bold.tsx

import type { ResumeData } from '@/components/PDFDownloader';

export const Bold = ({ data }: { data: ResumeData }) => (
    <div className="flex font-sans">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gray-900 text-white p-6">
            <h1 className="text-4xl font-black uppercase mb-8">{data.name}</h1>
            
            <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">About Me</h2>
                <p className="text-xs leading-normal">{data.professionalSummary}</p>
            </div>
            
            <div className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Contact</h2>
                <p className="text-xs break-all">{data.phone}<br/>{data.email}<br/>{data.linkedin}</p>
            </div>
        </div>
        
        {/* Right Column */}
        <div className="w-2/3 p-6">
            <div className="mb-6">
                <h2 className="text-xl font-black uppercase text-gray-800">Experience</h2>
                {data.detailedExperience.map((exp) => (
                    <div key={exp.id} className="my-4 border-l-4 border-gray-800 pl-4">
                        <h3 className="text-lg font-bold">{exp.title}</h3>
                        <p className="text-md italic text-gray-600 mb-1">{exp.company}</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            {exp.points.map((point, pIndex) => <li key={pIndex}>{point}</li>)}
                        </ul>
                    </div>
                ))}
            </div>

            <div>
                <h2 className="text-xl font-black uppercase text-gray-800">Skills</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                    {data.technicalSkills.map(skill => (
                        <span key={skill} className="bg-gray-200 text-gray-800 text-xs font-semibold rounded px-2 py-1">{skill}</span>
                    ))}
                </div>
            </div>
        </div>
    </div>
);