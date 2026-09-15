'use client';

import { useState, useEffect, useRef } from 'react';
import { chatTranslations, SupportedLanguage } from '@/lib/i18n';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'emergency' | 'warning';
}

interface ChatResponse {
  message: string;
  conversationId: string;
  timestamp: string;
  success: boolean;
  error?: string;
}

interface ApiMessage {
  _id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

interface ConversationSummary {
  _id: string;
  title?: string;
  updatedAt: string;
  messageCount: number;
}

const WELCOME_ID = '1';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [sessionId] = useState<string>(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const t = chatTranslations[language];

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isConversationLoading, setIsConversationLoading] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [micStatus, setMicStatus] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    setSpeechSupported(typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition));

    const storedLanguage = window.localStorage.getItem('healthbot-language');
    const initialLanguage: SupportedLanguage = storedLanguage === 'hi' ? 'hi' : 'en';
    setLanguage(initialLanguage);

    setMessages([
      {
        id: '1',
        content: chatTranslations[initialLanguage].welcomeMessage,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      }
    ]);

    // Stop any in-progress recognition if the user navigates away.
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleLanguageChange = (nextLanguage: SupportedLanguage) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem('healthbot-language', nextLanguage);

    // Swap the welcome message in place if the conversation hasn't started yet
    setMessages(prev =>
      prev.length === 1 && prev[0].id === '1'
        ? [{ ...prev[0], content: chatTranslations[nextLanguage].welcomeMessage }]
        : prev
    );
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const startListening = () => {
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setMicStatus(t.micUnsupported);
      return;
    }

    setMicStatus('');
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0]?.transcript ?? '';
      }
      transcript = transcript.trim();
      if (transcript) {
        // Append rather than replace, so speaking doesn't wipe out anything
        // the user had already typed — they can still edit before sending.
        setInputMessage((prev) => (prev.trim() ? `${prev.trim()} ${transcript}` : transcript));
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setMicStatus(t.micPermissionDenied);
      } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setMicStatus(t.micError);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };


  // Load the signed-in user's conversation list for the sidebar. Doesn't
  // auto-open anything — the user picks a conversation explicitly.
  const loadConversations = async () => {
    setHistoryError('');
    try {
      const response = await fetch('/api/chat');
      const data = await response.json();
      if (!response.ok) {
        setHistoryError(data.error || 'Failed to load chat history');
        return;
      }
      setConversations(data.conversations ?? []);
    } catch {
      setHistoryError('Unable to load chat history. Please check your connection.');
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const startNewChat = () => {
    setConversationId('');
    setMessages([
      {
        id: WELCOME_ID,
        content: t.welcomeMessage,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      }
    ]);
    setIsSidebarOpen(false);
  };

  const openConversation = async (id: string) => {
    if (id === conversationId) {
      setIsSidebarOpen(false);
      return;
    }
    setIsConversationLoading(true);
    try {
      const response = await fetch(`/api/chat?conversationId=${id}`);
      const data = await response.json();
      if (!response.ok) {
        setHistoryError(data.error || 'Failed to open this conversation');
        return;
      }
      const loadedMessages: Message[] = (data.messages ?? []).map((msg: ApiMessage) => ({
        id: msg._id,
        content: msg.content,
        sender: msg.role === 'user' ? 'user' : 'bot',
        timestamp: new Date(msg.timestamp),
        type: 'text'
      }));
      setConversationId(id);
      setMessages(loadedMessages);
      setIsSidebarOpen(false);
    } catch {
      setHistoryError('Unable to open this conversation. Please check your connection.');
    } finally {
      setIsConversationLoading(false);
    }
  };

  const deleteConversation = async (id: string) => {
    if (!window.confirm('Delete this conversation? This cannot be undone.')) return;
    try {
      const response = await fetch(`/api/chat/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) {
        setHistoryError(data.error || 'Failed to delete conversation');
        return;
      }
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (id === conversationId) {
        startNewChat();
      }
    } catch {
      setHistoryError('Unable to delete this conversation. Please check your connection.');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          conversationId: conversationId || undefined,
          sessionId: sessionId,
          language,
        }),
      });

      // The API always returns a JSON body shaped like ChatResponse, even on
      // 429/502/503 — parse it before checking response.ok so the specific,
      // user-facing message it already crafted isn't thrown away.
      const data: ChatResponse = await response.json();

      if (data.success) {
        // Update conversation ID if this is the first message
        if (!conversationId && data.conversationId) {
          setConversationId(data.conversationId);
        }
        // Refresh the sidebar so a new conversation (or its updated title/
        // timestamp) shows up.
        loadConversations();

        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message,
          sender: 'bot',
          timestamp: new Date(data.timestamp),
          type: 'text'
        };

        setMessages(prev => [...prev, botResponse]);
      } else {
        console.error('Chat API returned an error:', data.error);

        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message || t.connectionError,
          sender: 'bot',
          timestamp: new Date(),
          type: 'warning'
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      // Only truly unexpected failures land here: network errors, or a
      // response body that wasn't valid JSON at all.
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: t.connectionError,
        sender: 'bot',
        timestamp: new Date(),
        type: 'warning'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    if (!isClient) return '';
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = t.quickActions;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{t.title}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">{t.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen((open) => !open)}
                className="lg:hidden inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                History
              </button>
              <div className="flex items-center rounded-full border border-gray-200 dark:border-gray-700 p-0.5" role="group" aria-label={t.languageLabel}>
                {(['en', 'hi'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      language === lang
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    {lang === 'en' ? 'English' : 'हिंदी'}
                  </button>
                ))}
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                {t.online}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chat History Sidebar */}
          <aside className={`lg:w-72 flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:sticky lg:top-24">
              <button
                onClick={startNewChat}
                className="w-full mb-4 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                + New Chat
              </button>

              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Chat History
              </h2>

              {historyError && (
                <p className="text-xs text-red-600 dark:text-red-400 mb-2">{historyError}</p>
              )}

              {isHistoryLoading ? (
                <div className="flex justify-center py-4">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : conversations.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No conversations yet.</p>
              ) : (
                <ul className="space-y-1 max-h-[420px] overflow-y-auto">
                  {conversations.map((conv) => (
                    <li key={conv._id} className="group flex items-center gap-1">
                      <button
                        onClick={() => openConversation(conv._id)}
                        className={`flex-1 min-w-0 text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          conv._id === conversationId
                            ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="block truncate">{conv.title || 'Conversation'}</span>
                        <span className="block text-xs text-gray-400 dark:text-gray-500">
                          {new Date(conv.updatedAt).toLocaleDateString()}
                        </span>
                      </button>
                      <button
                        onClick={() => deleteConversation(conv._id)}
                        aria-label="Delete conversation"
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
        {/* Quick Actions */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(action.text)}
                className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="mr-2">{action.icon}</span>
                {action.text}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[600px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isConversationLoading && (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {!isConversationLoading && messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t.inputPlaceholder}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  rows={2}
                />
              </div>
              <button
                type="button"
                onClick={toggleListening}
                disabled={!speechSupported}
                title={!speechSupported ? t.micUnsupported : isListening ? t.micListening : undefined}
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                className={`px-4 py-2 rounded-lg border transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed ${
                  isListening
                    ? 'bg-red-600 text-white border-red-600 animate-pulse'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {isListening ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>

            {(isListening || micStatus) && (
              <div className={`mt-2 text-xs ${micStatus ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                {isListening ? t.micListening : micStatus}
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              {t.disclaimer}
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}