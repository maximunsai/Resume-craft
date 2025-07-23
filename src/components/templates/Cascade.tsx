// src/components/templates/Cascade.tsx

// import type { ResumeData } from '@/components/PDFDownloader';
import type { ResumeData } from '@/types/resume';


export const Cascade = ({ data }: { data: ResumeData }) => (
    <div className="font-serif max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="text-center py-4">
            <h1 className="text-3xl font-bold">{data.name}</h1>
            <p className="text-sm mt-1">{data.email} | {data.phone} | {data.linkedin}</p>
        </div>
        
        {/* Each section is a self-contained block */}
        <div className="py-4 border-t-2 border-gray-200">
            <h2 className="text-lg font-semibold uppercase tracking-wider">Summary</h2>
            <p className="mt-2 text-sm leading-relaxed">{data.professionalSummary}</p>
        </div>

        <div className="py-4 border-t-2 border-gray-200">
            <h2 className="text-lg font-semibold uppercase tracking-wider">Experience</h2>
            {data.detailedExperience.map((exp) => (
                <div key={exp.id} className="mt-3">
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-base font-bold">{exp.title}</h3>
                        <p className="text-sm text-gray-500">{exp.company}</p>
                    </div>
                    <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                        {(exp.points || []).map((point, pIndex) => <li key={pIndex}>{point}</li>)}
                    </ul>
                </div>
            ))}
        </div>

        <div className="py-4 border-t-2 border-gray-200">
            <h2 className="text-lg font-semibold uppercase tracking-wider">Skills</h2>
            <p className="mt-2 text-sm">{data.technicalSkills.join(' • ')}</p>
        </div>
    </div>
);