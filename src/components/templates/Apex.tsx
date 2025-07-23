// src/components/templates/Apex.tsx

// import type { ResumeData } from '@/components/PDFDownloader';
import type { ResumeData } from '@/types/resume';


export const Apex = ({ data }: { data: ResumeData }) => (
    <div className="font-sans text-gray-800 text-sm">
        {/* Header Block */}
        <div className="bg-slate-700 text-white p-8">
            <h1 className="text-5xl font-extrabold tracking-tight">{data.name}</h1>
            <p className="text-lg text-slate-300 mt-1">{/* Placeholder for Professional Title */}</p>
            <hr className="my-4 border-slate-500"/>
            <div className="flex justify-between text-xs">
                <span>{data.phone}</span>
                <span>{data.email}</span>
                <span>{data.linkedin}</span>
                <span>{data.github}</span>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="p-8">
            {/* Summary */}
            <div className="mb-6">
                <h2 className="text-base font-bold uppercase tracking-wider text-slate-500 mb-2">Executive Summary</h2>
                <p className="leading-relaxed">{data.professionalSummary}</p>
            </div>
            
            {/* Experience */}
            <div className="mb-6">
                <h2 className="text-base font-bold uppercase tracking-wider text-slate-500 mb-2">Professional Experience</h2>
                {data.detailedExperience.map((exp) => (
                    <div key={exp.id} className="mb-5">
                        <h3 className="text-lg font-bold">{exp.title}</h3>
                        <p className="text-md font-semibold text-slate-600 mb-1">{exp.company}</p>
                        <ul className="list-disc list-inside mt-1 space-y-1 text-gray-700">
                            {(exp.points || []).map((point, pIndex) => <li key={pIndex}>{point}</li>)}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Skills */}
            <div>
                <h2 className="text-base font-bold uppercase tracking-wider text-slate-500 mb-2">Technical Proficiencies</h2>
                 <p className="text-xs bg-slate-100 p-2 rounded">{data.technicalSkills.join(' | ')}</p>
            </div>
        </div>
    </div>
);