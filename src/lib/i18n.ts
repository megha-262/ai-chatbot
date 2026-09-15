export type SupportedLanguage = 'en' | 'hi';

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  hi: 'Hindi',
};

export interface QuickAction {
  text: string;
  icon: string;
}

interface ChatTranslation {
  title: string;
  subtitle: string;
  online: string;
  welcomeMessage: string;
  quickActions: QuickAction[];
  inputPlaceholder: string;
  disclaimer: string;
  connectionError: string;
  languageLabel: string;
  micListening: string;
  micPermissionDenied: string;
  micUnsupported: string;
  micError: string;
}

export const chatTranslations: Record<SupportedLanguage, ChatTranslation> = {
  en: {
    title: 'HealthBot AI',
    subtitle: 'Your AI Health Companion',
    online: 'Online',
    welcomeMessage:
      "Hello! I'm HealthBot AI, your 24/7 health companion. I can help you with health questions, symptom analysis, and provide verified medical information. How can I assist you today?",
    quickActions: [
      { text: 'Symptom checker', icon: '🔍' },
      { text: 'Emergency help', icon: '🚨' },
      { text: 'Medication info', icon: '💊' },
      { text: 'Mental health', icon: '🧠' },
    ],
    inputPlaceholder: 'Type your health question here...',
    disclaimer:
      '⚠️ This AI provides general health information only. For medical emergencies, call 911. Always consult healthcare professionals for medical advice.',
    connectionError:
      "I apologize, but I'm having trouble connecting right now. Please try again in a moment. If this is a medical emergency, please call 911 immediately.",
    languageLabel: 'Language',
    micListening: 'Listening...',
    micPermissionDenied: 'Microphone permission denied. Please allow microphone access in your browser settings.',
    micUnsupported: 'Speech recognition is not supported in this browser.',
    micError: 'Could not recognize speech. Please try again.',
  },
  hi: {
    title: 'हेल्थबॉट AI',
    subtitle: 'आपका AI स्वास्थ्य सहायक',
    online: 'ऑनलाइन',
    welcomeMessage:
      'नमस्ते! मैं हेल्थबॉट AI हूँ, आपका 24/7 स्वास्थ्य सहायक। मैं आपके स्वास्थ्य संबंधी सवालों, लक्षणों के विश्लेषण में मदद कर सकता हूँ और सत्यापित चिकित्सा जानकारी प्रदान कर सकता हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?',
    quickActions: [
      { text: 'लक्षण जाँचें', icon: '🔍' },
      { text: 'आपातकालीन मदद', icon: '🚨' },
      { text: 'दवा की जानकारी', icon: '💊' },
      { text: 'मानसिक स्वास्थ्य', icon: '🧠' },
    ],
    inputPlaceholder: 'यहाँ अपना स्वास्थ्य संबंधी सवाल लिखें...',
    disclaimer:
      '⚠️ यह AI केवल सामान्य स्वास्थ्य जानकारी प्रदान करता है। चिकित्सा आपातकाल की स्थिति में 911 पर कॉल करें। चिकित्सा सलाह के लिए हमेशा स्वास्थ्य विशेषज्ञ से परामर्श करें।',
    connectionError:
      'क्षमा करें, अभी कनेक्ट करने में समस्या हो रही है। कृपया कुछ देर बाद फिर से प्रयास करें। यदि यह एक चिकित्सा आपातकाल है, तो कृपया तुरंत 911 पर कॉल करें।',
    languageLabel: 'भाषा',
    micListening: 'सुन रहा हूँ...',
    micPermissionDenied: 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया अपनी ब्राउज़र सेटिंग्स में माइक्रोफ़ोन एक्सेस की अनुमति दें।',
    micUnsupported: 'इस ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है।',
    micError: 'आवाज़ पहचानी नहीं जा सकी। कृपया पुनः प्रयास करें।',
  },
};
