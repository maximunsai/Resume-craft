// src/components/templates/Classic.tsx

// import type { ResumeData } from '@/components/PDFDownloader'; // We reuse the same data structure
import type { ResumeData } from '@/types/resume';


export const Classic = ({ data }: { data: ResumeData }) => (
    // We introduce a serif font for a more traditional feel.
    // The "font-serif" class from Tailwind will apply a font like Times New Roman or Georgia.
    <div className="font-serif text-gray-800 text-sm leading-relaxed">
        
        {/* Header Section */}
        {/* The key difference: a centered header for a classic, formal look. */}
        <div className="text-center mb-8 pb-4 border-b border-gray-400">
            <h1 className="text-4xl font-bold text-gray-900">{data.name}</h1>
            <p className="text-xs mt-2 text-gray-600 font-sans">
                {/* We switch back to sans-serif for the contact info for readability */}
                {data.email} | {data.phone} | {data.linkedin} | {data.github}
            </p>
        </div>

        {/* Professional Summary */}
        <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Summary</h2>
            {/* Using a subtle left border to delineate sections */}
            <p className="text-gray-700 font-sans border-l-2 border-gray-200 pl-4">{data.professionalSummary}</p>
        </div>

        {/* Technical Skills */}
        <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Core Competencies</h2>
            <p className="text-gray-700 font-sans border-l-2 border-gray-200 pl-4">{data.technicalSkills.join(' / ')}</p>
        </div>

        {/* Professional Experience */}
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Professional Experience</h2>
            {data.detailedExperience.map((exp) => (
                <div key={exp.id} className="mb-5">
                    {/* The job title is prominent and bold. */}
                    <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                    {/* The company name is less emphasized but still clear. */}
                    <p className="text-base italic text-gray-600 mb-2">{exp.company}</p>
                    {/* Bullet points are standard but use a sans-serif font for readability of long text. */}
                    <ul className="list-disc list-inside space-y-1 font-sans">
                        {(exp.points || []).map((point, pIndex) => (
                            <li key={pIndex} className="text-gray-700">{point}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </div>
);