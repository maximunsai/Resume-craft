import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const runtime = 'edge';

// Helper function to create a readable stream from Gemini response
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
      } catch (e) {
        console.error('[STREAM_ERROR]', e);
        controller.error(e);
      }
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { resumeData = {}, conversationHistory = [], stage = 'Behavioral' } = await req.json();
    const isInitialQuestion = conversationHistory.length === 0;

    const getSystemInstruction = (currentStage: string, userResume: any, isFirstQuestion: boolean): string => {
      let stageFocus: string;
      let initialGreeting: string;

      switch (currentStage) {
        case 'Technical':
          stageFocus = `Your focus is 100% technical. Ask deep, resume-based technical questions about the user's skills (${userResume.skills}) and experience at companies like ${userResume.experience?.[0]?.company}. Ask about system design, code challenges, and specific technologies. Your feedback must critique technical accuracy.`;
          initialGreeting = `Heyy ${userResume.name}, we are now in the Technical round. Let's start with a project that you have mentioned in your resume.`;
          break;
        case 'Situational':
          stageFocus = `Your focus is 100% on HR and situational questions. Ask about salary expectations, team conflicts, career goals, and "Why should we hire you?". Your feedback must evaluate professionalism and strategic thinking.`;
          initialGreeting = `Hi ${userResume.name}, thanks for your time. We are starting the HR & Situational round. Let's begin with a question about your career aspirations.`;
          break;
        case 'Behavioral':
        default:
          stageFocus = `Your focus is 100% behavioral. Ask questions that prompt STAR-method answers (Situation, Task, Action, Result) like "Tell me about a challenging project." Do not ask technical or HR questions. Your feedback must critique the user's storytelling structure.`;
          initialGreeting = `Hello, ${userResume.name}. Welcome to the forge. We will start with some behavioral questions. First, could you please walk me through your resume?`;
          break;
      }
      
      if (isFirstQuestion) {
        return `You are "Forge," an AI interviewer. Your task is to provide the perfect, welcoming opening line for the interview based on the stage.
        **CURRENT STAGE**: ${currentStage}.
        **YOUR RESPONSE MUST BE ONLY THIS EXACT PHRASE**: "${initialGreeting}"`;
      }

      return `You are "Forge," a world-class AI mock interviewer from India. Your tone is professional and straightforward.
        **Current Interview Stage:** ${currentStage}.
        **Your Focus:** ${stageFocus}
        **Strict Rules:**
        1. After the user answers, provide 1-2 sentences of concise, constructive feedback.
        2. Then, ask the NEXT single question for the current stage.
        3. Analyze the CANDIDATE_RESUME and CONVERSATION_HISTORY to make your question relevant and avoid repetition.
        4. Your response must be ONLY the feedback and the next question text. Do not add conversational filler.`;
    };

    const systemInstruction = getSystemInstruction(stage, resumeData, isInitialQuestion);

    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash-latest',
        systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
    });

    const chatHistory = conversationHistory.map((msg: { sender: string; text: string }) => ({
        role: msg.sender === 'AI' ? 'model' : 'user',
        parts: [{ text: msg.text }]
    }));

    const result = await model.generateContentStream(chatHistory);

    return new Response(createReadableStream(result.stream), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error('[INTERVIEW_API_ERROR]', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}