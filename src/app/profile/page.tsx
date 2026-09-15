'use client';

import { useEffect, useState } from 'react';

interface HealthProfile {
  age?: number;
  gender?: string;
  bloodGroup?: string;
  preferences?: {
    notifications?: boolean;
  };
}

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  healthProfile?: HealthProfile;
}

const BLOOD_GROUPS = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [notifications, setNotifications] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/profile')
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load profile');
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        setUser(data.user);
        const hp: HealthProfile = data.user.healthProfile ?? {};
        setAge(hp.age !== undefined ? String(hp.age) : '');
        setGender(hp.gender ?? '');
        setBloodGroup(hp.bloodGroup ?? '');
        setNotifications(Boolean(hp.preferences?.notifications));
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || 'Failed to load profile');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess(false);

    if (age && (Number.isNaN(Number(age)) || Number(age) < 0 || Number(age) > 120)) {
      setSaveError('Please enter a valid age between 0 and 120');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: age ? Number(age) : null,
          gender: gender || null,
          bloodGroup: bloodGroup || null,
          preferences: { notifications },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setSaveError(data.error || 'Failed to update profile');
        return;
      }
      setUser(data.user);
      setSaveSuccess(true);
    } catch {
      setSaveError('Unable to reach the server. Please check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (loadError || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">{loadError || 'Unable to load profile'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{user.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Health Profile</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Optional — helps HealthBot AI give you more relevant general guidance. Nothing here is required.
          </p>

          {saveError && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
              {saveError}
            </div>
          )}
          {saveSuccess && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-800 text-sm text-green-700 dark:text-green-300">
              Profile updated successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  min={0}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Blood Group
                </label>
                <select
                  id="bloodGroup"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg || 'Prefer not to say'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <input
                id="gender"
                type="text"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                placeholder="Optional"
                maxLength={50}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              Receive health tip notifications
            </label>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Save Profile'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
