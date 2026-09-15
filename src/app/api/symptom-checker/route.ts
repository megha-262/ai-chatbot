import { NextRequest, NextResponse } from 'next/server';
import { getGenAI, GEMINI_MODEL, classifyGeminiError } from '@/lib/gemini';
import { getSessionUser } from '@/lib/auth';

const MAX_SYMPTOMS_LENGTH = 2000;

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Please log in to use the symptom checker.' }, { status: 401 });
    }

    let body: { symptoms?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body: expected JSON' }, { status: 400 });
    }

    const symptoms = body.symptoms?.trim() ?? '';
    if (!symptoms) {
      return NextResponse.json({ error: 'Please describe your symptoms.' }, { status: 400 });
    }
    if (symptoms.length > MAX_SYMPTOMS_LENGTH) {
      return NextResponse.json(
        { error: `Please keep your description under ${MAX_SYMPTOMS_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const prompt = `You are a general-education public-health assistant helping someone understand possible common causes of symptoms they describe. You are NOT diagnosing them and must never claim to.

Respond using exactly this Markdown structure:

## Possible Common Causes
A short, non-exhaustive list of common general causes for these symptoms. Never claim certainty.

## Severity
On its own line, output exactly one word: LOW, MODERATE, or HIGH — your best general estimate of how urgently this combination of symptoms typically warrants attention. Then add one sentence explaining why.

## Recommended Next Steps
General, safe self-care or next-step suggestions.

## When to Contact a Healthcare Professional
Clear guidance on when this warrants seeing a doctor.

## Emergency Warning Signs
Signs that would make this a medical emergency requiring immediate care (call emergency services / go to the ER).

Rules:
- Do not claim to diagnose any disease or condition.
- Do not invent facts; use only well-established, general medical knowledge.
- Include this exact sentence verbatim near the top of your response: "This information is for general educational purposes only and is not a medical diagnosis."
- If the symptoms described could indicate a medical emergency, set Severity to HIGH and be direct and clear about seeking immediate emergency care.

User's described symptoms: ${symptoms}`;

    let text: string | undefined;
    try {
      const result = await getGenAI().models.generateContent({ model: GEMINI_MODEL, contents: prompt });
      text = result.text;
    } catch (err) {
      console.error('Symptom checker Gemini error:', err);
      const { status, message } = classifyGeminiError(err);
      return NextResponse.json({ error: message }, { status });
    }

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'No response was generated. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ success: true, result: text });
  } catch (error) {
    console.error('Symptom checker error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
