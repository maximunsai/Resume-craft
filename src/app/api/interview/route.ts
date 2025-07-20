import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge'; // for Next.js Edge API compatibility

// Initialize the Gemini model client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Basic stream wrapper for plain text
function streamText(response: AsyncIterable<any>) {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        // Some SDK versions use chunk.text, or chunk.parts[].text
        const text = chunk.text ?? chunk.parts?.map((p: { text: any; }) => p.text).join('') ?? '';
        controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });
}

export async function POST(req: Request) {
  try {
    const { resumeData = {}, conversationHistory = [], stage = 'Behavioral' } = await req.json();

    // Utility: returns system prompt based on the interview stage
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

      return `You are "Forge", a world-class AI mock interviewer who adapts based on the stage of the interview.

      **CURRENT STAGE**: ${currentStage}

      **YOUR STRICT TASK**: Follow the persona for this stage and ask one relevant question at a time, analyze the user's resume and conversation history, provide expert feedback based on their answer, and proceed to the next question — all aligned with the current interview type.

      ${stageInstruction}

      **RULES**:
      - Ask ONLY ONE question at a time.
      - Respond naturally as plain text. Do not use JSON or markdown.`;
    };

    const systemInstruction = getSystemInstruction(stage);

    const historyForPrompt = conversationHistory
      .map((msg: { sender: string; text: string }) => `${msg.sender.toUpperCase()}: ${msg.text}`)
      .join('\n');

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

    // Get the Gemini model
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
    });

    // Stream Gemini content response
    const generation = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    // ✅ Use generation.stream — this is the proper AsyncIterable output
    return new Response(streamText(generation.stream), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('🔴 Error in mock interview API:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
