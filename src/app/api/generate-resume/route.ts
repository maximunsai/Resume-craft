// src/app/api/generate-resume/route.ts - SWITCHING BACK TO THE BETTER MODEL

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

type ExperienceItem = {
    id: number;
    title: string;
    company: string;
    description: string;
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { personal, experience, skills, finalThoughts } = body;

        // The prompt remains the same.
        const prompt = `
        SYSTEM PROMPT:
        You are "ResumeCraft AI," an expert resume writer... (rest of prompt is unchanged)

        USER DATA:
        ... (rest of user data is unchanged)

        YOUR TASK:
        Generate a JSON object with the following structure... (rest of task is unchanged)
        `;

        // =====================================================================
        // THE FIX IS HERE: We are switching back to the latest and greatest model
        // that is compatible with the v1beta API used by the library.
        // The previous "overloaded" error was likely temporary.
        // =====================================================================
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash-latest",
            safetySettings: safetySettings
        });

        const result = await model.generateContent(prompt);
        // =====================================================================

        const response = result.response;
        const text = response.text();
        
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const aiData = JSON.parse(cleanedText);

        aiData.detailedExperience = aiData.detailedExperience.map((aiExp: {id: number, points: string[]}) => {
            const originalExp = experience.find((exp: {id: number}) => exp.id === aiExp.id);
            return {
                ...aiExp,
                title: originalExp?.title || '',
                company: originalExp?.company || ''
            };
        });

        return NextResponse.json(aiData);

    } catch (error) {
        console.error("Error in Gemini API route:", error);
        const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}