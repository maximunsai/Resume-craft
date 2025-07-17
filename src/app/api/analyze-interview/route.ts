// src/app/api/analyze-interview/route.ts - FINAL ROBUST VERSION

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, BlockReason } from '@google/generative-ai';
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Initialize the client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Define safety settings to be less aggressive. We block only high-probability issues.
const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest", safetySettings });


export async function POST(request: Request) {
    try {
        // --- Authentication (this pattern is correct) ---
        const cookieStore = cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { get: (name) => cookieStore.get(name)?.value } }
        )
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }
        
        // --- Analysis Logic ---
        const { transcript } = await request.json();
        if (!transcript || transcript.length === 0) {
            return NextResponse.json({ error: "Transcript is empty." }, { status: 400 });
        }

        const prompt = `You are an expert career coach AI named "Forge." ...`; // Your detailed prompt

        const result = await model.generateContent(prompt);
        const response = result.response;

        // =================================================================
        // THE FIX IS HERE: Check for a blocked response BEFORE trying to get text.
        // =================================================================
        if (!response || !response.candidates || response.candidates.length === 0 || !response.candidates[0].content) {
            // Check if the block was due to safety reasons
            const blockReason = response?.promptFeedback?.blockReason;
            if (blockReason === BlockReason.SAFETY) {
                console.warn("Analysis blocked by safety settings for transcript.");
                throw new Error("The interview content was flagged by the safety filter. Please try again with different phrasing.");
            }
            // Otherwise, it's a generic failure
            throw new Error("The AI failed to generate a response. The response was empty.");
        }

        const analysisText = response.text();
        
        if (!analysisText || analysisText.trim().length < 10) {
            throw new Error("AI generated an empty or meaningless analysis.");
        }

        return NextResponse.json({ overall_feedback: analysisText });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to generate analysis";
        console.error("Error in analyze-interview API:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}