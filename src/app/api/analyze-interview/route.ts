// src/app/api/analyze-interview/route.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase/route-handler-client'; // <-- USE OUR NEW HELPER

export const dynamic = 'force-dynamic';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export async function POST(request: Request) {
    // Authenticate the user first
    const supabase = createRouteClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Now proceed with the analysis logic
    try {
        const { transcript } = await request.json();
        if (!transcript || transcript.length === 0) {
            return NextResponse.json({ error: "Transcript is empty." }, { status: 400 });
        }

        const prompt = `You are an expert career coach AI...`; // Your detailed prompt
        const result = await model.generateContent(prompt);
        const analysisText = result.response.text();

        if (!analysisText) {
            throw new Error("AI failed to generate analysis.");
        }

        return NextResponse.json({ overall_feedback: analysisText });

    } catch (error) {
        console.error("Error in analyze-interview API:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to generate analysis";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}