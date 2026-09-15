import { NextRequest, NextResponse } from 'next/server';
import { getUserCollection } from '@/lib/mongodb';
import { verifyPassword } from '@/lib/auth';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/session';
import { User } from '@/lib/models';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginRequestBody {
  email?: string;
  password?: string;
}

export async function POST(request: NextRequest) {
  try {
    let body: LoginRequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body: expected JSON' }, { status: 400 });
    }

    const email = body.email?.trim().toLowerCase() ?? '';
    const password = body.password ?? '';

    if (!EMAIL_REGEX.test(email) || !password) {
      return NextResponse.json({ error: 'Please enter a valid email and password' }, { status: 400 });
    }

    let userCollection;
    try {
      userCollection = await getUserCollection();
    } catch (err) {
      console.error('MongoDB connection error during login:', err);
      return NextResponse.json(
        { error: 'Unable to connect to the database. Please try again shortly.' },
        { status: 503 }
      );
    }

    // Same generic error for "no such user" and "wrong password" — never
    // reveal which one it was.
    const invalidCredentials = () =>
      NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

    const user = await userCollection.findOne<User>({ email });
    if (!user) {
      return invalidCredentials();
    }

    const passwordMatches = await verifyPassword(password, user.passwordHash);
    if (!passwordMatches) {
      return invalidCredentials();
    }

    const userId = user._id!.toString();

    let token: string;
    try {
      token = await createSessionToken({ userId, email: user.email, name: user.name });
    } catch (err) {
      console.error('Session creation failed:', err);
      return NextResponse.json({ error: 'Unable to sign you in right now. Please try again.' }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      user: { id: userId, name: user.name, email: user.email },
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
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
