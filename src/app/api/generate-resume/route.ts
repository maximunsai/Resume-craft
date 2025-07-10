// src/app/api/generate-resume/route.ts - USE THIS VERSION

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// We define a simple type to fix the TypeScript error.
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
        You are "ResumeCraft AI," an expert resume writer with 30+ years of experience in top-tier executive recruiting. Your task is to transform raw user data into a world-class, ATS-optimized resume. Use powerful action verbs, focus on quantifiable achievements, and frame responsibilities using the STAR method. The output MUST be a clean, parsable JSON object.

        USER DATA:
        - Personal: ${JSON.stringify(personal)}
        - Experience: ${JSON.stringify(
            // THE FIX IS HERE: We apply the 'ExperienceItem' type to the parameter 'e'
            experience.map((e: ExperienceItem) => ({ 
                id: e.id, // Pass the id for mapping later
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

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            response_format: { type: "json_object" },
            messages: [{ role: "system", content: prompt }],
            temperature: 0.7,
        });
        
        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error("AI failed to generate a response.");
        }

        // Combine the AI data with the original user data for a complete object
        const aiData = JSON.parse(content);
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
        console.error("Error in API route:", error);
        const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}