// src/app/api/interview/route.ts - PRODUCTION-GRADE REWRITE

import { GoogleGenerativeAI } from '@google/generative-ai';
import { streamText } from 'ai';
// import { google } from 'ai/google';

// Initialize the client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { resumeData = {}, conversationHistory = [], stage = 'Behavioral' } = await req.json();

    // =================================================================
    // THE CRITICAL PROMPT FIX: A highly structured and resilient prompt.
    // =================================================================
    const getSystemInstruction = (currentStage: string) => {
        let stageInstruction = '';
        
        switch (currentStage) {
            case 'Behavioral':
                stageInstruction = `Focus on behavioral questions that assess soft skills, teamwork, leadership, problem-solving approach, and cultural fit. Ask about past experiences and how they handled specific situations.`;
                break;
            case 'Technical':
                stageInstruction = `Focus on technical questions relevant to the candidate's field. Test their knowledge of programming languages, frameworks, system design, algorithms, and technical problem-solving.`;
                break;
            case 'Case Study':
                stageInstruction = `Present real-world scenarios or business cases. Evaluate analytical thinking, problem-solving methodology, and practical application of skills.`;
                break;
            default:
                stageInstruction = `Conduct a comprehensive interview covering various aspects of the candidate's qualifications.`;
        }
        
        return `You are "Forge," a world-class AI mock interviewer with expertise in conducting professional interviews across all industries and roles.

CORE IDENTITY:
- You are an experienced, empathetic, and insightful interviewer
- Your goal is to help candidates improve through realistic interview practice
- You maintain a professional yet approachable tone
- You provide constructive feedback and guidance

CURRENT INTERVIEW STAGE: ${currentStage}
STAGE FOCUS: ${stageInstruction}

INTERVIEW GUIDELINES:
1. Ask ONE question at a time and wait for the candidate's response
2. Follow up with clarifying questions when appropriate
3. Provide encouraging feedback and acknowledge good answers
4. If an answer is incomplete, guide them to elaborate
5. Keep questions relevant to the resume and role requirements
6. Maintain natural conversation flow
7. Be supportive while maintaining professional standards

RESPONSE FORMAT:
- Keep responses concise and focused
- Ask clear, specific questions
- Provide brief positive reinforcement when appropriate
- Use a conversational, professional tone

Remember: This is a practice session designed to help the candidate improve. Be constructive, encouraging, and realistic.`;
    };
    
    // Prepare the conversation for Gemini API format
    const systemInstruction = getSystemInstruction(stage);
    
    // Convert conversation history to Gemini format
    const contents = [
        {
            role: 'user',
            parts: [{ 
                text: `${systemInstruction}\n\nCandidate's Resume Context:\n${JSON.stringify(resumeData, null, 2)}\n\nPlease start the ${stage} interview stage.` 
            }]
        }
    ];

    // Add conversation history
    conversationHistory.forEach((msg: { sender: string; text: string; }) => {
        contents.push({
            role: msg.sender === 'AI' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        });
    });

    console.log(`Sending prompt to Gemini for stage: ${stage}`);

    const result = await streamText({
        model: google('gemini-1.5-flash-latest', {
            apiKey: process.env.GEMINI_API_KEY!,
        }),
        messages: conversationHistory.map((msg: { sender: string; text: string; }) => ({
            role: msg.sender === 'AI' ? 'assistant' : 'user',
            content: msg.text
        })),
        system: systemInstruction + `\n\nCandidate's Resume Context:\n${JSON.stringify(resumeData, null, 2)}`,
        temperature: 0.7,
        maxTokens: 1024,
    });
      
    console.log("Successfully initiated stream from Gemini.");

    return result.toDataStreamResponse();

  } catch (error) {
    console.error('[INTERVIEW_API_ERROR]', error);
    
    // Return a more detailed error response for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process interview request', 
        details: errorMessage,
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

function google(arg0: string, arg1: { apiKey: string; }): import("@ai-sdk/provider").LanguageModelV1 {
  throw new Error('Function not implemented.');
}
