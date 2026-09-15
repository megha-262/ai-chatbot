import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getConversationCollection } from '@/lib/mongodb';
import { getSessionUser } from '@/lib/auth';

// Soft-deletes a conversation (isActive: false) so it stops showing up in
// history — consistent with the isActive filter already used by GET /api/chat.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { conversationId } = await params;

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(conversationId);
    } catch {
      return NextResponse.json({ error: 'Invalid conversation ID' }, { status: 400 });
    }

    let conversationCollection;
    try {
      conversationCollection = await getConversationCollection();
    } catch (err) {
      console.error('MongoDB connection error:', err);
      return NextResponse.json(
        { error: 'Unable to connect to the database. Please check the MongoDB configuration.' },
        { status: 503 }
      );
    }

    const conversation = await conversationCollection.findOne({ _id: objectId });

    // Same "not found" response whether it doesn't exist or belongs to
    // someone else — don't leak which one it is.
    if (!conversation || conversation.userId !== session.userId) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    await conversationCollection.updateOne(
      { _id: objectId },
      { $set: { isActive: false, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete conversation error:', error);
    return NextResponse.json({ error: 'Failed to delete the conversation. Please try again.' }, { status: 500 });
  }
}
