import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const runtime = 'edge';

// Helper function to create a readable stream from Gemini response (This is correct)
function createReadableStream(responseStream: AsyncIterable<any>): ReadableStream {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of responseStream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      } catch (error) {
        console.error('[STREAM_ERROR]', error);
        controller.error(error);
      }
    },
  });
}

// The main API function that handles the POST request
export async function POST(req: NextRequest) {
  try {
    const { resumeData = {}, conversationHistory = [], stage = 'Behavioral' } = await req.json();
    
    // =================================================================
    // THE DEFINITIVE PROMPT ARCHITECTURE
    // =================================================================
    const getSystemInstruction = (currentStage: string, userResume: any): string => {
      let stageFocus = '';
      switch (currentStage) {
        case 'Technical':
          stageFocus = `This is a Technical Round. Ask one specific technical question based on the candidate's skills like '${userResume.skills}' or their experience at '${userResume.experience?.[0]?.company}'. Example: "Can you explain a project where you used ${userResume.skills?.split(',')[0]}?"`;
          break;
        case 'Situational':
          stageFocus = `This is an HR & Situational Round. Ask one common HR question. Example: "What are your salary expectations?" or "Why are you looking for a new role?".`;
          break;
        case 'Behavioral':
        default:
          stageFocus = `This is a Behavioral Round. Ask one common behavioral question. Example: "Tell me about a time you faced a challenge at work."`;
          break;
      }

      return `You are "Forge," an expert AI interview coach from India. Your tone is professional and straightforward. Your task is to ask a single interview question. You will be given the candidate's resume for context and the conversation history.

      **Current Interview Stage:** ${currentStage}.
      **Your Focus for the next question:** ${stageFocus}

      **Strict Rules:**
      1.  Analyze the CANDIDATE_RESUME and CONVERSATION_HISTORY to make your question relevant and avoid repetition.
      2.  Ask ONLY ONE question per response.
      3.  Your response must ONLY be the question text. Do not add any greetings, feedback, or conversational filler.`;
    };

    const systemInstruction = getSystemInstruction(stage, resumeData);

    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash-latest',
        // Use the official `systemInstruction` property for rules and persona.
        // This is the most reliable way to guide the AI.
        systemInstruction: {
            role: "system",
            parts: [{ text: systemInstruction }],
        },
    });

    // Convert our conversation history to the format Gemini's chat expects
    const chatHistory = conversationHistory.map((msg: { sender: string; text: string }) => ({
        role: msg.sender === 'AI' ? 'model' : 'user',
        parts: [{ text: msg.text }]
    }));
    
    console.log(`Sending request to Gemini for stage: ${stage} with ${chatHistory.length} history messages.`);

    // Use the chat interface for conversational memory
    const chat = model.startChat({
        history: chatHistory.slice(0, -1) // Provide all but the user's latest message as history
    });

    const lastUserMessage = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].parts[0].text : "Please start the interview.";

    const result = await chat.sendMessageStream(lastUserMessage);

    return new Response(createReadableStream(result.stream), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('[INTERVIEW_API_ERROR]', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}