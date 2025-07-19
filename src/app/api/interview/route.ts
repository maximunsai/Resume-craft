import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { resumeData = {}, conversationHistory = [], stage = 'Behavioral' } = await req.json();

    const getSystemInstruction = (currentStage: string) => {
        let stageInstruction = '';
        
        switch (currentStage) {
            case 'Behavioral':
                stageInstruction = `Focus on behavioral questions that assess soft skills, teamwork, leadership, problem-solving approach, and cultural fit. Ask about past experiences and how they handled specific situations.`;
                break;
            case 'Technical':
                stageInstruction = `Focus on technical questions relevant to the candidate's field. Test their knowledge of programming languages, frameworks, system design, algorithms, and technical problem-solving.`;
                break;
            case 'Case Study':
                stageInstruction = `Present real-world scenarios or business cases. Evaluate analytical thinking, problem-solving methodology, and practical application of skills.`;
                break;
            default:
                stageInstruction = `Conduct a comprehensive interview covering various aspects of the candidate's qualifications.`;
        }
        
        return `You are "Forge," a world-class AI mock interviewer with expertise in conducting professional interviews across all industries and roles.

CORE IDENTITY:
- Experienced, empathetic, and insightful interviewer
- Help candidates improve through realistic practice
- Professional yet approachable tone
- Provide constructive feedback and guidance

CURRENT INTERVIEW STAGE: ${currentStage}
STAGE FOCUS: ${stageInstruction}

INTERVIEW GUIDELINES:
1. Ask ONE question at a time
2. Follow up with clarifying questions when appropriate
3. Provide encouraging feedback
4. Guide elaboration if answers are incomplete
5. Keep questions relevant to resume
6. Maintain natural conversation flow
7. Be supportive yet professional

RESPONSE FORMAT:
- Keep responses concise (2-3 sentences max)
- Ask clear, specific questions
- Brief positive reinforcement when appropriate
- Conversational, professional tone

Remember: This is practice to help candidates improve. Be constructive and encouraging.

Candidate Resume Context: ${JSON.stringify(resumeData, null, 2)}`;
    };
    
    console.log(`Processing interview request for stage: ${stage}`);

    // Convert conversation to Gemini format
    const geminiMessages = conversationHistory.map((msg: { sender: string; text: string; }) => ({
      role: msg.sender === 'AI' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    // Add system instruction as first user message
    const allMessages = [
      {
        role: 'user',
        parts: [{ text: getSystemInstruction(stage) }]
      },
      ...geminiMessages
    ];

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash-latest',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    const result = await model.generateContentStream({
      contents: allMessages
    });
      
    console.log("Successfully initiated stream from Gemini.");

    // Create a custom streaming response
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              // Format as AI SDK compatible stream
              const formattedChunk = `0:"${chunkText.replace(/"/g, '\\"')}"\n`;
              controller.enqueue(encoder.encode(formattedChunk));
            }
          }
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('[INTERVIEW_API_ERROR]', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process interview request', 
        details: errorMessage,
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}