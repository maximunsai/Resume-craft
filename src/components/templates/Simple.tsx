// src/components/templates/Simple.tsx

// import type { ResumeData } from '@/components/PDFDownloader';
import type { ResumeData } from '@/types/resume';


export const Simple = ({ data }: { data: ResumeData }) => (
    <div className="font-sans text-gray-800 text-sm p-1 max-w-4xl mx-auto">
        {/* Header - Just the name and contact info, clean and simple */}
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">{data.name}</h1>
            <p className="text-xs mt-2 text-gray-600">
                {data.phone} | {data.email} | {data.linkedin}
            </p>
        </div>

        {/* Sections are clearly separated by horizontal rules */}
        <div className="mb-6">
            <h2 className="text-base font-bold uppercase tracking-wider text-gray-600">Summary</h2>
            <hr className="my-1 border-gray-300"/>
            <p className="text-sm leading-relaxed">{data.professionalSummary}</p>
        </div>
        
        <div className="mb-6">
            <h2 className="text-base font-bold uppercase tracking-wider text-gray-600">Skills</h2>
            <hr className="my-1 border-gray-300"/>
            <p className="text-sm">{data.technicalSkills.join(' | ')}</p>
        </div>

        <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-gray-600">Experience</h2>
            <hr className="my-1 border-gray-300"/>
            {data.detailedExperience.map((exp) => (
                <div key={exp.id} className="my-4">
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-lg font-semibold">{exp.title}</h3>
                        <p className="text-sm text-gray-500">{/* Dates Placeholder */}</p>
                    </div>
                    <p className="text-md italic text-gray-700">{exp.company}</p>
                    <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        {(exp.points || []).map((point, pIndex) => (
                            <li key={pIndex}>{point}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </div>
);