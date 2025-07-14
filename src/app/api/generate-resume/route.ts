// src/app/api/generate-resume/route.ts - FINAL CORRECTED VERSION FOR GEMINI

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Define the safety settings for the model
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

        const prompt = `
        SYSTEM PROMPT:
        You are "ResumeCraft AI," an expert resume writer with 30+ years of experience in top-tier executive recruiting. Your task is to transform raw user data into a world-class, ATS-optimized resume. Use powerful action verbs, focus on quantifiable achievements, and frame responsibilities using the STAR method. The output MUST be a clean, parsable JSON object, starting with { and ending with }. Do not include any other text, markdown, or explanations before or after the JSON.

        USER DATA:
        - Personal: ${JSON.stringify(personal)}
        - Experience: ${JSON.stringify(
            experience.map((e: ExperienceItem) => ({ 
                id: e.id,
                title: e.title, 
                company: e.company, 
                description: e.description 
            }))
        )}
        - Existing Skills: ${skills}
        - Final Thoughts/Goals: ${finalThoughts}

        YOUR TASK:
        Generate a JSON object with the following structure. For each item in "detailedExperience", include the original "id" from the user's input, alongside the AI-generated "points".
        {
          "professionalSummary": "A 3-4 line dynamic summary highlighting key skills and experience.",
          "technicalSkills": ["An array", "of categorized skills", "like Languages", "Frameworks", "Cloud"],
          "detailedExperience": [
            {
              "id": 1, 
              "points": [
                "For the first job, generate 7-8 professional bullet points. Transform raw notes into achievements like 'Engineered a new module, resulting in a 25% reduction in client time.'",
                "Use strong action verbs like 'Orchestrated', 'Architected', 'Pioneered', 'Maximized'."
              ]
            }
          ]
        }
        `;

        // =====================================================================
        // THE FIX IS HERE: `safetySettings` is passed to `getGenerativeModel`.
        // The `generateContent` call now only takes the prompt.
        // =====================================================================
        const model = genAI.getGenerativeModel({ 
            model: "gemini-pro",
            safetySettings: safetySettings // Moved to here
        });

        const result = await model.generateContent(prompt); // No second argument needed now
        // =====================================================================

        const response = result.response;
        const text = response.text();
        
        // Clean the response to ensure it's valid JSON
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const aiData = JSON.parse(cleanedText);

        // Combine the AI data with the original user data
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