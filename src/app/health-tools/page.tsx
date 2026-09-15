'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import FormattedAIResponse from '@/components/FormattedAIResponse';

type Tab = 'symptoms' | 'medicine';
type Severity = 'LOW' | 'MODERATE' | 'HIGH';

function extractSeverity(text: string): Severity | null {
  const match = text.match(/##\s*Severity[\s\S]{0,20}?\b(LOW|MODERATE|HIGH)\b/i);
  return (match?.[1]?.toUpperCase() as Severity | undefined) ?? null;
}

const SEVERITY_STYLES: Record<Severity, string> = {
  LOW: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  MODERATE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  HIGH: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

function SymptomCheckerTab() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState('');
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // guard against a second submit racing in before the button disables

    setError('');
    if (!symptoms.trim()) {
      setError('Please describe your symptoms.');
      return;
    }

    setIsLoading(true);
    setResult('');
    setSeverity(null);

    try {
      const response = await fetch('/api/symptom-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Unable to connect to the AI service. Please try again.');
        return;
      }

      setResult(data.result);
      setSeverity(extractSeverity(data.result));
    } catch {
      setError('Unable to connect to the AI service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Symptom Checker</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Describe your symptoms in your own words.</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g. I have fever and cough"
          rows={3}
          maxLength={2000}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none disabled:opacity-60"
        />
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analyzing symptoms...
            </>
          ) : (
            'Check Symptoms'
          )}
        </button>
      </form>

      {result && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          {severity && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Severity:</span>
              <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${SEVERITY_STYLES[severity]}`}>
                {severity}
              </span>
            </div>
          )}
          <FormattedAIResponse text={result} />
        </div>
      )}

      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ This tool provides general educational information only and is not a medical diagnosis. For a medical
          emergency, <Link href="/emergency" className="underline font-medium">go to the Emergency page</Link> or call
          your local emergency number immediately.
        </p>
      </div>
    </div>
  );
}

function MedicineInfoTab() {
  const [medicineName, setMedicineName] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // guard against a second submit racing in before the button disables

    setError('');
    if (!medicineName.trim()) {
      setError('Please enter a medicine name.');
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/medicine-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicineName }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Unable to connect to the AI service. Please try again.');
        return;
      }

      setResult(data.result);
    } catch {
      setError('Unable to connect to the AI service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Medicine Information</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Look up general information about a medicine.</p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          placeholder="e.g. Paracetamol"
          maxLength={200}
          disabled={isLoading}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Getting medicine information...
            </>
          ) : (
            'Look Up'
          )}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}

      {result && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <FormattedAIResponse text={result} />
        </div>
      )}

      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ This is general educational information, not a prescription or personalized medical advice. Never
          start, stop, or change a medication without talking to a qualified healthcare professional or pharmacist.
        </p>
      </div>
    </div>
  );
}

function HealthToolsContent() {
  const searchParams = useSearchParams();
  const initialTab: Tab = searchParams.get('tab') === 'medicine' ? 'medicine' : 'symptoms';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h1 className="ml-4 text-2xl font-semibold text-gray-900 dark:text-white">Health Tools</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6" role="tablist" aria-label="Health Tools">
          <button
            role="tab"
            aria-selected={activeTab === 'symptoms'}
            onClick={() => setActiveTab('symptoms')}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium border transition-colors ${
              activeTab === 'symptoms'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Symptom Checker
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'medicine'}
            onClick={() => setActiveTab('medicine')}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium border transition-colors ${
              activeTab === 'medicine'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Medicine Information
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {activeTab === 'symptoms' ? <SymptomCheckerTab /> : <MedicineInfoTab />}
        </div>
      </div>
    </div>
  );
}

export default function HealthToolsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-900" />}>
      <HealthToolsContent />
    </Suspense>
  );
}
