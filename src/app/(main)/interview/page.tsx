'use client';

import { useRouter } from 'next/navigation';
import { useResumeStore } from '@/store/resumeStore';
import { useInterviewStore, InterviewStage } from '@/store/interviewStore';
import { User, Cpu, BarChart3 } from 'lucide-react'; // Icons for our selection cards

export default function InterviewLobbyPage() {
    const router = useRouter();
    const { personal, experience } = useResumeStore();
    const { setStage, clearInterview } = useInterviewStore();

    const canStartInterview = personal.name && experience[0]?.title;

    const handleSelectInterviewType = (stage: InterviewStage) => {
        if (!canStartInterview) {
            alert("Please ensure your name and at least one experience entry are filled out in the Resume Builder before starting.");
            router.push('/builder');
            return;
        }
        
        // Clear any previous interview data for a fresh start
        clearInterview();
        
        // Set the chosen stage in our global store
        setStage(stage);
        
        // Navigate directly to the session page to begin the interview
        router.push('/interview/session');
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-poppins font-bold text-white mb-2">AI Mock Interview</h1>
                <p className="text-lg text-gray-400">Select the type of interview you want to practice for.</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8 text-center">
                <h2 className="text-lg font-bold text-white">Interview will be based on your resume for:</h2>
                <p className="text-yellow-400 font-semibold mt-1">{personal.name || "..."}</p>
                <p className="text-gray-400 text-sm">{experience[0]?.title ? `Role: ${experience[0].title}` : "No primary role specified"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Behavioral Card */}
                <button
                    onClick={() => handleSelectInterviewType('Behavioral')}
                    disabled={!canStartInterview}
                    className="group bg-gray-800 p-6 rounded-xl border border-gray-700 text-left hover:border-blue-500 hover:bg-gray-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <User className="w-10 h-10 text-blue-400 mb-3" />
                    <h3 className="text-xl font-bold text-white mb-2">Behavioral</h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300">Practice answering questions about teamwork, leadership, and past experiences using the STAR method.</p>
                </button>

                {/* Technical Card */}
                <button
                    onClick={() => handleSelectInterviewType('Technical')}
                    disabled={!canStartInterview}
                    className="group bg-gray-800 p-6 rounded-xl border border-gray-700 text-left hover:border-green-500 hover:bg-gray-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Cpu className="w-10 h-10 text-green-400 mb-3" />
                    <h3 className="text-xl font-bold text-white mb-2">Technical</h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300">Face resume-specific technical questions, code challenges, and system design scenarios relevant to your field.</p>
                </button>

                {/* HR & Situational Card */}
                <button
                    onClick={() => handleSelectInterviewType('Situational')}
                    disabled={!canStartInterview}
                    className="group bg-gray-800 p-6 rounded-xl border border-gray-700 text-left hover:border-pink-500 hover:bg-gray-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <BarChart3 className="w-10 h-10 text-pink-400 mb-3" />
                    <h3 className="text-xl font-bold text-white mb-2">HR & Situational</h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300">Prepare for questions about salary expectations, team conflicts, career goals, and why you are the right fit.</p>
                </button>
            </div>
        </div>
    );
}