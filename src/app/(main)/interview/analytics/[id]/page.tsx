// src/app/(main)/interview/analytics/[id]/page.tsx - CORRECTED IMPORT

import { createClient } from '@/lib/supabase/server'; // THE FIX IS HERE
import { notFound } from 'next/navigation';
import { Bot, User } from 'lucide-react';

export default async function AnalyticsPage({ params }: { params: { id: string } }) {
    // We now use the correctly named createClient function
    const supabase = createClient();
    
    const { data: interview, error } = await supabase
        .from('interviews')
        .select('transcript, overall_feedback') // Select only the columns we need
        .eq('id', params.id)
        .single();

    if (error || !interview) {
        console.error("Error fetching interview analysis:", error);
        notFound();
    }
    
    // Type assertion to help TypeScript understand the structure of our transcript
    const transcript = (interview.transcript as any[] || []);

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-4xl font-poppins font-bold text-white mb-2">Interview Analysis</h1>
            <p className="text-gray-400 mb-8">Here's a breakdown of your performance from the forge.</p>

            {/* Overall Feedback Section */}
            <div className="bg-gray-800 p-6 rounded-xl border border-yellow-400/50 mb-8">
                <h2 className="text-xl font-bold text-yellow-400 mb-3">AI Coach's Overall Feedback</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{interview.overall_feedback}</p>
            </div>
            
            {/* Transcript Section */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-6">Full Interview Transcript</h2>
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                    {transcript.map((msg: { sender: string, text: string }, index: number) => (
                         <div key={index} className="flex items-start gap-3" style={{flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'}}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'AI' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-gray-600 text-white'}`}>
                                {msg.sender === 'AI' ? <Bot size={18}/> : <User size={18}/>}
                            </div>
                            <div className={`max-w-lg p-3 rounded-lg ${msg.sender === 'AI' ? 'bg-gray-700 text-gray-200' : 'bg-blue-600 text-white'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}