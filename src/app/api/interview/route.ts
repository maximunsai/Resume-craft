// src/app/api/interview/route.ts - THE ROBUST VERSION

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the client with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Safety settings to prevent blocking legitimate content
const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

// Switch to the newest, most capable model available in the free tier. It's better at following complex instructions.
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash-latest", 
    safetySettings 
});


export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Provide default empty values to prevent errors if data is missing
        const { resumeData = {}, conversationHistory = [] } = body;

        // =================================================================
        // THE FIX: A much stronger, more "bulletproof" system prompt.
        // =================================================================
        const system_instruction = `You are "Forge," an expert AI mock interviewer. Your personality is encouraging but professional.
        Your task is to conduct a mock interview based on the provided user resume data and conversation history.

        **YOUR STRICT RULES:**
        1.  **ANALYZE CONTEXT**: Review the user's resume (experience, skills) and the entire conversation history to ask the most relevant, logical next question. Do not repeat questions. Start with behavioral questions and escalate to technical or situational questions if appropriate.
        2.  **PROVIDE FEEDBACK**: After the user provides an answer (which is the last message in the history), give them one single, concise, and constructive sentence of feedback. Focus on whether they used the STAR method, quantified their results, or answered the question directly.
        3.  **ASK THE NEXT QUESTION**: After the feedback, ask the next question.
        4.  **JSON OUTPUT ONLY**: Your entire response MUST be a single, raw, valid JSON object. Do not include any text, introductions, or markdown like \`\`\`json. Your response must start with { and end with }.

        **JSON FORMAT:**
        {
          "feedback": "Your concise feedback here.",
          "next_question": "Your next question here."
        }`;

        const prompt = `
            ${system_instruction}

            ---
            **USER RESUME DATA:**
            ${JSON.stringify(resumeData)}
            ---
            **CONVERSATION HISTORY (Last message is the user's latest answer):**
            ${conversationHistory.map((msg: { sender: string; text: string; }) => `${msg.sender}: ${msg.text}`).join('\n')}
            ---
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Use our robust JSON extraction logic
        const firstBrace = responseText.indexOf('{');
        const lastBrace = responseText.lastIndexOf('}');
        
        if (firstBrace === -1 || lastBrace === -1) {
            console.error("AI response did not contain JSON:", responseText);
            throw new Error("Received a non-JSON response from the AI.");
        }
        
        const jsonString = responseText.substring(firstBrace, lastBrace + 1);
        const parsedResponse = JSON.parse(jsonString);

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("Error in interview API route:", error);
        const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
        // Return a more specific error to the client
        return NextResponse.json({ error: errorMessage, details: 'The AI model failed to process the request.' }, { status: 500 });
    }
}