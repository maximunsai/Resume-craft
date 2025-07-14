// src/app/api/generate-resume/route.ts - WITH ROBUST JSON PARSING

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Safety settings to allow all content for resume generation
const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

// Type definition for experience items
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

        // Validate required fields
        if (!personal || !experience || !skills) {
            return NextResponse.json(
                { error: "Missing required fields: personal, experience, or skills" },
                { status: 400 }
            );
        }

        // Enhanced prompt for better JSON generation
        const prompt = `
        SYSTEM PROMPT:
        You are a JSON generation service. You will be given user data and your ONLY response must be a single, clean, parsable JSON object. Do not include any conversational text, introductions, explanations, or markdown like \`\`\`json. Your response must start with { and end with }.

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
        - Final Thoughts/Goals: ${finalThoughts || 'No additional thoughts provided'}

        YOUR TASK:
        Generate a JSON object with the following structure. For each item in "detailedExperience", include the original "id" from the user's input, alongside the AI-generated "points".
        {
          "professionalSummary": "A 3-4 line dynamic summary highlighting key skills and experience.",
          "technicalSkills": ["An array", "of categorized skills"],
          "detailedExperience": [
            {
              "id": 1, 
              "points": [
                "A bullet point about an achievement using strong action verbs.",
                "Another bullet point with quantifiable results.",
                "A third bullet point showcasing impact.",
                "Continue with 4-5 more professional bullet points."
              ]
            }
          ]
        }

        IMPORTANT RULES:
        1. Generate 7-8 professional bullet points for each experience item
        2. Use strong action verbs (Led, Developed, Implemented, Achieved, etc.)
        3. Include quantifiable results where possible
        4. Keep bullet points concise but impactful
        5. Match the tone to the industry and role level
        6. Ensure all JSON is properly formatted and parsable
        `;

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash-latest",
            safetySettings: safetySettings
        });

        const result = await model.generateContent(prompt);
        const response = result.response;
        const rawText = response.text();
        
        console.log("Raw AI Response:", rawText);
        
        // =====================================================================
        // ROBUST JSON EXTRACTION LOGIC
        // =====================================================================
        // Find the first opening brace '{'
        const firstBrace = rawText.indexOf('{');
        // Find the last closing brace '}'
        const lastBrace = rawText.lastIndexOf('}');
        
        if (firstBrace === -1 || lastBrace === -1) {
            console.error("No valid JSON brackets found in AI response:", rawText);
            throw new Error("AI response did not contain a valid JSON object.");
        }
        
        // Extract the JSON string
        const jsonString = rawText.substring(firstBrace, lastBrace + 1);
        console.log("Extracted JSON string:", jsonString);

        // Parse the cleaned JSON string
        let aiData;
        try {
            aiData = JSON.parse(jsonString);
        } catch (parseError) {
            console.error("JSON parsing failed:", parseError);
            console.error("Attempted to parse:", jsonString);
            throw new Error("Failed to parse AI response as JSON");
        }
        
        // =====================================================================
        // VALIDATE AND STRUCTURE THE RESPONSE
        // =====================================================================
        
        // Validate that required fields exist
        if (!aiData.professionalSummary || !aiData.technicalSkills || !aiData.detailedExperience) {
            throw new Error("AI response missing required fields");
        }

        // Ensure technicalSkills is an array
        if (!Array.isArray(aiData.technicalSkills)) {
            aiData.technicalSkills = [];
        }

        // Ensure detailedExperience is an array
        if (!Array.isArray(aiData.detailedExperience)) {
            aiData.detailedExperience = [];
        }

        // Combine the AI data with the original user data
        aiData.detailedExperience = aiData.detailedExperience.map((aiExp: {id: number, points: string[]}) => {
            const originalExp = experience.find((exp: ExperienceItem) => exp.id === aiExp.id);
            
            if (!originalExp) {
                console.warn(`No matching experience found for ID: ${aiExp.id}`);
                return aiExp;
            }

            return {
                id: aiExp.id,
                title: originalExp.title,
                company: originalExp.company,
                points: Array.isArray(aiExp.points) ? aiExp.points : []
            };
        });

        // Add personal information to the response
        const completeResumeData = {
            name: personal.name || '',
            email: personal.email || '',
            phone: personal.phone || '',
            linkedin: personal.linkedin || '',
            github: personal.github || '',
            professionalSummary: aiData.professionalSummary,
            technicalSkills: aiData.technicalSkills,
            detailedExperience: aiData.detailedExperience
        };

        console.log("Successfully generated resume data:", completeResumeData);
        return NextResponse.json(completeResumeData);

    } catch (error) {
        console.error("Error in generate-resume API route:", error);
        
        // Enhanced error logging
        if (error instanceof SyntaxError) {
            console.error("JSON parsing error details:", {
                message: error.message,
                name: error.name,
                stack: error.stack
            });
        }
        
        const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
        return NextResponse.json({ 
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error : undefined
        }, { status: 500 });
    }
}