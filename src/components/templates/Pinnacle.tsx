// src/components/templates/Pinnacle.tsx

// import type { ResumeData } from '@/components/PDFDownloader';
import type { ResumeData } from '@/types/resume';


export const Pinnacle = ({ data }: { data: ResumeData }) => (
    <div className="font-sans text-sm text-gray-800 bg-white">
        {/* Header Section */}
        <div className="p-8 bg-gray-100 border-b-4 border-cyan-600">
            <h1 className="text-5xl font-bold text-gray-800">{data.name}</h1>
            <p className="text-lg text-cyan-700 font-semibold mt-1">Professional</p>
            <div className="flex space-x-6 mt-4 text-xs text-gray-600">
                <span>{data.phone}</span>
                <span>{data.email}</span>
                <span>{data.linkedin}</span>
                <span>{data.github}</span>
            </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
            <div className="grid grid-cols-3 gap-8">
                {/* Left Column (Summary & Skills) */}
                <div className="col-span-1">
                    <div className="mb-6">
                        <h2 className="font-bold text-cyan-800 uppercase tracking-wider mb-2">Summary</h2>
                        <p className="leading-relaxed">{data.professionalSummary}</p>
                    </div>
                    <div>
                        <h2 className="font-bold text-cyan-800 uppercase tracking-wider mb-2">Skills</h2>
                        <ul className="space-y-1">
                           {data.technicalSkills.map(skill => <li key={skill}>{skill}</li>)}
                        </ul>
                    </div>
                </div>

                {/* Right Column (Experience) */}
                <div className="col-span-2">
                    <h2 className="font-bold text-cyan-800 uppercase tracking-wider mb-2">Experience</h2>
                    {data.detailedExperience.map(exp => (
                        <div key={exp.id} className="mb-5">
                            <h3 className="text-lg font-semibold">{exp.title}</h3>
                            <p className="text-md italic text-gray-600 mb-1">{exp.company}</p>
                            <ul className="list-disc list-inside mt-1 space-y-1 text-gray-700">
                                {(exp.points || []).map((point, pIndex) => <li key={pIndex}>{point}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);