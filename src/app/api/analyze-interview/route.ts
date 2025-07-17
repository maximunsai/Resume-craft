// src/app/api/analyze-interview/route.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function POST(request: Request) {
    const { transcript } = await request.json();

    const prompt = `
    You are an expert career coach AI. Analyze the following mock interview transcript. 
    Provide a concise, overall performance analysis in 3-4 constructive sentences.
    Focus on strengths, areas for improvement, and one key takeaway for the user.
    Do not add any conversational filler. Just provide the analysis as plain text.

    TRANSCRIPT:
    ${transcript.map((msg: {sender: string, text: string}) => `${msg.sender}: ${msg.text}`).join('\n')}
    ---
    ANALYSIS:`;

    try {
        const result = await model.generateContent(prompt);
        const analysisText = result.response.text();
        return NextResponse.json({ overall_feedback: analysisText });
    } catch (error) {
        console.error("Error analyzing interview:", error);
        return NextResponse.json({ error: "Failed to generate analysis" }, { status: 500 });
    }
}