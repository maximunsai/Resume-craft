// src/components/templates/Creative.tsx

// import type { ResumeData } from '@/components/PDFDownloader';
import type { ResumeData } from '@/types/resume';


// A simple map for potential icons. In a real app, you'd use an icon library.
const skillIcons = {
    'JavaScript': 'JS', 'React': '⚛️', 'Node.js': '🚀', 'AWS': '☁️', 'Python': '🐍', 'TypeScript': 'TS', 'Next.js': '▶️' 
};

export const Creative = ({ data }: { data: ResumeData }) => (
    <div className="font-sans flex">
        {/* Left Sidebar with a color accent */}
        <div className="w-1/3 bg-teal-600 text-white p-8">
            <div className="text-center mb-12">
                {/* Placeholder for a circular profile picture */}
                <div className="w-32 h-32 bg-teal-400 rounded-full mx-auto mb-4 border-4 border-white"></div>
                <h1 className="text-3xl font-bold">{data.name}</h1>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-semibold uppercase tracking-wider mb-3 border-b-2 border-teal-400 pb-1">Contact</h2>
                <p className="text-sm leading-relaxed">{data.phone}<br/>{data.email}<br/>{data.linkedin}</p>
            </div>

            <div>
                <h2 className="text-lg font-semibold uppercase tracking-wider mb-3 border-b-2 border-teal-400 pb-1">Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {data.technicalSkills.map(skill => (
                        <span key={skill} className="bg-teal-500 text-xs font-semibold rounded-full px-3 py-1">
                            {/* @ts-ignore */}
                            {skillIcons[skill] || ''} {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Main Content */}
        <div className="w-2/3 p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-teal-700 mb-4">Profile</h2>
                <p className="text-gray-700 leading-relaxed">{data.professionalSummary}</p>
            </div>
            
            <div>
                <h2 className="text-2xl font-bold text-teal-700 mb-4">Experience</h2>
                {data.detailedExperience.map((exp) => (
                    <div key={exp.id} className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">{exp.title}</h3>
                        <p className="text-md italic text-gray-600 mb-2">{exp.company}</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {(exp.points || []).map((point, pIndex) => (
                                <li key={pIndex}>{point}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    </div>
);