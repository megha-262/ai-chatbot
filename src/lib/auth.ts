import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, SessionPayload, verifySessionToken } from '@/lib/session';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

// Reads and verifies the session cookie for the current request.
// Server-side only (Route Handlers / Server Components) — never trust a
// userId sent directly from the client instead of this.
export async function getSessionUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
