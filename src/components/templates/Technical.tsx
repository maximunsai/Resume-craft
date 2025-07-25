// src/components/templates/Technical.tsx

// import type { ResumeData } from '@/components/PDFDownloader';
import type { ResumeData } from '@/types/resume';


export const Technical = ({ data }: { data: ResumeData }) => (
    <div className="font-sans text-gray-800 text-sm bg-gray-50 p-10">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b-2 border-gray-300">
            <div>
                <h1 className="text-4xl font-bold">{data.name}</h1>
                <p className="text-lg text-blue-600 font-semibold">{/* Placeholder for Main Title, e.g. "Lead DevOps Engineer" */}</p>
            </div>
            <div className="text-right text-xs">
                <p>{data.phone}</p>
                <p>{data.email}</p>
                <p>{data.linkedin}</p>
                <p>{data.github}</p>
            </div>
        </div>

        {/* Main Content */}
        <div className="mt-6">
            <div className="mb-6">
                <h2 className="text-sm font-bold uppercase text-gray-500 tracking-widest mb-2">// SUMMARY</h2>
                <p className="text-base">{data.professionalSummary}</p>
            </div>
            
            <div className="mb-6">
                <h2 className="text-sm font-bold uppercase text-gray-500 tracking-widest mb-3">// TECHNICAL_SKILLS</h2>
                <div className="font-mono bg-gray-100 p-3 rounded-md text-xs text-green-700">
                    {data.technicalSkills.join(' | ')}
                </div>
            </div>
            
            <div>
                <h2 className="text-sm font-bold uppercase text-gray-500 tracking-widest mb-3">// PROFESSIONAL_EXPERIENCE</h2>
                {data.detailedExperience.map((exp) => (
                    <div key={exp.id} className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                        <p className="text-md font-semibold text-gray-700 mb-2">{exp.company}</p>
                        <ul className="space-y-1">
                            {(exp.points || []).map((point, pIndex) => (
                                <li key={pIndex} className="flex">
                                    <span className="mr-2 text-blue-600 font-bold">{'>'}</span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    </div>
);