export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            AI Chatbot
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Welcome to your AI-powered chatbot built with Next.js 15, TypeScript, and Tailwind CSS 4
          </p>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Chat Interface
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 max-w-xs">
                  <p className="text-gray-800 dark:text-gray-200">Hello! How can I help you today?</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-blue-500 rounded-lg px-4 py-2 max-w-xs">
                  <p className="text-white">This is a sample message from the user.</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Send
              </button>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Next.js 15</h3>
              <p className="text-gray-600 dark:text-gray-300">Built with the latest Next.js features including App Router and Server Components.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">TypeScript</h3>
              <p className="text-gray-600 dark:text-gray-300">Fully typed for better development experience and code reliability.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tailwind CSS 4</h3>
              <p className="text-gray-600 dark:text-gray-300">Styled with the latest Tailwind CSS for modern, responsive design.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
