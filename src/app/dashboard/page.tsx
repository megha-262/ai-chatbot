'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface HealthMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: 'good' | 'warning' | 'danger';
  lastUpdated: string;
  icon: string;
}

interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

interface ConversationSummary {
  _id: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'history' | 'goals'>('overview');
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((res) => res.json()),
      fetch('/api/chat').then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load chat data');
        return data;
      }),
    ])
      .then(([authData, chatData]) => {
        setUser(authData.user ?? null);
        setConversations(chatData.conversations ?? []);
      })
      .catch((err) => setLoadError(err.message || 'Failed to load dashboard data'))
      .finally(() => setIsLoading(false));
  }, []);

  const healthMetrics: HealthMetric[] = [
    {
      id: '1',
      name: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      status: 'good',
      lastUpdated: '2 hours ago',
      icon: '❤️'
    },
    {
      id: '2',
      name: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      status: 'good',
      lastUpdated: '2 hours ago',
      icon: '💓'
    },
    {
      id: '3',
      name: 'Weight',
      value: '150',
      unit: 'lbs',
      status: 'good',
      lastUpdated: '1 day ago',
      icon: '⚖️'
    },
    {
      id: '4',
      name: 'Sleep',
      value: '6.5',
      unit: 'hours',
      status: 'warning',
      lastUpdated: 'Last night',
      icon: '😴'
    }
  ];

  const healthGoals = [
    { id: '1', goal: 'Drink 8 glasses of water daily', progress: 75, target: 100 },
    { id: '2', goal: 'Exercise 30 minutes, 5 times a week', progress: 60, target: 100 },
    { id: '3', goal: 'Get 8 hours of sleep nightly', progress: 40, target: 100 },
    { id: '4', goal: 'Take daily vitamins', progress: 90, target: 100 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'danger': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  const totalMessages = conversations.reduce((sum, c) => sum + c.messageCount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadError && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
            {loadError}
          </div>
        )}
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {user ? `Welcome back, ${user.name}` : 'Health Dashboard'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {user ? user.email : 'Track your health metrics, chat history, and wellness goals'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Chats</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{conversations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Health Score</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">85/100</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Goals Completed</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">3/4</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Messages</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalMessages}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'metrics', name: 'Health Metrics', icon: '📈' },
                { id: 'history', name: 'Chat History', icon: '💬' },
                { id: 'goals', name: 'Health Goals', icon: '🎯' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'metrics' | 'history' | 'goals')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Health Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Health Metrics</h3>
              <div className="space-y-4">
                {healthMetrics.slice(0, 3).map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{metric.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{metric.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{metric.lastUpdated}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">{metric.value} {metric.unit}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(metric.status)}`}>
                        {metric.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Chat Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Chat Activity</h3>
              {conversations.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No conversations yet — start a chat to see it here.</p>
              ) : (
                <div className="space-y-4">
                  {conversations.slice(0, 3).map((conv) => (
                    <div key={conv._id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900 dark:text-white">Conversation</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{conv.messageCount} messages</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(conv.updatedAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthMetrics.map((metric) => (
              <div key={metric.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{metric.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{metric.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: {metric.lastUpdated}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                  <p className="text-gray-600 dark:text-gray-300">{metric.unit}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chat History</h3>
            </div>
            {conversations.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 dark:text-gray-400">No conversations yet — start a chat to see your history here.</p>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {conversations.map((conv) => (
                  <div key={conv._id} className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">Conversation</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(conv.updatedAt)}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{conv.messageCount} messages</p>
                    <Link href="/chat" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                      Continue conversation →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {healthGoals.map((goal) => (
              <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{goal.goal}</h3>
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Progress: {goal.progress}/{goal.target}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
            Quick Access
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/chat" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Start New Chat
            </Link>
            <Link href="/profile" className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>
            <Link href="/health-tools?tab=symptoms" className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Symptom Checker
            </Link>
            <Link href="/health-tools?tab=medicine" className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Medicine Information
            </Link>
            <Link href="/emergency" className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Emergency Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}