import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// createReadableStream function remains the same and is correct.

export async function POST(req: Request) {
  try {
    const { resumeData = {}, conversationHistory = [], stage = 'Behavioral' } = await req.json();
    const isInitialQuestion = conversationHistory.length === 0;

    const getSystemInstruction = (currentStage: string, isFirstQuestion: boolean): string => {
      let stageFocus = '';
      let initialGreeting = '';

      switch (currentStage) {
        case 'Technical':
          stageFocus = `Your focus is 100% technical... (Focus: Role-specific knowledge, problem-solving under pressure,
                         technical depth (customize for job/field).
                         Describe a project where you solved a difficult technical problem. What approach did you take?
                         Have you worked with [technology relevant to the job, e.g., React, Python, SQL]? Describe your experience.
                         Give me an example of how you debugged a hard software or technical issue.
                         How do you ensure the quality and reliability of your code/projects?
                         Tell me about a time you disagreed with a technical decision. What did you do?
                         Describe your experience with version control systems (e.g., Git). Any challenges you've faced?
                         Can you explain a complex technical concept to someone without a technical background?
                         Can you walk me through the design of a scalable system you built or worked on?)`;
          initialGreeting = `Heyy ${resumeData.name}, we are now in the Technical round. Let's start with a project that you have mentioned.`;
          break;
        case 'Situational':
          stageFocus = `Your focus is 100% on HR and situational questions... (Focus: Work ethics, company fit, hypothetical workplace scenarios, self-awareness.
          How do you handle disagreements with supervisors?
          What would you do if you witnessed unethical behavior at work?
          Why do you want to work at our company?
          How do you stay motivated during repetitive or monotonous tasks?
          Describe a time you had to balance personal and professional priorities.
          What would you do if you received negative feedback from your manager?
          Where do you see yourself in five years?
          If you were assigned to a project outside your expertise, what would you do?)`;
          initialGreeting = `Hi ${resumeData.name}, we are starting the HR & Situational round. Let's begin.`;
          break;
        case 'Behavioral':
        default:
          stageFocus = `Your focus is 100% behavioral... ( Focus: Soft skills, problem-solving, teamwork, adaptability (STAR method recommended).
                          Describe a situation in which you used persuasion to convince someone to see things your way.
                          Tell me about a time when you faced a stressful situation at work. How did you handle it?
                          Give me an example of a goal you set and how you achieved it.
                          Describe a situation where you disagreed with a team member. How did you resolve it?
                          Give an example of when you had to prioritize multiple tasks with tight deadlines.
                          Tell me about a time when you had to adapt quickly to an unexpected change at work.
                          Describe an occasion when you made a mistake. How did you handle it?
                          Tell me about a challenging project and what you learned from it.
                          Describe a time you went above and beyond your job responsibilities.)`;
          initialGreeting = `Hello, ${resumeData.name}. Welcome to the forge. We will start with some behavioral questions.`;
          break;
      }

      // =================================================================
      // THE DEFINITIVE FIX: The AI is now given a specific instruction
      // for the very first question of the interview.
      // =================================================================
      if (isFirstQuestion) {
        return `You are "Forge," an AI interviewer. Your task is to generate the very first opening line for the interview.
            
            **CURRENT STAGE**: ${currentStage}.
            **YOUR RESPONSE MUST BE ONLY THIS EXACT PHRASE**: "${initialGreeting}"`;
      }

      // This is the prompt for all subsequent questions.
      return `You are "Forge," a world-class AI mock interviewer... (Your existing, detailed prompt for follow-up questions goes here)`;
    };

    const systemInstruction = getSystemInstruction(stage, isInitialQuestion);
    // ... rest of your API logic is correct (construct prompt, call Gemini, stream response)

  } catch (error) { /* ... */ }
}