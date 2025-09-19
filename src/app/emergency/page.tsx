'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function EmergencyPage() {
  const [location, setLocation] = useState('');

  const emergencyContacts = [
    {
      service: "Emergency Services",
      number: "911",
      description: "Police, Fire, Medical Emergency",
      icon: "🚨",
      color: "bg-red-600 hover:bg-red-700"
    },
    {
      service: "Poison Control",
      number: "1-800-222-1222",
      description: "24/7 Poison Emergency Hotline",
      icon: "☠️",
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      service: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Mental Health Crisis Support",
      icon: "💭",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      service: "National Suicide Prevention",
      number: "988",
      description: "Suicide & Crisis Lifeline",
      icon: "🤝",
      color: "bg-green-600 hover:bg-green-700"
    }
  ];

  const emergencySymptoms = [
    {
      category: "Heart Attack",
      symptoms: ["Chest pain or pressure", "Shortness of breath", "Pain in arm, neck, or jaw", "Nausea or sweating"],
      action: "Call 911 immediately"
    },
    {
      category: "Stroke",
      symptoms: ["Sudden numbness or weakness", "Confusion or trouble speaking", "Severe headache", "Loss of balance"],
      action: "Call 911 immediately"
    },
    {
      category: "Severe Allergic Reaction",
      symptoms: ["Difficulty breathing", "Swelling of face/throat", "Rapid pulse", "Dizziness or fainting"],
      action: "Use EpiPen if available, call 911"
    },
    {
      category: "Severe Bleeding",
      symptoms: ["Uncontrolled bleeding", "Deep wounds", "Signs of shock", "Loss of consciousness"],
      action: "Apply pressure, call 911"
    }
  ];

  const firstAidTips = [
    {
      title: "CPR Basics",
      steps: [
        "Check responsiveness and breathing",
        "Call 911 or have someone else call",
        "Place hands on center of chest",
        "Push hard and fast at least 2 inches deep",
        "Allow complete chest recoil between compressions",
        "Give 30 compressions, then 2 rescue breaths"
      ]
    },
    {
      title: "Choking (Heimlich Maneuver)",
      steps: [
        "Stand behind the person",
        "Place arms around their waist",
        "Make a fist above the navel",
        "Grasp fist with other hand",
        "Give quick upward thrusts",
        "Continue until object is expelled"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-red-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">Emergency Assistance</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            If you&apos;re experiencing a medical emergency, call 911 immediately. This page provides quick access to emergency resources and first aid information.
          </p>
        </div>

        {/* Quick Emergency Call */}
        <div className="bg-red-600 rounded-lg p-6 mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Medical Emergency?</h2>
          <a 
            href="tel:911" 
            className="inline-flex items-center px-8 py-4 bg-white text-red-600 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl mr-2">📞</span>
            Call 911 Now
          </a>
          <p className="text-red-100 mt-4 text-sm">
            For immediate medical emergencies, don&apos;t hesitate to call emergency services
          </p>
        </div>

        {/* Emergency Contacts Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Emergency Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-3xl mb-3">{contact.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{contact.service}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{contact.description}</p>
                  <a 
                    href={`tel:${contact.number.replace(/[^0-9]/g, '')}`}
                    className={`inline-block w-full px-4 py-2 text-white rounded-lg font-semibold transition-colors ${contact.color}`}
                  >
                    {contact.number}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Symptoms Recognition */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recognize Emergency Symptoms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencySymptoms.map((emergency, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-3">{emergency.category}</h3>
                <ul className="space-y-2 mb-4">
                  {emergency.symptoms.map((symptom, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{symptom}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-800 dark:text-red-200 font-semibold text-sm">
                    ⚠️ Action: {emergency.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* First Aid Information */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Basic First Aid</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {firstAidTips.map((tip, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">{tip.title}</h3>
                <ol className="space-y-2">
                  {tip.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold mr-3 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        {/* Hospital Finder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Find Nearest Hospital</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter your location or zip code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button 
              onClick={() => window.open(`https://www.google.com/maps/search/hospital+near+${encodeURIComponent(location)}`, '_blank')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Find Hospitals
            </button>
          </div>
        </div>

        {/* Important Disclaimers */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Important Disclaimers</h3>
              <ul className="text-yellow-700 dark:text-yellow-300 space-y-1 text-sm">
                <li>• This information is for educational purposes only and does not replace professional medical advice</li>
                <li>• In any emergency, always call 911 or your local emergency services immediately</li>
                <li>• First aid information provided is basic guidance - consider taking a certified first aid course</li>
                <li>• When in doubt, seek immediate professional medical attention</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chat with HealthBot AI
            </Link>
            <Link href="/dashboard" className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Health Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}