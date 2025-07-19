import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import type { PersonalDetails, Experience } from '@/types/resume'; // Import our shared types

// Initialize the Google Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Define the model configuration
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// Define the shape of the incoming request body for validation and type safety
interface RequestBody {
    personal: PersonalDetails;
    experience: Experience[];
    skills: string;
    finalThoughts: string;
    jobDescription?: string;
}

export async function POST(request: Request) {
    try {
        const body: RequestBody = await request.json();
        const { personal, experience, skills, finalThoughts, jobDescription } = body;

        // Create a simplified version of the experience to pass to the AI,
        // focusing only on the data that needs to be rewritten.
        const experienceForAI = experience.map(exp => ({
            id: exp.id,
            title: exp.title,
            company: exp.company,
            description: exp.description, // The raw notes from the user
        }));

        const prompt = `
        You are an expert career coach and elite resume writer AI named "Forge." 
        Your task is to analyze the user's raw resume data and strategically tailor it to the provided Job Description for maximum impact.

        **CONTEXT:**
        1.  **User's Raw Data:** ${JSON.stringify({ personal, experience: experienceForAI, skills, finalThoughts })}
        2.  **Target Job Description:** ${jobDescription || "No job description provided. Generate a strong, general-purpose resume focused on the user's top achievements."}

        **YOUR STRICT INSTRUCTIONS:**
        1.  **Analyze Job Description:** Identify the top 5-7 key skills and qualifications.
        2.  **Rewrite Professional Summary:** Craft a powerful, 3-4 line summary that directly addresses the job description's needs, using the user's data as a base.
        3.  **Optimize Technical Skills:** Re-order and group the user's skills list, prioritizing those mentioned in the job description.
        4.  **Tailor Experience Bullet Points:** For EACH experience entry provided, transform the raw 'description' into 7-8 powerful, quantified bullet points. Each point MUST be an achievement (using metrics like %, $, time saved) and rephrased to align with the keywords from the Job Description. Use the STAR method.

        **OUTPUT FORMAT:**
        Your response MUST be a single, raw, valid JSON object. Do not include any conversational text, introductions, explanations, or markdown. Your response must start with { and end with }.

        **JSON STRUCTURE:**
        {
          "professionalSummary": "Your rewritten, tailored summary here.",
          "technicalSkills": ["Your rewritten and prioritized", "list of skills"],
          "detailedExperience": [
            {
              "id": 12345,
              "points": ["A rewritten bullet point tailored to the JD.", "Another powerful, quantified achievement."]
            }
          ]
        }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Robustly extract the JSON from the AI's response
        const firstBrace = responseText.indexOf('{');
        const lastBrace = responseText.lastIndexOf('}');
        if (firstBrace === -1 || lastBrace === -1) {
            console.error("AI response did not contain JSON:", responseText);
            throw new Error("AI response was not in the expected format.");
        }
        const jsonString = responseText.substring(firstBrace, lastBrace + 1);
        
        // Type the expected AI response for safety
        type AIResponse = {
            professionalSummary: string;
            technicalSkills: string[];
            detailedExperience: Array<{ id: number; points: string[] }>;
        };

        const aiData: AIResponse = JSON.parse(jsonString);

        // =================================================================
        // THE DEFINITIVE FIX: A more robust and efficient way to merge data.
        // =================================================================
        // Create a map of the AI-generated points for quick lookup.
        const aiPointsMap = new Map(aiData.detailedExperience.map(item => [item.id, item.points]));

        // Reconstruct the full experience array, preserving all original data and merging the AI points.
        const finalExperience = experience.map(originalExp => ({
            ...originalExp,
            // Use the AI-generated points if available, otherwise keep the original description as a fallback.
            points: aiPointsMap.get(originalExp.id) || [originalExp.description], 
        }));

        // Construct the final response object to send back to the client.
        const finalResponse = {
            professionalSummary: aiData.professionalSummary,
            technicalSkills: aiData.technicalSkills,
            detailedExperience: finalExperience,
        };

        return NextResponse.json(finalResponse);

    } catch (error) {
        console.error("Error in generate-resume API route:", error);
        const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}