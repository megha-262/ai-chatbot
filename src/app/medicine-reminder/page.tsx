import React, { useState, useEffect } from 'react';

interface MedicineReminder {
  _id: string;
  medicine: string;
  time: string;
  taken: boolean;
}

const MedicineReminderPage = () => {
  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [newMedicine, setNewMedicine] = useState('');
  const [newTime, setNewTime] = useState('');
  const [userId, setUserId] = useState('some-user-id'); // Replace with actual user ID from auth

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await fetch(`/api/medicinereminder?userId=${userId}`);
        const data = await res.json();
        if (res.ok) {
          setReminders(data.medicineReminders);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error('An unexpected error occurred', err);
      }
    };

    if (userId) {
      fetchReminders();
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/medicinereminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, medicine: newMedicine, time: newTime }),
      });

      const data = await res.json();

      if (res.ok) {
        setReminders([...reminders, data.medicineReminder]);
        setNewMedicine('');
        setNewTime('');
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
        <h1 className="text-2xl font-bold mb-6">Medicine Reminders</h1>
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-center mb-4">
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
              value={newMedicine}
              onChange={(e) => setNewMedicine(e.target.value)}
              placeholder="Medicine Name"
              required
            />
            <input
              type="time"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Reminder
          </button>
        </form>
        <div>
          <h2 className="text-xl font-bold mb-4">Your Reminders</h2>
          {reminders.length > 0 ? (
            <ul>
              {reminders.map((reminder) => (
                <li key={reminder._id} className="bg-gray-200 p-4 rounded mb-4 flex justify-between items-center">
                  <div>
                    <p className="text-gray-800 font-bold">{reminder.medicine}</p>
                    <p className="text-gray-600">{reminder.time}</p>
                  </div>
                  <button className={`py-2 px-4 rounded ${reminder.taken ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {reminder.taken ? 'Taken' : 'Mark as Taken'}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reminders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineReminderPage;