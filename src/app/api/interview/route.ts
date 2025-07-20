import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// =================================================================
// THE DEFINITIVE FIX: The complete and correct function implementation.
// =================================================================
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

    const getSystemInstruction = (currentStage: string, userResume: any, history: any[]): string => {
      let stageFocus = '';
      let lastUserAnswer = history.length > 0 ? history[history.length - 1].text : "This is the first question of the interview.";

      switch (currentStage) {
        case 'Technical':
          stageFocus = `
            **Purpose:** To evaluate the candidate's job-specific technical skills and problem-solving abilities based on their resume.
            **Your Task:**
            1.  **Analyze the Candidate's Last Answer:** Look for technical terms, project details, or metrics in "${lastUserAnswer}".
            2.  **Ask a Probing Follow-up:** If possible, ask a follow-up question about their answer. Example: If they mention optimizing a query, ask "What specific indexing strategy did you use and why?".
            3.  **If a follow-up is not possible, ask a new technical question** directly from their resume. Use their skills (${userResume.skills}) and experience at (${userResume.experience?.[0]?.company}) to make it specific. Example: "I see you've used AWS. Can you describe how you would set up a highly available architecture for a web application?"`;
          break;
        case 'Situational':
          stageFocus = `
            **Purpose:** To explore the candidate's fit, career goals, and ability to handle workplace scenarios.
            **Your Task:**
            1.  **Ask a common HR or situational question.** Examples: "What are your salary expectations?", "Describe a time you had a conflict with a team member and how you resolved it.", "Why are you interested in this type of role?".
            2.  **Your feedback should assess their professionalism and problem-solving approach.**`;
          break;
        case 'Behavioral':
        default:
          stageFocus = `
            **Purpose:** To assess how the candidate handles real-world situations based on past experiences.
            **Your Task:**
            1.  **Ask a classic behavioral question** that encourages a STAR method response (Situation, Task, Action, Result).
            2.  **Examples:** "Tell me about a time you had to take initiative on a project.", "Describe a situation where you had to work under a tight deadline.".
            3.  **Your feedback should focus on how well they structured their story.** Did they clearly explain the result of their actions?`;
          break;
      }

      return `You are "Forge," an expert AI interview coach from India. Your tone is professional, clear, and encouraging. You are not a robot; you are a helpful guide.

      **Your Prime Directive:** Act as a real interviewer. Remember the entire conversation, analyze the candidate's last answer, and ask a logical next question. Make the candidate feel like they are in a real, interactive interview.

      **Current Interview Stage:** ${currentStage}.
      **Stage Focus:** ${stageFocus}
      
      **Interaction Rules:**
      1.  **Provide Feedback First:** Start your response with 1-2 sentences of concise, constructive feedback on the candidate's previous answer ("${lastUserAnswer}").
      2.  **Then, Ask Your Question:** After the feedback, ask your single, new question for the current stage.
      3.  **Your Response:** Your entire output must be plain text. Do not use JSON or markdown.
      ---
      CANDIDATE'S RESUME (for context): ${JSON.stringify(userResume)}
      ---
      `;
    };

    const systemInstruction = getSystemInstruction(stage, resumeData, conversationHistory);
    
    // We will use a simpler prompt structure for the initial request
    const isInitialQuestion = conversationHistory.length === 0;
    let prompt;

    if (isInitialQuestion) {
        prompt = `${systemInstruction}\n\nStart the interview now with your first question.`
    } else {
        const historyForPrompt = conversationHistory.map((msg: { sender: string; text: string }) => `${msg.sender}: ${msg.text}`).join('\n');
        prompt = `${systemInstruction}\n\nCONVERSATION_HISTORY:\n${historyForPrompt}\n\nYOUR_NEXT_RESPONSE:`;
    }

    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash-latest',
        systemInstruction: systemInstruction, // Using the new, structured system instruction
    });

    const chatHistory = conversationHistory.map((msg: { sender: string; text: string }) => ({
        role: msg.sender === 'AI' ? 'model' : 'user',
        parts: [{ text: msg.text }]
    }));

    const result = await model.generateContentStream(chatHistory);

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