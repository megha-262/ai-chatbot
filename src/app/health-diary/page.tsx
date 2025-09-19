import React, { useState, useEffect } from 'react';

interface HealthDiaryEntry {
  _id: string;
  entry: string;
  date: string;
}

const HealthDiaryPage = () => {
  const [entries, setEntries] = useState<HealthDiaryEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [userId, setUserId] = useState('some-user-id'); // Replace with actual user ID from auth

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch(`/api/healthdiary?userId=${userId}`);
        const data = await res.json();
        if (res.ok) {
          setEntries(data.healthDiaryEntries);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error('An unexpected error occurred', err);
      }
    };

    if (userId) {
      fetchEntries();
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/healthdiary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, date: new Date(), entry: newEntry }),
      });

      const data = await res.json();

      if (res.ok) {
        setEntries([...entries, data.healthDiaryEntry]);
        setNewEntry('');
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error('An unexpected error occurred', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6">Health Diary</h1>
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={4}
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="How are you feeling today?"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
          >
            Add Entry
          </button>
        </form>
        <div>
          <h2 className="text-xl font-bold mb-4">Your Entries</h2>
          {entries.length > 0 ? (
            <ul>
              {entries.map((entry) => (
                <li key={entry._id} className="bg-gray-200 p-4 rounded mb-4">
                  <p className="text-gray-800">{entry.entry}</p>
                  <p className="text-gray-600 text-sm mt-2">{new Date(entry.date).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No entries yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthDiaryPage;