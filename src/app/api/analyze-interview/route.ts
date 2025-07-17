// src/app/api/analyze-interview/route.ts - THE ROBUST VERSION

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// Use a powerful model capable of nuanced analysis
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export async function POST(request: Request) {
    try {
        const { transcript } = await request.json();

        // Check if the transcript is empty or invalid
        if (!transcript || transcript.length === 0) {
            return NextResponse.json({ error: "Transcript is empty or invalid." }, { status: 400 });
        }

        // A more detailed and explicit prompt for the final analysis
        const prompt = `
        You are an expert career coach AI named "Forge." Your task is to provide a final, overall performance analysis for a user based on the provided mock interview transcript.

        **YOUR STRICT RULES:**
        1.  **BE CONSTRUCTIVE:** Start with a positive reinforcement, then identify 1-2 key areas for improvement.
        2.  **BE ACTIONABLE:** The feedback must be practical. Instead of saying "be more confident," say "To project more confidence, try structuring your answers using the STAR method to clearly showcase your achievements."
        3.  **BE CONCISE:** The entire analysis should be a single paragraph of 3-5 sentences.
        4.  **PLAIN TEXT ONLY:** Your response must be only the analysis text. Do not include any headers, markdown, or conversational filler like "Here is your analysis:".

        ---
        **INTERVIEW TRANSCRIPT TO ANALYZE:**
        ${transcript.map((msg: {sender: string, text: string}) => `${msg.sender}: ${msg.text}`).join('\n')}
        ---
        
        **YOUR CONCISE ANALYSIS:**`;

        const result = await model.generateContent(prompt);
        const analysisText = result.response.text();

        // Check if the AI returned a meaningful response
        if (!analysisText || analysisText.trim().length < 10) {
            throw new Error("AI failed to generate a meaningful analysis.");
        }

        return NextResponse.json({ overall_feedback: analysisText });

    } catch (error) {
        console.error("Error in analyze-interview API:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to generate analysis";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}