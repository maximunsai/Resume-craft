// src/app/api/interview/route.ts - THE BULLETPROOF VERSION

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the client and model (this is correct)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash-latest", 
    safetySettings 
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { resumeData = {}, conversationHistory = [] } = body;

        // An even stronger, more explicit prompt for the AI
        const system_instruction = `You are "Forge," an expert AI mock interviewer. Your personality is encouraging but professional.
        Your task is to conduct a mock interview.
        YOUR STRICT RULES:
        1.  ANALYZE CONTEXT: Review the user's resume and the entire conversation history to ask the most relevant, logical next question. Do not repeat questions.
        2.  PROVIDE FEEDBACK: After the user provides an answer, give one concise, constructive sentence of feedback.
        3.  ASK THE NEXT QUESTION: After the feedback, ask a new question.
        4.  JSON OUTPUT ONLY: Your entire response MUST be a single, raw, valid JSON object. It must start with { and end with }. Do not add any text, markdown, or explanations before or after the JSON.

        YOUR JSON RESPONSE FORMAT:
        {
          "feedback": "Your concise feedback here.",
          "next_question": "Your next question here."
        }`;

        const prompt = `${system_instruction}\n\n---\n**USER RESUME DATA:**\n${JSON.stringify(resumeData)}\n\n---\n**CONVERSATION HISTORY (Last message is the user's latest answer):**\n${conversationHistory.map((msg: { sender: string; text: string; }) => `${msg.sender}: ${msg.text}`).join('\n')}\n---`;

        console.log("Sending prompt to Gemini..."); // Good for Vercel logs

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        console.log("Received raw response from Gemini:", responseText); // CRITICAL for debugging

        // =================================================================
        // THE FIX IS HERE: A safer way to parse the JSON response
        // =================================================================
        let parsedResponse;
        try {
            // Find the first opening brace '{' and the last closing brace '}'
            const firstBrace = responseText.indexOf('{');
            const lastBrace = responseText.lastIndexOf('}');
            
            if (firstBrace === -1 || lastBrace === -1) {
                // If no JSON object is found, we throw a specific error
                throw new Error("AI response did not contain a JSON object.");
            }
            
            const jsonString = responseText.substring(firstBrace, lastBrace + 1);
            parsedResponse = JSON.parse(jsonString);

        } catch (parseError) {
            // This catch block handles cases where the extracted string is STILL not valid JSON
            console.error("Failed to parse JSON from AI response. Raw text:", responseText);
            // We'll create a fallback response to send to the user
            return NextResponse.json({ 
                error: "The AI returned an invalid format. Please try rephrasing your answer." 
            }, { status: 500 });
        }
        // =================================================================

        console.log("Successfully parsed AI response:", parsedResponse);
        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("Error in interview API route:", error);
        const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}