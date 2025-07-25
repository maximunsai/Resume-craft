// src/components/templates/Modernist.tsx - POLISHED VERSION

// import type { ResumeData } from '@/components/PDFDownloader'; // Use our shared type
import type { ResumeData } from '@/types/resume';


export const Modernist = ({ data }: { data: ResumeData }) => (
    <div className="font-sans text-gray-800 text-sm leading-relaxed">
        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-wider uppercase text-gray-900">{data.name}</h1>
            <p className="text-xs mt-2 text-gray-600">
                {data.email} • {data.phone} • {data.linkedin} • {data.github}
            </p>
        </div>

        {/* Professional Summary */}
        <div className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b-2 border-gray-300 pb-1 mb-2">Professional Summary</h2>
            <p className="text-gray-700">{data.professionalSummary}</p>
        </div>

        {/* Technical Skills */}
        <div className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b-2 border-gray-300 pb-1 mb-2">Technical Skills</h2>
            <p className="text-gray-700">{data.technicalSkills.join(' • ')}</p>
        </div>

        {/* Professional Experience */}
        <div>
            <h2 className="text-lg font-bold uppercase border-b-2 border-gray-300 pb-1 mb-2">Professional Experience</h2>
            {data.detailedExperience.map((exp) => (
                <div key={exp.id} className="mb-4">
                    <h3 className="text-base font-bold text-gray-900">{exp.title}</h3>
                    <p className="text-sm italic text-gray-600 mb-1">{exp.company}</p>
                    <ul className="list-disc list-inside space-y-1">
                        {(exp.points || []).map((point, pIndex) => (
                            <li key={pIndex} className="text-gray-700">{point}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </div>
);