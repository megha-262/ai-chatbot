import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUserCollection } from '@/lib/mongodb';
import { getSessionUser } from '@/lib/auth';
import { HealthProfile, User } from '@/lib/models';

const VALID_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''];
const MAX_GENDER_LENGTH = 50;

// GET /api/profile — the authenticated user's own profile only.
export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let userCollection;
    try {
      userCollection = await getUserCollection();
    } catch (err) {
      console.error('MongoDB connection error:', err);
      return NextResponse.json(
        { error: 'Unable to connect to the database. Please try again shortly.' },
        { status: 503 }
      );
    }

    const user = await userCollection.findOne<User>({ _id: new ObjectId(session.userId) });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id!.toString(),
        name: user.name,
        email: user.email,
        healthProfile: user.healthProfile ?? {},
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}

interface ProfileUpdateBody {
  age?: number | null;
  gender?: string | null;
  bloodGroup?: string | null;
  preferences?: { notifications?: boolean };
}

// PUT /api/profile — updates only the authenticated user's own health
// profile. Name/email are shown but not editable here: they're also cached
// in the session JWT, and changing them without a re-login would go stale.
export async function PUT(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let body: ProfileUpdateBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body: expected JSON' }, { status: 400 });
    }

    const update: { updatedAt: Date; healthProfile: HealthProfile } = {
      updatedAt: new Date(),
      healthProfile: {},
    };

    if (body.age !== undefined && body.age !== null) {
      if (typeof body.age !== 'number' || !Number.isFinite(body.age) || body.age < 0 || body.age > 120) {
        return NextResponse.json({ error: 'Please enter a valid age between 0 and 120' }, { status: 400 });
      }
      update.healthProfile.age = body.age;
    }

    if (body.gender !== undefined && body.gender !== null) {
      const gender = body.gender.trim();
      if (gender.length > MAX_GENDER_LENGTH) {
        return NextResponse.json({ error: 'Gender is too long' }, { status: 400 });
      }
      if (gender) update.healthProfile.gender = gender;
    }

    if (body.bloodGroup !== undefined && body.bloodGroup !== null) {
      const bloodGroup = body.bloodGroup.trim().toUpperCase();
      if (!VALID_BLOOD_GROUPS.includes(bloodGroup)) {
        return NextResponse.json({ error: 'Please select a valid blood group' }, { status: 400 });
      }
      if (bloodGroup) update.healthProfile.bloodGroup = bloodGroup;
    }

    if (body.preferences !== undefined) {
      update.healthProfile.preferences = {
        notifications: Boolean(body.preferences?.notifications),
      };
    }

    let userCollection;
    try {
      userCollection = await getUserCollection();
    } catch (err) {
      console.error('MongoDB connection error:', err);
      return NextResponse.json(
        { error: 'Unable to connect to the database. Please try again shortly.' },
        { status: 503 }
      );
    }

    const userId = new ObjectId(session.userId);
    const existing = await userCollection.findOne<User>({ _id: userId });
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Merge into the existing health profile rather than overwriting fields
    // that weren't part of this request.
    const mergedHealthProfile: HealthProfile = {
      ...existing.healthProfile,
      ...update.healthProfile,
    };

    await userCollection.updateOne(
      { _id: userId },
      {
        $set: {
          healthProfile: mergedHealthProfile,
          updatedAt: update.updatedAt,
        },
      }
    );

    return NextResponse.json({
      success: true,
      user: {
        id: session.userId,
        name: existing.name,
        email: existing.email,
        healthProfile: mergedHealthProfile,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile. Please try again.' }, { status: 500 });
  }
}
