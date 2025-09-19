import { ObjectId } from 'mongodb';

// Chat message interface
export interface ChatMessage {
  _id?: ObjectId;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    processingTime?: number;
  };
}

// Conversation interface
export interface Conversation {
  _id?: ObjectId;
  userId?: string;
  sessionId: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  isActive: boolean;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    location?: string;
  };
}

// User interface (for future user management)
export interface User {
  _id?: ObjectId;
  email?: string;
  name?: string;
  createdAt: Date;
  lastActive: Date;
  preferences?: {
    language?: string;
    timezone?: string;
    notifications?: boolean;
  };
}

// Chat request/response types for API
export interface ChatRequest {
  message: string;
  conversationId?: string;
  sessionId: string;
}

export interface ChatResponse {
  message: string;
  conversationId: string;
  timestamp: Date;
  success: boolean;
  error?: string;
}

// Health-specific message types
export interface HealthContext {
  symptoms?: string[];
  medicalHistory?: string[];
  currentMedications?: string[];
  allergies?: string[];
  age?: number;
  gender?: string;
}

export interface HealthChatMessage extends ChatMessage {
  healthContext?: HealthContext;
  urgencyLevel?: 'low' | 'medium' | 'high' | 'emergency';
  categories?: string[];
}