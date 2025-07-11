// src/components/templates/Corporate.tsx

import type { ResumeData } from '@/components/PDFDownloader';

export const Corporate = ({ data }: { data: ResumeData }) => (
    <div className="font-sans text-gray-900 p-1">
        {/* Header */}
        <div className="mb-6 pb-2 border-b-4 border-gray-700">
            <h1 className="text-4xl font-bold">{data.name}</h1>
            <p className="text-sm mt-1">
                {data.phone} | <a href={`mailto:${data.email}`} className="text-blue-700">{data.email}</a> | <a href={data.linkedin} className="text-blue-700">{data.linkedin}</a>
            </p>
        </div>

        {/* Summary */}
        <div className="mb-4">
            <h2 className="text-lg font-extrabold text-gray-700">PROFESSIONAL SUMMARY</h2>
            <hr className="border-t-2 border-gray-300 my-1"/>
            <p className="text-sm leading-normal">{data.professionalSummary}</p>
        </div>
        
        {/* Skills */}
        <div className="mb-4">
            <h2 className="text-lg font-extrabold text-gray-700">CORE SKILLS</h2>
            <hr className="border-t-2 border-gray-300 my-1"/>
            <p className="text-xs">{data.technicalSkills.join(' • ')}</p>
        </div>

        {/* Experience */}
        <div>
            <h2 className="text-lg font-extrabold text-gray-700">PROFESSIONAL EXPERIENCE</h2>
            <hr className="border-t-2 border-gray-300 my-1"/>
            {data.detailedExperience.map((exp) => (
                <div key={exp.id} className="mt-3">
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-base font-bold">{exp.title}</h3>
                        <p className="text-sm font-bold">{/* Placeholder for Dates */}</p>
                    </div>
                    <p className="text-sm italic">{exp.company}</p>
                    <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                        {exp.points.map((point, pIndex) => (
                            <li key={pIndex}>{point}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </div>
);