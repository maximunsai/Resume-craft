// src/app/(main)/interview/page.tsx - CORRECTED

'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useRouter } from 'next/navigation';

export default function InterviewLobbyPage() {
    const router = useRouter();

    // =================================================================
    // THE FIX IS HERE: We select the entire state object first,
    // then access the properties we need from it.
    // =================================================================
    const resumeState = useResumeStore();
    const name = resumeState.personal.name;
    const experience = resumeState.experience;
    const skills = resumeState.skills;

    // Check if there is enough data to start an interview.
    // We check if the first experience entry has a title, or if skills are present.
    const canStartInterview = name && (experience[0]?.title || skills);

    const handleStartInterview = () => {
        if (!canStartInterview) {
            alert("Please fill out your resume details first before starting an interview.");
            router.push('/builder');
            return;
        }
        // Navigate to the new text-based interview interface
        router.push('/interview/session');
    };

    return (
        <div className="max-w-4xl mx-auto p-8 text-center">
            <h1 className="text-4xl font-poppins font-bold text-white mb-4">AI Mock Interview</h1>
            <p className="text-lg text-gray-400 mb-8">
                Prepare for your next interview by practicing with our AI agent, which will use your resume data to ask relevant questions.
            </p>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
                <h2 className="text-xl font-bold text-white mb-2">Interview Based On:</h2>
                {/* Use the correctly accessed `name` variable */}
                <p className="text-yellow-400 font-semibold">{name || "Your Unsaved Resume"}</p>
                <p className="text-gray-400 text-sm mt-1">
                    {/* Use the correctly accessed `experience` and `skills` variables */}
                    {experience[0]?.title ? `Last role: ${experience[0].title}` : (skills ? `Skills: ${skills.substring(0, 50)}...` : "No data yet.")}
                </p>
            </div>

            <button 
                onClick={handleStartInterview}
                disabled={!canStartInterview}
                className="px-12 py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg text-xl disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-500 shadow-lg"
            >
                Start Mock Interview
            </button>
            
            {!canStartInterview && (
                <p className="mt-4 text-sm text-gray-500">
                    Your "Start" button is disabled. Please <a href="/builder" className="text-yellow-400 underline">fill out your resume</a> to begin.
                </p>
            )}
        </div>
    );
}