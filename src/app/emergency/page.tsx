import React from 'react';

const EmergencyPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Emergency Support</h1>
        </header>

        <main className="space-y-8">
          <section className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Helpline Numbers</h2>
            <ul className="space-y-3 text-black dark:text-gray-300">
              <li className="flex items-center">
                <span className="font-semibold w-48">National Emergency:</span>
                <span className="text-lg font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">112</span>
              </li>
              <li className="flex items-center">
                <span className="font-semibold w-48">Ambulance:</span>
                <span className="text-lg font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">102</span>
              </li>
              <li className="flex items-center">
                <span className="font-semibold w-48">Police:</span>
                <span className="text-lg font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">100</span>
              </li>
              <li className="flex items-center">
                <span className="font-semibold w-48">Fire:</span>
                <span className="text-lg font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">101</span>
              </li>
              <li className="flex items-center">
                <span className="font-semibold w-48">Women Helpline:</span>
                <span className="text-lg font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">1091</span>
              </li>
              <li className="flex items-center">
                <span className="font-semibold w-48">Child Helpline:</span>
                <span className="text-lg font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">1098</span>
              </li>
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Steps to Take in an Emergency</h2>
            <ol className="list-decimal list-inside space-y-3 text-black dark:text-gray-300">
              <li>Stay calm and assess the situation.</li>
              <li>Ensure your safety first.</li>
              <li>Call the appropriate helpline number.</li>
              <li>Provide clear and concise information about the emergency.</li>
              <li>Follow the instructions of emergency personnel.</li>
              <li>Administer first aid if you are trained and it is safe to do so.</li>
            </ol>
          </section>
        </main>
      </div>
    </div>
  );
};

export default EmergencyPage;