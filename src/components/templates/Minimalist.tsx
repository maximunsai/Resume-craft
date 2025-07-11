// src/components/templates/Minimalist.tsx

import type { ResumeData } from '@/components/PDFDownloader';

// VERIFY THIS LINE: The component is named "Minimalist" (capital M) and is exported.
export const Minimalist = ({ data }: { data: ResumeData }) => (
    <div className="font-sans text-gray-700 text-sm leading-normal">
        
        <div className="mb-10">
            <h1 className="text-5xl font-light tracking-tighter">{data.name}</h1>
            <p className="text-xs mt-3 text-gray-500 tracking-widest uppercase">
                {data.email} // {data.phone} // {data.linkedin}
            </p>
        </div>

        <div className="mb-8">
            <p className="text-base">{data.professionalSummary}</p>
        </div>

        <div className="grid grid-cols-3 gap-12">
            <div className="col-span-2">
                <h2 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-4">Experience</h2>
                {data.detailedExperience.map((exp) => (
                    <div key={exp.id} className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">{exp.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{exp.company}</p>
                        <ul className="space-y-1">
                            {exp.points.map((point, pIndex) => (
                                <li key={pIndex} className="flex">
                                    <span className="mr-2 text-gray-400">–</span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            
            <div>
                <h2 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-4">Skills</h2>
                <ul className="space-y-1 text-sm">
                    {data.technicalSkills.map(skill => <li key={skill}>{skill}</li>)}
                </ul>
            </div>
        </div>
    </div>
);