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

export async function POST(req: Request) {
  try {
    const { resumeData = {}, conversationHistory = [], stage = 'Behavioral' } = await req.json();

    // =================================================================
    // THIS IS YOUR EXPERT PROMPT, DIRECTLY INTEGRATED
    // =================================================================
    const getSystemInstruction = (currentStage: string, userData: any): string => {
        let stageInstruction = '';
        let examples = '';

        switch (currentStage) {
            case 'Technical':
                stageInstruction = `Generate a technical question that is **directly and explicitly linked** to the user's background in the \`userData\` object. You MUST synthesize information from \`technicalSkills\` and \`workExperience\` to create a realistic and challenging question. Do not ask generic, textbook questions.`;
                examples = `
                * (Synthesizing Skill + Experience): "In your role at ${userData.workExperience?.[0]?.company || 'your last company'}, you mentioned building RESTful APIs with Node.js. Could you describe how you would implement rate-limiting on those APIs to prevent abuse?"
                * (Deep-Dive on a Skill): "You've listed 'React' as a skill. Can you explain the difference between a controlled and an uncontrolled component, and why you might choose one over the other?"
                * (Problem-Solving based on Experience): "Your resume states you 'optimized SQL database queries'. Walk me through the process you used to identify a slow query."`;
                break;
            case 'Situational': // Mapped from 'HR & Situational'
                stageInstruction = `Generate a question typical of a Human Resources (HR) screening or a final-round culture-fit interview. This can include situational judgment, career aspirations, or salary discussions. Do NOT ask deep technical questions.`;
                examples = `
                * "Where do you see yourself professionally in the next 5 years?"
                * "What are your salary expectations for this role?"
                * "Imagine you discovered your team lead made a significant error in a report. What would you do?"`;
                break;
            case 'Behavioral':
            default:
                stageInstruction = `Generate a standard behavioral question designed to be answered using the STAR method (Situation, Task, Action, Result). Do NOT use the user's technical skills or experience. These questions should be generic and focus on soft skills.`;
                examples = `
                * "Tell me about a time you had a significant disagreement with a coworker. How did you handle it?"
                * "Describe a situation where you had to learn a new technology or skill in a short amount of time."`;
                break;
        }

        return `You are "Interview Architect," an expert AI interview coach. Your purpose is to generate one highly relevant, single interview question.
        
        **### CONTEXT ###**
        You are the core logic for a mock interview application. A user has chosen a specific interview category: "${currentStage}".
        
        **### YOUR OBJECTIVE ###**
        Generate a single, precise interview question based on the chosen category.
        
        **### STAGE-SPECIFIC INSTRUCTION ###**
        ${stageInstruction}
        
        **### EXAMPLES of good questions for this stage ###**
        ${examples}
        
        **### RULE ###**
        Ask ONLY ONE question. Do not add any feedback, greetings, or conversational filler. Your entire response must be just the question itself.`;
    };

    const systemInstruction = getSystemInstruction(stage, {
        technicalSkills: resumeData.skills,
        workExperience: resumeData.experience,
    });
    
    // For the very first question, we don't have user history yet.
    const isInitialQuestion = conversationHistory.length <= 1;
    const historyForPrompt = isInitialQuestion ? "" : conversationHistory.map((msg: { sender: string; text: string }) => `${msg.sender.toUpperCase()}: ${msg.text}`).join('\n');

    const prompt = isInitialQuestion 
        ? systemInstruction 
        : `${systemInstruction}\n\n--- CONVERSATION HISTORY ---\n${historyForPrompt}\n\n--- YOUR NEXT QUESTION ---`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return new Response(createReadableStream(result.stream), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) { /* ... Your existing error handling ... */ }
}