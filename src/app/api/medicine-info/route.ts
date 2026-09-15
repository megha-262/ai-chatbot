import { NextRequest, NextResponse } from 'next/server';
import { getGenAI, GEMINI_MODEL, classifyGeminiError } from '@/lib/gemini';
import { getSessionUser } from '@/lib/auth';

const MAX_NAME_LENGTH = 200;

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Please log in to use medicine information lookup.' }, { status: 401 });
    }

    let body: { medicineName?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body: expected JSON' }, { status: 400 });
    }

    const medicineName = body.medicineName?.trim() ?? '';
    if (!medicineName) {
      return NextResponse.json({ error: 'Please enter a medicine name.' }, { status: 400 });
    }
    if (medicineName.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Please keep the medicine name under ${MAX_NAME_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const prompt = `You are a general-education assistant providing publicly known, general information about medicines. You are NOT a pharmacist or doctor and must NOT give personalized medical advice.

Respond using exactly this Markdown structure:

## What It's Generally Used For
## Common Precautions
## Common Side Effects
## Important Warnings
## When to Consult a Doctor or Pharmacist

Rules:
- Do NOT provide a personalized dosage recommendation.
- Do NOT tell the user to start or stop any prescription medication.
- Do NOT claim to know the user's personal medical situation.
- If the input does not look like a real, recognizable medicine name, say so clearly instead of inventing information.
- Include this exact sentence verbatim near the top of your response: "This is general educational information, not a prescription or personalized medical advice. Always consult a qualified healthcare professional or pharmacist before taking any medication."

Medicine name: ${medicineName}`;

    let text: string | undefined;
    try {
      const result = await getGenAI().models.generateContent({ model: GEMINI_MODEL, contents: prompt });
      text = result.text;
    } catch (err) {
      console.error('Medicine info Gemini error:', err);
      const { status, message } = classifyGeminiError(err);
      return NextResponse.json({ error: message }, { status });
    }

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'No response was generated. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ success: true, result: text });
  } catch (error) {
    console.error('Medicine info error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
