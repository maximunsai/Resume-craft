// Make sure you're in a Next.js 13+ app with App Router (Edge support)

// 1. Import necessary packages
import { GoogleGenerativeAI } from '@google/generative-ai';

// 2. Enable Edge Runtime
export const runtime = 'edge';

// 3. Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 4. Export POST handler
export async function POST(req: Request) {
  try {
    const { resumeData = {}, conversationHistory = [] } = await req.json();

    // Define system instruction
    const systemInstruction = `
You are "Forge," an expert AI mock interviewer. Be professional, supportive, and sharp. 
Provide 1 line of feedback and ask 1 new relevant question. Focus on info from the resume and user's previous answers.
Limit your response to under 80 words total.
`;

    // Format history
    const formattedHistory = conversationHistory
      .map((msg: { sender: string; text: string }) => `${msg.sender.toUpperCase()}: ${msg.text}`)
      .join('\n');

    // Final prompt
    const prompt = `
${systemInstruction}

---
USER'S RESUME:
${JSON.stringify(resumeData, null, 2)}

---
CONVERSATION HISTORY:
${formattedHistory}

---
FORGE’S NEXT RESPONSE:
`;

    // Generate stream using Gemini's SDK
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const responseStream = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    // Create a Text Stream readable by the browser
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of responseStream.stream) {
          const text = chunk.text();
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    // Return the stream in the response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error('[INTERVIEW_API_ERROR]', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing the interview.' }),
      { status: 500 }
    );
  }
}
