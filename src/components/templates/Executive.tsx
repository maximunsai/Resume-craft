// src/components/templates/Executive.tsx

import type { ResumeData } from '@/components/PDFDownloader';

export const Executive = ({ data }: { data: ResumeData }) => (
    <div className="font-sans text-gray-800">
        {/* Header - A strong, centered block */}
        <div className="text-center p-4 bg-gray-800 text-white">
            <h1 className="text-4xl font-extrabold tracking-widest uppercase">{data.name}</h1>
            <p className="text-lg mt-1">{/* Placeholder for a professional title, e.g., Chief Technology Officer */}</p>
        </div>
        
        {/* Main Content - Two-column layout */}
        <div className="flex mt-8">
            
            {/* Left Column (Contact & Skills) */}
            <div className="w-1/3 pr-8 border-r-2 border-gray-200">
                <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-3">Contact</h2>
                    <p className="text-xs">{data.phone}</p>
                    <p className="text-xs">{data.email}</p>
                    <p className="text-xs">{data.linkedin}</p>
                    <p className="text-xs">{data.github}</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-3">Technical Skills</h2>
                    <ul className="text-xs space-y-1">
                        {data.technicalSkills.map(skill => <li key={skill}>{skill}</li>)}
                    </ul>
                </div>
            </div>

            {/* Right Column (Summary & Experience) */}
            <div className="w-2/3 pl-8">
                <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-3">Career Summary</h2>
                    <p className="text-sm">{data.professionalSummary}</p>
                </div>

                <div>
                    <h2 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-3">Professional Experience</h2>
                    {data.detailedExperience.map((exp) => (
                        <div key={exp.id} className="mb-5">
                            <h3 className="text-base font-bold text-gray-900">{exp.title}</h3>
                            <p className="text-sm font-semibold text-gray-700 mb-1">{exp.company}</p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                {exp.points.map((point, pIndex) => (
                                    <li key={pIndex}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);