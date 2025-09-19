import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MedicineReminder from '@/lib/models/medicineReminder';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { userId, medicine, time } = await req.json();

    if (!userId || !medicine || !time) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const medicineReminder = await MedicineReminder.create({ user: userId, medicine, time });

    return NextResponse.json({ medicineReminder }, { status: 201 });
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

    const medicineReminders = await MedicineReminder.find({ user: userId });

    return NextResponse.json({ medicineReminders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}