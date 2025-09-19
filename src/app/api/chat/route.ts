import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getChatCollection, getConversationCollection } from '@/lib/mongodb';
import { ChatMessage, Conversation, ChatRequest, ChatResponse } from '@/lib/models';
import { ObjectId } from 'mongodb';

// Initialize Gemini AI
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, conversationId, sessionId } = body;

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      );
    }

    const chatCollection = await getChatCollection();
    const conversationCollection = await getConversationCollection();

    // Get or create conversation
    let currentConversationId = conversationId;

    if (conversationId) {
      const existingConversation = await conversationCollection.findOne({
        _id: new ObjectId(conversationId)
      });
      
      if (!existingConversation) {
        // Create new conversation if not found
        const newConversation: Conversation = {
          sessionId,
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
        sessionId,
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
    const systemPrompt = `You are a helpful AI health assistant. You provide general health information, wellness tips, and guidance. 

IMPORTANT DISCLAIMERS:
- You are NOT a replacement for professional medical advice
- Always recommend consulting healthcare professionals for serious concerns
- Do not diagnose medical conditions
- Do not prescribe medications
- In emergencies, advise calling emergency services immediately

Your responses should be:
- Informative and helpful
- Empathetic and supportive
- Clear about limitations
- Focused on general wellness and health education

Previous conversation context:
${contextMessages}

Current user message: ${message}

Please provide a helpful, informative response while maintaining appropriate medical disclaimers.`;

    // Get response from Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const startTime = Date.now();
    
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const aiResponse = response.text();
    
    const processingTime = Date.now() - startTime;

    // Store AI response
    const assistantMessage: ChatMessage = {
      conversationId: currentConversationId!,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      metadata: {
        model: 'gemini-pro',
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
    
    const errorResponse: ChatResponse = {
      message: 'I apologize, but I encountered an error processing your request. Please try again.',
      conversationId: '',
      timestamp: new Date(),
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// GET endpoint to retrieve chat history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const sessionId = searchParams.get('sessionId');

    if (!conversationId && !sessionId) {
      return NextResponse.json(
        { error: 'Either conversationId or sessionId is required' },
        { status: 400 }
      );
    }

    const chatCollection = await getChatCollection();
    const conversationCollection = await getConversationCollection();

    if (conversationId) {
      // Get messages for specific conversation
      const messages = await chatCollection
        .find({ conversationId })
        .sort({ timestamp: 1 })
        .toArray();

      return NextResponse.json({ messages, conversationId });
    } else if (sessionId) {
      // Get all conversations for session
      const conversations = await conversationCollection
        .find({ sessionId, isActive: true })
        .sort({ updatedAt: -1 })
        .toArray();

      return NextResponse.json({ conversations });
    }

  } catch (error) {
    console.error('Chat history API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve chat history' },
      { status: 500 }
    );
  }
}