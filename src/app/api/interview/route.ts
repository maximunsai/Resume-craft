// src/app/api/interview/route.ts - THE STREAMING ARCHITECTURE

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the client (safety settings are not used in streaming calls this way)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Using gemini-pro for stability

// This tells Next.js to handle this route as a streaming endpoint
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { resumeData = {}, conversationHistory = [] } = await request.json();

    const system_instruction = `You are "Forge," an expert AI mock interviewer. Your personality is encouraging but professional.
    YOUR TASK:
    1. ANALYZE CONTEXT: Review the user's resume and the entire conversation history to ask the most relevant, logical next question.
    2. PROVIDE FEEDBACK & ASK QUESTION: First, provide one concise, constructive sentence of feedback. Then, ask the next question.
    3. NATURAL RESPONSE: Respond as a human interviewer would. Do not use JSON. Just provide the feedback and question as a natural text response.`;

    const prompt = `${system_instruction}\n\n---\n**USER RESUME DATA:**\n${JSON.stringify(resumeData)}\n\n---\n**CONVERSATION HISTORY:**\n${conversationHistory.map((msg: { sender: string; text: string; }) => `${msg.sender}: ${msg.text}`).join('\n')}\n\n---\nForge:`;

    // Get the streaming response from the AI
    const result = await model.generateContentStream(prompt);

    // Create a new, readable stream to send back to our client
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          // Encode the text chunk and send it to the client
          controller.enqueue(new TextEncoder().encode(chunkText));
        }
        // Close the stream when the AI is done
        controller.close();
      },
    });

    // Return the stream as the response
    return new Response(stream);

  } catch (error) {
    console.error("Error in interview stream API route:", error);
    // In case of an error, return a proper error response
    return new Response("Sorry, an error occurred while processing your request.", { status: 500 });
  }
}