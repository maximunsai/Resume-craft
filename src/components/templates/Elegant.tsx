// src/components/templates/Elegant.tsx

import type { ResumeData } from '@/components/PDFDownloader';

export const Elegant = ({ data }: { data: ResumeData }) => (
    <div className="font-serif text-gray-700 p-8 bg-white">
        {/* Header */}
        <div className="text-center mb-10">
            <h1 className="text-5xl font-thin tracking-[0.2em] uppercase">{data.name}</h1>
            <p className="text-xs mt-3 text-gray-500">
                {data.phone}  ·  {data.email}  ·  {data.linkedin}
            </p>
        </div>

        {/* Summary */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
            <p className="text-base italic">{data.professionalSummary}</p>
        </div>
        
        {/* Horizontal Rule */}
        <div className="flex justify-center items-center my-8">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mx-1"></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mx-1"></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mx-1"></span>
        </div>

        {/* Experience */}
        <div className="mb-6">
            <h2 className="text-center text-lg font-bold tracking-widest uppercase mb-6">Experience</h2>
            {data.detailedExperience.map((exp) => (
                <div key={exp.id} className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">{exp.title}</h3>
                    <p className="text-sm font-sans italic text-gray-600 mb-2">{exp.company}</p>
                    <ul className="list-none font-sans text-sm space-y-1">
                        {exp.points.map((point, pIndex) => <li key={pIndex} className="pb-1">› {point}</li>)}
                    </ul>
                </div>
            ))}
        </div>

        {/* Skills as a footer */}
        <div className="mt-10 pt-4 border-t border-gray-200 text-center">
             <h2 className="text-center text-lg font-bold tracking-widest uppercase mb-2">Skills</h2>
            <p className="text-xs text-gray-500 font-sans">{data.technicalSkills.join(' | ')}</p>
        </div>
    </div>
);