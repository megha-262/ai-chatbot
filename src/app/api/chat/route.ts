import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@google/genai';
import { getChatCollection, getConversationCollection } from '@/lib/mongodb';
import { ChatMessage, Conversation, ChatRequest, ChatResponse } from '@/lib/models';
import { ObjectId } from 'mongodb';
import { SupportedLanguage, LANGUAGE_NAMES } from '@/lib/i18n';
import { getSessionUser } from '@/lib/auth';
import { getGenAI, GEMINI_MODEL } from '@/lib/gemini';

// Carries an HTTP status alongside a client-safe message so the catch block
// can respond appropriately instead of collapsing every failure into a 500.
class ChatApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function titleFromMessage(message: string): string {
  const trimmed = message.trim().replace(/\s+/g, ' ');
  return trimmed.length > 60 ? `${trimmed.slice(0, 60)}…` : trimmed;
}

export async function POST(request: NextRequest) {
  try {
    let body: ChatRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body: expected JSON' },
        { status: 400 }
      );
    }

    const { message, conversationId, sessionId, language } = body;
    const chatLanguage: SupportedLanguage = language === 'hi' ? 'hi' : 'en';

    if (!message || !message.trim() || !sessionId) {
      return NextResponse.json(
        { error: 'A non-empty message and sessionId are required' },
        { status: 400 }
      );
    }

    // The authenticated user is derived only from the verified session
    // cookie — never from a userId in the request body.
    const session = await getSessionUser();
    if (!session) {
      throw new ChatApiError('Please log in to use the chat.', 401);
    }

    let chatCollection, conversationCollection;
    try {
      chatCollection = await getChatCollection();
      conversationCollection = await getConversationCollection();
    } catch (err) {
      console.error('MongoDB connection error:', err);
      throw new ChatApiError('Unable to connect to the database. Please check the MongoDB configuration.', 503);
    }

    // Get or create conversation, scoped to the authenticated user
    let currentConversationId = conversationId;

    if (conversationId) {
      let existingConversation;
      try {
        existingConversation = await conversationCollection.findOne({
          _id: new ObjectId(conversationId)
        });
      } catch {
        throw new ChatApiError('Invalid conversation ID.', 400);
      }

      if (existingConversation && existingConversation.userId !== session.userId) {
        // Don't reveal whether the conversation exists — just deny access.
        throw new ChatApiError('You do not have access to this conversation.', 403);
      }

      if (existingConversation && !existingConversation.isActive) {
        // Deleted conversations stay deleted — don't allow posting into them.
        throw new ChatApiError('This conversation has been deleted.', 404);
      }

      if (!existingConversation) {
        // Create new conversation if not found
        const newConversation: Conversation = {
          userId: session.userId,
          sessionId,
          title: titleFromMessage(message),
          createdAt: new Date(),
          updatedAt: new Date(),
          messageCount: 0,
          isActive: true
        };

        const result = await conversationCollection.insertOne(newConversation);
        currentConversationId = result.insertedId.toString();
      }
    } else {
      // Create new conversation
      const newConversation: Conversation = {
        userId: session.userId,
        sessionId,
        title: titleFromMessage(message),
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 0,
        isActive: true
      };

      const result = await conversationCollection.insertOne(newConversation);
      currentConversationId = result.insertedId.toString();
    }

    // Store user message
    const userMessage: ChatMessage = {
      conversationId: currentConversationId!,
      userId: session.userId,
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    await chatCollection.insertOne(userMessage);

    // Get last 5 messages for context
    const recentMessages = await chatCollection
      .find({ conversationId: currentConversationId })
      .sort({ timestamp: -1 })
      .limit(10) // Get 10 to have 5 pairs (user + assistant)
      .toArray();

    // Reverse to get chronological order
    recentMessages.reverse();

    // Build context for Gemini
    const contextMessages = recentMessages
      .slice(-10) // Last 5 exchanges (10 messages)
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    // Health-focused system prompt
    const systemPrompt = `You are a helpful AI public-health assistant. You provide general health information, wellness tips, and guidance.

IMPORTANT DISCLAIMERS:
- You are NOT a replacement for professional medical advice and must not claim to diagnose medical conditions
- Always recommend consulting a healthcare professional for personal or serious concerns
- Do not prescribe medications or exact dosages
- Only state health information that is well-established and evidence-based; if you are unsure of a fact, say so instead of guessing or inventing one
- If the user describes symptoms that could indicate a medical emergency (e.g. chest pain, difficulty breathing, severe bleeding, stroke symptoms, suicidal thoughts), clearly and prominently flag it as an emergency and urge them to call emergency services or go to the nearest emergency room immediately, before anything else

Your responses should be:
- Informative and helpful
- Empathetic and supportive
- Clear about your limitations
- Focused on general wellness and health education

LANGUAGE: Respond entirely in ${LANGUAGE_NAMES[chatLanguage]}${chatLanguage === 'hi' ? ' (Devanagari script). Keep medical terminology simple and easy to understand for a general audience.' : '.'}

Previous conversation context:
${contextMessages}

Current user message: ${message}

Please provide a helpful, informative response while maintaining appropriate medical disclaimers.`;

    // Get response from Gemini
    const startTime = Date.now();

    let aiResponse: string | undefined;
    try {
      const result = await getGenAI().models.generateContent({
        model: GEMINI_MODEL,
        contents: systemPrompt,
      });
      aiResponse = result.text;
    } catch (err) {
      if (err instanceof ChatApiError) throw err;

      if (err instanceof ApiError) {
        if (err.status === 429) {
          throw new ChatApiError('Gemini API rate limit reached. Please wait a moment and try again.', 429);
        }
        if (err.status === 400 || err.status === 401 || err.status === 403) {
          throw new ChatApiError('Gemini API rejected the request (invalid API key or request).', 502);
        }
        throw new ChatApiError(`Gemini API request failed: ${err.message}`, 502);
      }

      throw new ChatApiError('Failed to reach the Gemini API.', 502);
    }

    if (!aiResponse || !aiResponse.trim()) {
      throw new ChatApiError('Gemini returned an empty response. Please try again.', 502);
    }

    const processingTime = Date.now() - startTime;

    // Store AI response
    const assistantMessage: ChatMessage = {
      conversationId: currentConversationId!,
      userId: session.userId,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      metadata: {
        model: GEMINI_MODEL,
        processingTime
      }
    };

    await chatCollection.insertOne(assistantMessage);

    // Update conversation
    await conversationCollection.updateOne(
      { _id: new ObjectId(currentConversationId!) },
      {
        $set: { updatedAt: new Date() },
        $inc: { messageCount: 2 } // User message + AI response
      }
    );

    const chatResponse: ChatResponse = {
      message: aiResponse,
      conversationId: currentConversationId!,
      timestamp: new Date(),
      success: true
    };

    return NextResponse.json(chatResponse);

  } catch (error) {
    console.error('Chat API error:', error);

    const status = error instanceof ChatApiError ? error.status : 500;

    // ChatApiError messages are curated to be client-safe (rate limit, DB
    // down, Gemini rejected, etc.) and should reach the chat UI as-is.
    // Anything else (e.g. raw MongoDB driver errors) may contain internal
    // details like hostnames, so it stays in the server log behind a
    // generic message and is never sent to the browser.
    const userMessage =
      error instanceof ChatApiError
        ? error.message
        : "I apologize, but I encountered an error processing your request. Please try again. If this is a medical emergency, please call your local emergency number immediately.";

    const errorResponse: ChatResponse = {
      message: userMessage,
      conversationId: '',
      timestamp: new Date(),
      success: false,
      error: error instanceof ChatApiError ? error.message : 'Internal server error'
    };

    return NextResponse.json(errorResponse, { status });
  }
}

// GET endpoint to retrieve chat history — always scoped to the authenticated
// user, derived from the session cookie (never from a client-supplied userId).
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const sessionId = searchParams.get('sessionId');

    let chatCollection, conversationCollection;
    try {
      chatCollection = await getChatCollection();
      conversationCollection = await getConversationCollection();
    } catch (err) {
      console.error('MongoDB connection error:', err);
      return NextResponse.json(
        { error: 'Unable to connect to the database. Please check the MongoDB configuration.' },
        { status: 503 }
      );
    }

    if (conversationId) {
      let conversation;
      try {
        conversation = await conversationCollection.findOne({ _id: new ObjectId(conversationId) });
      } catch {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }

      // Same "not found" response whether it doesn't exist, belongs to
      // someone else, or was deleted — don't leak which one it is.
      if (!conversation || conversation.userId !== session.userId || !conversation.isActive) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }

      const messages = await chatCollection
        .find({ conversationId })
        .sort({ timestamp: 1 })
        .toArray();

      return NextResponse.json({ messages, conversationId });
    }

    // No conversationId: list conversations belonging to the authenticated
    // user, optionally narrowed to a specific client sessionId.
    const query: { userId: string; isActive: boolean; sessionId?: string } = {
      userId: session.userId,
      isActive: true,
    };
    if (sessionId) query.sessionId = sessionId;

    const conversations = await conversationCollection
      .find(query)
      .sort({ updatedAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ conversations });

  } catch (error) {
    console.error('Chat history API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve chat history' },
      { status: 500 }
    );
  }
}