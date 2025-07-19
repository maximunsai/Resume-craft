// src/app/api/parse-resume/route.ts

import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse'; // For PDFs
import mammoth from 'mammoth'; // For .docx Word documents
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('resume') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
        }

        const fileBuffer = Buffer.from(await file.arrayBuffer());
        let rawText = '';

        // Extract raw text based on file type
        if (file.type === 'application/pdf') {
            const data = await pdf(fileBuffer);
            rawText = data.text;
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
            rawText = value;
        } else {
            return NextResponse.json({ error: 'Unsupported file type. Please use PDF or DOCX.' }, { status: 400 });
        }
        
        if (!rawText) {
            return NextResponse.json({ error: 'Could not extract text from the file.' }, { status: 500 });
        }

        // Now, use the AI to structure the extracted text
        const prompt = `You are an expert resume parsing AI. Analyze the following raw text extracted from a resume and convert it into a structured JSON object. The JSON object must have these exact keys: "personal", "experience", "skills". The "experience" key must be an array of objects, each with "id", "title", "company", "startDate", "endDate", and "description". Be as accurate as possible. If you cannot determine a value, leave it as an empty string. Your response must be ONLY the raw JSON object, starting with { and ending with }.

        RAW RESUME TEXT:
        ---
        ${rawText.substring(0, 10000)}
        ---
        JSON OUTPUT:`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        const firstBrace = responseText.indexOf('{');
        const lastBrace = responseText.lastIndexOf('}');
        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error("AI parser response did not contain a valid JSON object.");
        }
        const jsonString = responseText.substring(firstBrace, lastBrace + 1);

        return NextResponse.json(JSON.parse(jsonString));

    } catch (error) {
        console.error('[PARSE_RESUME_ERROR]', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}