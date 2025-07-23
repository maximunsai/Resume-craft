// src/components/templates/Onyx.tsx

// import type { ResumeData } from '@/components/PDFDownloader';
import type { ResumeData } from '@/types/resume';


export const Onyx = ({ data }: { data: ResumeData }) => (
    <div className="font-sans text-white bg-gray-900 p-8">
        {/* Header */}
        <div className="text-center mb-8 border-b border-yellow-400 pb-4">
            <h1 className="text-5xl font-extrabold text-white">{data.name}</h1>
            <p className="text-lg mt-2 text-yellow-400">{/* Professional Title */}</p>
        </div>

        {/* Two-column Layout */}
        <div className="grid grid-cols-3 gap-8">
            {/* Left Column (Contact & Skills) */}
            <div className="col-span-1">
                <div className="mb-6">
                    <h2 className="text-yellow-400 font-bold uppercase tracking-wider mb-2">Contact</h2>
                    <p className="text-sm text-gray-300">{data.phone}<br/>{data.email}<br/>{data.linkedin}</p>
                </div>
                <div>
                    <h2 className="text-yellow-400 font-bold uppercase tracking-wider mb-2">Expertise</h2>
                     <div className="flex flex-wrap gap-2 mt-2">
                        {data.technicalSkills.map(skill => (
                            <span key={skill} className="bg-gray-700 text-yellow-300 text-xs font-semibold rounded px-2 py-1">{skill}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column (Summary & Experience) */}
            <div className="col-span-2">
                <div className="mb-6">
                    <h2 className="text-yellow-400 font-bold uppercase tracking-wider mb-2">Summary</h2>
                    <p className="text-gray-300 leading-relaxed">{data.professionalSummary}</p>
                </div>
                <div>
                    <h2 className="text-yellow-400 font-bold uppercase tracking-wider mb-2">Experience</h2>
                     {data.detailedExperience.map(exp => (
                        <div key={exp.id} className="mb-5">
                            <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                            <p className="text-md italic text-gray-400 mb-1">{exp.company}</p>
                            <ul className="list-disc list-inside mt-1 text-gray-300 space-y-1">
                                {(exp.points || []).map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);