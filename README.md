# HealthBot AI - AI-Powered Public Health Chatbot

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6-green)](https://www.mongodb.com/)
[![Google AI](https://img.shields.io/badge/Google_AI-Gemini-orange)](https://ai.google.dev/)

## 🌟 Overview

HealthBot AI is a comprehensive, AI-powered public health chatbot designed to provide 24/7 health guidance, emergency assistance, and personalized health management. Built with modern web technologies, it offers multilingual support, voice interaction, and verified medical information to make healthcare accessible to everyone.

## ✨ Key Features

### 🤖 AI-Powered Health Assistant
- **Advanced AI**: Powered by Google's Gemini AI for intelligent health conversations
- **Multilingual Support**: Communicate in 50+ languages with culturally-aware responses
- **Symptom Analysis**: AI-powered symptom checker with verified medical database
- **Myth Busting**: Combat health misinformation with fact-checked information

### 🚨 Emergency Support
- **One-Click Emergency Calls**: Instant connection to local emergency services
- **Global Emergency Directory**: Worldwide emergency contacts with location detection
- **CPR Guides**: Step-by-step CPR instructions with visual aids
- **Critical Symptom Checker**: Immediate assessment of life-threatening symptoms
- **First Aid Information**: Basic first aid instructions for common emergencies

### 🎤 Advanced Voice Mode
- **Speech-to-Text**: Natural voice input in multiple languages
- **Text-to-Speech**: Audio responses with natural voice synthesis
- **Hands-Free Operation**: Complete voice-controlled health assistance

### 📊 Personal Health Management
- **Health Dashboard**: Comprehensive health metrics tracking
- **Health Diary**: Track symptoms, mood, and health metrics over time
- **Medicine Reminders**: Smart medication alerts and adherence tracking
- **Health Challenges**: Gamified wellness goals and achievement system
- **Progress Tracking**: Visual health trend analysis and reporting

### 🔒 Privacy & Security
- **HIPAA Compliant**: Follows healthcare privacy regulations
- **End-to-End Encryption**: Secure conversation storage
- **Data Control**: User-controlled data management and deletion

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Next.js API Routes with serverless functions
- **Database**: MongoDB for conversation and user data storage
- **AI Engine**: Google Generative AI (Gemini)
- **Styling**: Tailwind CSS with dark mode support
- **Deployment**: Vercel-ready configuration

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── about/             # About page
│   ├── api/               # API routes
│   │   └── chat/          # Chat API endpoint
│   ├── chat/              # Chat interface
│   ├── dashboard/         # Health dashboard
│   ├── emergency/         # Emergency assistance
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── Footer.tsx         # Footer component
│   └── Navigation.tsx     # Navigation component
└── lib/                   # Utilities and configurations
    ├── models.ts          # TypeScript interfaces
    └── mongodb.ts         # Database connection
```

## 🔌 API Documentation

### Chat API Endpoint

#### `POST /api/chat`
Creates a new chat message and generates an AI response.

**Request Body:**
```typescript
{
  message: string;           // User's message
  conversationId?: string;   // Optional conversation ID
  sessionId: string;         // Session identifier
}
```

**Response:**
```typescript
{
  message: string;           // AI response
  conversationId: string;    // Conversation ID
  timestamp: string;         // ISO timestamp
  success: boolean;          // Request success status
  error?: string;           // Error message if failed
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have a headache and feel nauseous",
    "sessionId": "session_123456"
  }'
```

**Example Response:**
```json
{
  "message": "I understand you're experiencing a headache and nausea. These symptoms can have various causes...",
  "conversationId": "conv_789012",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "success": true
}
```

#### `GET /api/chat`
Retrieves chat history for a session or conversation.

**Query Parameters:**
- `sessionId`: Session identifier (optional)
- `conversationId`: Conversation identifier (optional)

**Response:**
```typescript
{
  conversations?: Conversation[];  // List of conversations
  messages?: ChatMessage[];       // List of messages
  success: boolean;
  error?: string;
}
```

### Data Models

#### ChatMessage Interface
```typescript
interface ChatMessage {
  _id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  conversationId: string;
  sessionId: string;
  metadata?: {
    urgency?: 'low' | 'medium' | 'high' | 'emergency';
    category?: string;
    language?: string;
  };
}
```

#### Conversation Interface
```typescript
interface Conversation {
  _id: string;
  sessionId: string;
  userId?: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  tags?: string[];
  summary?: string;
}
```

#### User Interface
```typescript
interface User {
  _id: string;
  sessionId: string;
  preferences?: {
    language?: string;
    notifications?: boolean;
    darkMode?: boolean;
  };
  healthProfile?: {
    age?: number;
    gender?: string;
    conditions?: string[];
    medications?: string[];
    allergies?: string[];
  };
  createdAt: Date;
  lastActive: Date;
}
```

#### HealthContext Interface
```typescript
interface HealthContext {
  symptoms?: string[];
  duration?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  previousConditions?: string[];
  currentMedications?: string[];
  allergies?: string[];
  emergencyContact?: string;
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB database
- Google AI API key

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/ai-chatbot.git
cd ai-chatbot
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables:**
Create a `.env.local` file in the root directory:
```env
# Google AI Configuration
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/healthbot
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthbot

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Optional: Additional API Keys
OPENAI_API_KEY=your_openai_api_key_here
```

4. **Set up the database:**
```bash
# Start MongoDB locally (if using local installation)
mongod

# The application will automatically create collections on first run
```

5. **Run the development server:**
```bash
npm run dev
# or
yarn dev
```

6. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment

#### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

#### Deploy to Other Platforms
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GOOGLE_AI_API_KEY` | Google AI API key for Gemini | Yes | - |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Yes | - |
| `NEXTAUTH_URL` | Application URL | Yes | http://localhost:3000 |

### Database Configuration

The application uses MongoDB with the following collections:
- `chats`: Stores chat messages
- `conversations`: Stores conversation metadata
- `users`: Stores user profiles and preferences

### AI Configuration

The chatbot uses Google's Gemini AI with a specialized health-focused system prompt that:
- Provides evidence-based medical information
- Emphasizes the importance of professional medical care
- Handles emergency situations appropriately
- Maintains user privacy and confidentiality

## 📱 Features Deep Dive

### Chat Interface
- Real-time messaging with typing indicators
- Message history persistence
- Quick action buttons for common health topics
- Responsive design for mobile and desktop
- Dark mode support

### Emergency Features
- Global emergency contact directory
- Location-based emergency service finder
- CPR and first aid instructions
- Critical symptom recognition
- One-click emergency calling

### Health Dashboard
- Health metrics tracking (blood pressure, heart rate, weight, sleep)
- Chat history with categorization
- Health goals and progress tracking
- Quick stats overview
- Exportable health reports

### Voice Mode
- Speech recognition for hands-free input
- Text-to-speech for audio responses
- Multi-language voice support
- Accessibility features for visually impaired users

## 🛡️ Security & Privacy

### Data Protection
- All conversations are encrypted at rest
- No personal health information is shared with third parties
- HIPAA-compliant data handling practices
- User-controlled data retention and deletion

### Security Measures
- Input sanitization and validation
- Rate limiting on API endpoints
- Secure session management
- Regular security audits and updates

## 🧪 Testing

### Running Tests
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### Test Structure
```
tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
├── e2e/              # End-to-end tests
└── fixtures/         # Test data
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## 🙏 Acknowledgments

- Google AI for providing the Gemini API
- MongoDB for database services
- Vercel for hosting and deployment
- The open-source community for various libraries and tools

## ⚠️ Medical Disclaimer

**IMPORTANT**: This AI health chatbot is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read or received from this chatbot.

In case of a medical emergency, immediately call your local emergency services (911 in the US) or go to the nearest emergency room.

## 📞 Support

For technical support or questions:
- Create an issue on GitHub
- Email: support@healthbot-ai.com
- Documentation: [docs.healthbot-ai.com](https://docs.healthbot-ai.com)

---

**Built with ❤️ for global health accessibility**