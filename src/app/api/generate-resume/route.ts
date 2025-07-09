// src/app/api/generate-resume/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { personal, experience, skills, finalThoughts } = body;

        // --- THE PROMPT ENGINEERING - This is the "30+ years expert" brain ---
        const prompt = `
        SYSTEM PROMPT:
        You are "ResumeCraft AI," an expert resume writer with 30+ years of experience in top-tier executive recruiting. Your task is to transform raw user data into a world-class, ATS-optimized resume. Use powerful action verbs, focus on quantifiable achievements (even if you have to logically invent them based on context), and frame responsibilities using the STAR method. The output MUST be a clean, parsable JSON object with no extra text or explanations.

        USER DATA:
        - Personal: ${JSON.stringify(personal)}
        - Experience: ${JSON.stringify(experience.map(e => ({ title: e.title, company: e.company, description: e.description })))}
        - Existing Skills: ${skills}
        - Final Thoughts/Goals: ${finalThoughts}

        YOUR TASK:
        Generate a JSON object with the following structure:
        {
          "professionalSummary": "A 3-4 line dynamic summary highlighting key skills and experience.",
          "technicalSkills": ["An array", "of categorized skills", "like Languages", "Frameworks", "Cloud"],
          "detailedExperience": [
            {
              "id": 1, // Match the ID from the user's input experience array
              "points": [
                "For the first job, generate 7-8 professional bullet points. Transform raw notes into achievements.",
                "Example: 'Engineered and launched a new data reporting module using React and Node.js, resulting in a 25% reduction in manual report generation time.'",
                "Spearheaded the migration of a legacy system, improving performance by 40%.",
                "Use strong action verbs like 'Orchestrated', 'Architected', 'Pioneered', 'Maximized'."
              ]
            }
          ]
        }
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Or "gpt-3.5-turbo" for faster, cheaper results
            response_format: { type: "json_object" },
            messages: [{ role: "system", content: prompt }],
            temperature: 0.7, // A bit of creativity
        });
        
        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error("AI failed to generate a response.");
        }

        return NextResponse.json(JSON.parse(content));

    }  catch (error) { // Change this line
        console.error("Error in API route:", error);
        const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}