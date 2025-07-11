// src/components/templates/Metro.tsx

import type { ResumeData } from '@/components/PDFDownloader';

export const Metro = ({ data }: { data: ResumeData }) => (
    <div className="font-sans text-sm p-8 bg-gray-50">
        <div className="grid grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="col-span-1">
                <h1 className="text-3xl font-bold text-blue-800">{data.name}</h1>
                <p className="mt-4 text-gray-600">{data.professionalSummary}</p>
                <div className="mt-6">
                    <h3 className="text-sm font-bold text-blue-800 uppercase mb-2">Contact</h3>
                    <p className="text-xs">{data.phone}</p>
                    <p className="text-xs">{data.email}</p>
                    <p className="text-xs">{data.linkedin}</p>
                </div>
            </div>

            {/* Right Main Content */}
            <div className="col-span-2">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-700 mb-3">Work Experience</h2>
                    {data.detailedExperience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <h3 className="text-base font-semibold">{exp.title}</h3>
                            <p className="text-sm text-gray-500">{exp.company}</p>
                            <ul className="list-disc list-inside mt-1 text-gray-600 text-xs">
                                {exp.points.map((point, i) => <li key={i}>{point}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-700 mb-3">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {data.technicalSkills.map(skill => (
                           <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);