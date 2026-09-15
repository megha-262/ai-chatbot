import { SignJWT, jwtVerify } from 'jose';

// This module must stay Edge-compatible (no bcrypt/Node-only APIs) since
// it's imported by middleware.ts, which runs on the Edge runtime.

export const SESSION_COOKIE_NAME = 'healthbot_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
}

function getAuthSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getAuthSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecretKey());
    const { userId, email, name } = payload as Record<string, unknown>;
    if (typeof userId !== 'string' || typeof email !== 'string' || typeof name !== 'string') {
      return null;
    }
    return { userId, email, name };
  } catch {
    return null;
  }
}
