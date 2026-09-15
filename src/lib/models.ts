import { ObjectId } from 'mongodb';

// Chat message interface
export interface ChatMessage {
  _id?: ObjectId;
  conversationId: string;
  userId?: string;
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
  userId: string;
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

// Optional, non-sensitive health profile fields a user may choose to add
export interface HealthProfile {
  age?: number;
  gender?: string;
  bloodGroup?: string;
  preferences?: {
    notifications?: boolean;
  };
}

// User interface (authentication)
export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  healthProfile?: HealthProfile;
}

// User data safe to send to the client — never includes passwordHash
export interface SafeUser {
  id: string;
  name: string;
  email: string;
  healthProfile?: HealthProfile;
}

// Chat request/response types for API
export interface ChatRequest {
  message: string;
  conversationId?: string;
  sessionId: string;
  language?: 'en' | 'hi';
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