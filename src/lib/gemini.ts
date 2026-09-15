import { GoogleGenAI, ApiError } from '@google/genai';

// gemini-3.6-flash's free tier caps at 20 requests/DAY (shared across every
// feature that uses this client), which real usage exceeds trivially.
// gemini-3.5-flash-lite has a much higher free-tier quota with comparable
// quality for this app's structured health-info prompts.
export const GEMINI_MODEL = 'gemini-3.5-flash-lite';

let genAI: GoogleGenAI | undefined;

// Shared, memoized Gemini client — every route that talks to Gemini should
// use this instead of constructing its own client.
export function getGenAI(): GoogleGenAI {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAI;
}

// Maps a Gemini SDK error to a client-safe {status, message} pair with
// accurate, non-misleading wording. Shared by every simple (single-call)
// Gemini route so error wording stays consistent across features.
export function classifyGeminiError(err: unknown): { status: number; message: string } {
  if (err instanceof ApiError && err.status === 429) {
    return {
      status: 429,
      message: 'The AI service is temporarily busy. Please wait a moment and try again.',
    };
  }
  return {
    status: 502,
    message: 'Unable to connect to the AI service. Please try again.',
  };
}
