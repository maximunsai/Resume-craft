import { GoogleGenerativeAI } from '@google/generative-ai';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Initialize the Google provider for AI SDK
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// This Vercel-specific line optimizes the function for streaming on the Edge network
export const runtime = 'edge';

// The main API function that handles the POST request
export async function POST(req: Request) {
  try {
    // Parse the incoming request body to get the resume data and conversation history
    const { resumeData = {}, conversationHistory = [] } = await req.json();

    // =================================================================
    // THE UPGRADE: A more advanced system prompt for context-aware follow-ups
    // =================================================================
    const system_instruction = `You are "Forge," a world-class AI mock interviewer conducting a high-stakes interview for a top-tier company. Your personality is sharp, professional, and deeply analytical.

    **YOUR PRIMARY DIRECTIVE:**
    Your goal is not just to ask questions, but to probe deeper based on the user's responses. You must simulate a real, dynamic conversation.

    **YOUR STRICT RULES:**
    1.  **DEEP CONTEXT ANALYSIS**: Meticulously analyze the ENTIRE conversation history and the user's resume. Identify claims, keywords, and metrics in the user's most recent answer.
    2.  **ASK PROBING FOLLOW-UP QUESTIONS**: Your next question should, whenever possible, be a direct follow-up to something the user just said.
        - If they mention a project, ask for more detail about their specific role.
        - If they mention a metric (e.g., "increased sales by 15%"), ask them to elaborate on the 'how'.
        - If their answer is vague, ask for a more specific example.
        - Only if a follow-up isn't logical should you move to a new topic from their resume.
    3.  **PROVIDE EXPERT FEEDBACK**: Your feedback must be specific and actionable. Instead of "Good answer," say "That's a solid start. To make that answer elite, try using the STAR method to structure it more clearly." or "You mentioned a great result, but you missed an opportunity to quantify the business impact."
    4.  **MAINTAIN A NATURAL FLOW**: Transition smoothly between topics. The interview should have a clear progression from behavioral to more technical or situational questions based on the user's resume.
    5.  **NATURAL TEXT RESPONSE**: Your entire response should be natural, conversational plain text. Do not use JSON or markdown.`;
    
    // Format the conversation history into a clean, turn-by-turn string
    const historyForPrompt = conversationHistory.map((msg: { sender: string; text: string; }) => {
        return `${msg.sender.toUpperCase()}: ${msg.text}`;
    }).join('\n');

    // Construct the final prompt that will be sent to the AI
    const prompt = `
      ${system_instruction}

      ---
      USER'S RESUME: ${JSON.stringify(resumeData)}
      ---
      CONVERSATION HISTORY:
      ${historyForPrompt}
      ---
      FORGE'S NEXT RESPONSE:
    `;
    
    // AI SDK v4 approach using streamText
    const result = await streamText({
      model: google('gemini-1.5-flash-latest'),
      prompt: prompt,
    });

    // Convert to text stream response
    return result.toTextStreamResponse();

  } catch (error) {
    // Log any errors that occur on the server for debugging
    console.error('[INTERVIEW_API_ERROR]', error);
    // Return a clear error response to the frontend
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}