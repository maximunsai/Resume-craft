// src/app/api/interview/route.ts – SDK-only version, no 'ai/google'

import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge'; // Enable Next.js Edge Runtime

// Initialize Gemini client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Convert Gemini's stream result into a ReadableStream suitable for streaming in Edge Functions
function createReadableStream(response: AsyncIterable<any>): ReadableStream {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const text = chunk.text ?? chunk.parts?.map((p: { text: any; }) => p.text).join('') ?? '';
          controller.enqueue(encoder.encode(text));
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

    // Generate the appropriate system instruction based on the interview stage
    const getSystemInstruction = (currentStage: string): string => {
      let stageInstruction = '';
      switch (currentStage) {
        case 'Technical':
          stageInstruction = `
            You are now a Senior Engineer from a top tech company. Your focus is 100% technical.
            - Ask specific, deep technical questions based on the technologies listed in the user's resume (e.g., "I see you used PostgreSQL. Can you describe a time you had to optimize a slow query? What were the steps you took?").
            - Present realistic system design scenarios (e.g., "How would you design a URL shortening service?").
            - If the resume mentions specific projects, ask for detailed architectural discussions about them.
            - Your feedback should critique the technical accuracy, depth, and clarity of the user's explanation.`;
          break;
        case 'Situational':
          stageInstruction = `
            You are now an experienced HR Manager. Your focus is 100% on situational and company-fit questions.
            - Ask classic HR questions like: "What is your expected salary range?", "Why are you looking to leave your current role?", "Where do you see yourself in 5 years?", "Why do you want to join our company?".
            - Present situational challenges like: "Describe a time you had a conflict with a colleague. How did you resolve it?", "How would you handle a situation where you strongly disagree with your manager's decision?".
            - Your feedback should evaluate the user's professionalism, strategic thinking, and communication skills.`;
          break;
        case 'Behavioral':
        default:
          stageInstruction = `
            You are now a Hiring Manager focused on behavior and past performance. Your focus is 100% behavioral.
            - Ask questions that prompt STAR-method answers (Situation, Task, Action, Result), such as: "Tell me about a challenging project you led.", "Describe a time you had to work under a tight deadline.", "Walk me through your most significant accomplishment at your last role.".
            - Do not ask generic technical or HR questions. Focus purely on past behavior.
            - Your feedback should critique how well the user structured their answer, ideally using the STAR method.`;
          break;
      }

      return `
        You are "Forge," a world-class AI mock interviewer. You will adopt a specific persona based on the interview stage.

        **CURRENT STAGE**: ${currentStage}

        **YOUR STRICT TASK**: Adhere strictly to the persona and instructions for the current stage. Analyze the user's resume and conversation to ask a relevant question. After the user answers, provide concise, expert feedback, then ask the next question for this stage.
        
        ${stageInstruction}
        
        **RULES**:
        - Ask ONLY ONE question at a time.
        - Respond naturally as plain text. Do not use JSON or markdown.
      `;
    };

    const systemInstruction = getSystemInstruction(stage);

    // Convert conversation history into a readable prompt section
    const historyForPrompt = conversationHistory
      .map((msg: { sender: string; text: string }) => `${msg.sender.toUpperCase()}: ${msg.text}`)
      .join('\n');

    // Final prompt sent to the model
    const prompt = `
      ${systemInstruction}
      ---
      USER'S RESUME: ${JSON.stringify(resumeData)}
      ---
      CONVERSATION HISTORY:
      ${historyForPrompt}
      ---
      FORGE'S NEXT RESPONSE:
    `;

    console.log(`Sending prompt to Gemini for stage: ${stage}`);

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    console.log('Successfully initiated stream from Gemini.');

    // 🔁 Return a streaming text/plain response
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
