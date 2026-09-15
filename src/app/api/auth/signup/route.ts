import { NextRequest, NextResponse } from 'next/server';
import { getUserCollection } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/session';
import { User } from '@/lib/models';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

interface SignupRequestBody {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export async function POST(request: NextRequest) {
  try {
    let body: SignupRequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body: expected JSON' }, { status: 400 });
    }

    const name = body.name?.trim() ?? '';
    const email = body.email?.trim().toLowerCase() ?? '';
    const password = body.password ?? '';
    const confirmPassword = body.confirmPassword ?? '';

    if (!name) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    let userCollection;
    try {
      userCollection = await getUserCollection();
      // Idempotent — enforces email uniqueness at the database level too,
      // closing the race-condition window around the findOne check below.
      await userCollection.createIndex({ email: 1 }, { unique: true });
    } catch (err) {
      console.error('MongoDB connection error during signup:', err);
      return NextResponse.json(
        { error: 'Unable to connect to the database. Please try again shortly.' },
        { status: 503 }
      );
    }

    const existing = await userCollection.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const now = new Date();
    const newUser: User = { name, email, passwordHash, createdAt: now, updatedAt: now };

    let insertedId;
    try {
      const result = await userCollection.insertOne(newUser);
      insertedId = result.insertedId;
    } catch (err) {
      if (err && typeof err === 'object' && 'code' in err && (err as { code?: number }).code === 11000) {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
      }
      console.error('MongoDB error during signup insert:', err);
      return NextResponse.json({ error: 'Unable to create your account. Please try again.' }, { status: 503 });
    }

    const userId = insertedId.toString();
    const token = await createSessionToken({ userId, email, name });

    const response = NextResponse.json({
      success: true,
      user: { id: userId, name, email },
    });
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
