import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HealthDiary from '@/lib/models/healthDiary';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { userId, date, entry } = await req.json();

    if (!userId || !date || !entry) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const healthDiaryEntry = await HealthDiary.create({ user: userId, date, entry });

    return NextResponse.json({ healthDiaryEntry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
    }

    const healthDiaryEntries = await HealthDiary.find({ user: userId });

    return NextResponse.json({ healthDiaryEntries }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}