// src/app/api/interview/route.ts

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// This is the main "personality" of our interview agent.
const SYSTEM_INSTRUCTION = `You are an expert AI interviewer named "Forge". You are conducting a mock interview for a user.
1.  **Analyze the User's Resume Data**: Use their experience and skills to ask relevant behavioral and technical questions.
2.  **Engage in a Conversational Flow**: Start with a greeting and a behavioral question. Gradually move to more technical or situational questions.
3.  **Analyze the User's Answer**: After the user answers, provide brief, constructive feedback (1-2 sentences) on their answer. The feedback should focus on clarity, structure (like the STAR method), and relevance.
4.  **Ask the Next Question**: After providing feedback, ask the next logical question in the interview sequence.
5.  **Your Response MUST be a JSON object**: Your entire response must be a single, clean JSON object with two keys: "feedback" and "next_question". Do not include any other text or markdown.

Example response format:
{
  "feedback": "That's a solid example of teamwork. To make it stronger, you could quantify the result of your collaboration.",
  "next_question": "Can you describe a time you had to deal with a difficult stakeholder?"
}`;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { resumeData, conversationHistory } = body;

        // Format the conversation history for the AI
        const formattedHistory = conversationHistory.map((msg: { sender: string; text: string; }) => `${msg.sender}: ${msg.text}`).join('\n');

        const prompt = `
        ${SYSTEM_INSTRUCTION}
        
        ---
        USER'S RESUME DATA:
        ${JSON.stringify(resumeData)}
        ---
        CURRENT CONVERSATION:
        ${formattedHistory}
        ---

        Now, based on the last user answer, provide your feedback and the next question in the specified JSON format.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Use our robust JSON parsing logic
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error("AI response did not contain a valid JSON object.");
        }
        const jsonString = text.substring(firstBrace, lastBrace + 1);
        
        const parsedResponse = JSON.parse(jsonString);

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("Error in interview API route:", error);
        const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}