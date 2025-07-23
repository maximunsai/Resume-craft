// src/components/templates/Academic.tsx

// import type { ResumeData } from '@/components/PDFDownloader';
import type { ResumeData } from '@/types/resume';


export const Academic = ({ data }: { data: ResumeData }) => (
    // Uses a classic serif font for a scholarly feel
    <div className="font-serif text-gray-800 text-sm p-2">
        {/* Header - Formal and centered */}
        <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">{data.name}</h1>
            <p className="text-xs mt-2 font-sans">
                {data.email} │ {data.phone} │ {data.linkedin}
            </p>
        </div>

        {/* This template would ideally have sections for Education and Publications.
            We'll use the existing data structure for now. */}
        
        <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">Abstract</h2>
            <p className="font-sans text-sm leading-relaxed">{data.professionalSummary}</p>
        </div>
        
        <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">Research & Professional Experience</h2>
            {data.detailedExperience.map((exp) => (
                <div key={exp.id} className="mb-4">
                    <h3 className="text-base font-bold">{exp.title}</h3>
                    <p className="text-sm italic text-gray-700 mb-1">{exp.company}</p>
                    <ul className="list-none space-y-1 pl-4 font-sans">
                        {(exp.points || []).map((point, pIndex) => (
                            <li key={pIndex} className="flex">
                                <span className="mr-2">■</span>
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>

        <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">Technical Proficiencies</h2>
            <p className="font-sans text-xs">{data.technicalSkills.join(', ')}</p>
        </div>
    </div>
);