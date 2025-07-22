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

    const getSystemInstruction = (currentStage: string, userResume: any): string => {
      let stageFocus = '';
      let transitionCue = '';

      switch (currentStage) {
        case 'Technical':
          stageFocus = `Your focus is 100% technical. Ask deep, resume-based technical questions about skills like '${userResume.skills}'. Present system design challenges related to their experience at '${userResume.experience?.[0]?.company}'. Your feedback must critique technical accuracy and depth.`;
          transitionCue = `After 6-8 questions, your final response MUST be ONLY this exact phrase: "That concludes the technical assessment. Are you ready for the final HR and situational round?"`;
          break;
        case 'Situational':
          stageFocus = `Your focus is 100% on HR and situational questions. Ask about salary expectations, team conflicts, career goals, and "Why should we hire you?". Your feedback must evaluate professionalism and strategic thinking.`;
          transitionCue = `After 4-6 questions, your final response MUST be ONLY this exact phrase: "This concludes our interview. Thank you for your time. The session will now end."`;
          break;
        case 'Behavioral':
        default:
          stageFocus = `Your focus is 100% behavioral. Ask questions that prompt STAR-method answers (Situation, Task, Action, Result) like "Tell me about a challenging project." Do not ask technical or HR questions. Your feedback must critique the user's storytelling structure.`;
          transitionCue = `After 5-7 questions, your final response MUST be ONLY this exact phrase: "Great, that covers the behavioral questions. Are you ready to move on to the technical round?"`;
          break;
      }

      return `You are "Forge," a world-class AI interview conductor from India. Your tone is professional, clear, and direct.

      **YOUR PRIME DIRECTIVE:** You are conducting a multi-stage interview. You must strictly adhere to the current stage. After the user's answer, provide 1-2 sentences of concise feedback, then ask the next question for the current stage.

      **CURRENT STAGE**: ${currentStage}.
      **STAGE FOCUS**: ${stageFocus}
      **TRANSITION CUE**: ${transitionCue}

      **STRICT RULES**:
      1.  Ask ONLY ONE question at a time.
      2.  Analyze the full CONVERSATION_HISTORY to avoid repeating questions and to ask relevant follow-ups.
      3.  Your entire response must be plain text. No JSON or markdown.`;
    };

    const systemInstruction = getSystemInstruction(stage, resumeData);
    const historyForPrompt = conversationHistory.map((msg: { sender: string; text: string }) => `${msg.sender.toUpperCase()}: ${msg.text}`).join('\n');

    const prompt = `
      ${systemInstruction}
      ---
      CANDIDATE'S RESUME: ${JSON.stringify(resumeData)}
      ---
      CONVERSATION HISTORY:
      ${historyForPrompt}
      ---
      YOUR_NEXT_RESPONSE:
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