// src/app/api/interview/route.ts - MULTI-STAGE VERSION (UPDATED)

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const runtime = 'edge';

// Helper function to create a readable stream from Gemini response
function createReadableStream(geminiStream: any) {
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of geminiStream) {
          const chunkText = chunk.text();
          if (chunkText) {
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // We now expect the `stage` to be passed in the request body
    const { resumeData = {}, conversationHistory = [], stage = 'Behavioral' } = await req.json();

    // =================================================================
    // THE UPGRADE: A dynamic system prompt that changes based on the stage
    // =================================================================
    const getSystemInstruction = (currentStage: string) => {
        let stageInstruction = '';
        switch (currentStage) {
            case 'Technical':
                stageInstruction = `
                You are now in the **Technical Round**.
                - Ask specific, resume-based technical questions (e.g., "I see you used React; can you explain the virtual DOM?").
                - Present code problem-solving scenarios.
                - Discuss system design and architecture if relevant to the user's experience.
                - Provide feedback on the technical accuracy and depth of the user's answer.
                - After 8-12 questions, your final response should be "That concludes the technical round. Are you ready for the final HR and situational questions?"`;
                break;
            case 'Situational':
                stageInstruction = `
                You are now in the **HR & Situational Round**.
                - Ask questions about salary expectations, team conflict resolution, ideal work environment, and career goals.
                - Ask classic HR questions like "Why should we hire you?".
                - Provide feedback on the professionalism and strategic thinking behind the user's answers.
                - After 4-6 questions, your final response should be "That concludes our interview. Thank you for your time. The session will now end."`;
                break;
            case 'Behavioral':
            default:
                stageInstruction = `
                You are in the **Behavioral Round**.
                - Ask questions like "Tell me about yourself," "Walk through your resume," and questions about challenging projects or working under pressure.
                - Provide feedback based on the STAR (Situation, Task, Action, Result) method.
                - After 5-7 questions, your final response should be "Great, that covers the behavioral questions. Are you ready to move on to the technical round?"`;
                break;
        }

        return `You are "Forge," a world-class AI mock interviewer. Your personality is sharp and professional.
        **CURRENT STAGE**: ${currentStage}.
        **YOUR TASK**: Follow the instructions for the current stage precisely. Analyze the user's resume and the entire conversation history to ask a relevant question. After the user answers, provide concise, expert feedback, then ask the next question.
        
        ${stageInstruction}
        
        **RULES**:
        - Ask only one question at a time.
        - Respond naturally as plain text. Do not use JSON or markdown.`;
    };
    
    const system_instruction = getSystemInstruction(stage);
    
    // Construct the conversation history for the prompt
    const historyForPrompt = conversationHistory.map((msg: { sender: string; text: string; }) => 
      `${msg.sender.toUpperCase()}: ${msg.text}`
    ).join('\n');
    
    // Construct the full prompt
    const prompt = `${system_instruction}

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

CONVERSATION HISTORY:
${historyForPrompt}

Please provide your next question or feedback based on the current stage: ${stage}`;

    // Generate streaming response from Gemini
    const geminiStream = await genAI
      .getGenerativeModel({ model: 'gemini-1.5-flash-latest' })
      .generateContentStream({ 
        contents: [{ role: 'user', parts: [{ text: prompt }] }] 
      });

    // Create a readable stream from the Gemini response
    const stream = createReadableStream(geminiStream);

    // Return the streaming response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in interview API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}