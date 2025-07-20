import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function createReadableStream(responseStream: AsyncIterable<any>): ReadableStream {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of responseStream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (e) {
        console.error('[STREAM_ERROR]', e);
        controller.error(e);
      }
    },
  });
}

export async function POST(req: Request) {
  try {
    const { resumeData = {}, conversationHistory = [], stage = 'Behavioral' } = await req.json();

    // =================================================================
    // THE DEFINITIVE PROMPT FIX: Simple, Direct, and Context-Aware
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

      return `You are an expert AI interviewer from India. Your tone is professional and straightforward.
      Your task is to ask a single interview question.

      **Current Interview Stage:** ${currentStage}.
      **Your Focus:** ${stageFocus}

      **Strict Rules:**
      1.  Analyze the provided CANDIDATE_RESUME to make your question relevant.
      2.  Look at the CONVERSATION_HISTORY to avoid repeating questions.
      3.  Ask ONLY ONE question.
      4.  Your response must ONLY be the question text. Do not add any greetings, feedback, or conversational filler.`;
    };

    const systemInstruction = getSystemInstruction(stage, resumeData);
    const historyForPrompt = conversationHistory.map((msg: { sender: string; text: string }) => `${msg.sender}: ${msg.text}`).join('\n');

    const prompt = `
      ${systemInstruction}
      ---
      CANDIDATE_RESUME: ${JSON.stringify(resumeData)}
      ---
      CONVERSATION_HISTORY:
      ${historyForPrompt}
      ---
      YOUR_NEXT_QUESTION:
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const result = await model.generateContentStream({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });

    return new Response(createReadableStream(result.stream), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error('[INTERVIEW_API_ERROR]', error);
    return new Response('An error occurred.', { status: 500 });
  }
}