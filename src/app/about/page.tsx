import Link from 'next/link';

export default function AboutPage() {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Health Assistant',
      description: 'Our advanced AI provides personalized health guidance based on your symptoms and medical history.'
    },
    {
      icon: '💬',
      title: 'Real-time Chat Support',
      description: 'Get instant responses to your health questions through our intelligent chat interface.'
    },
    {
      icon: '🚨',
      title: 'Emergency Response',
      description: 'Quick access to emergency contacts, first aid tips, and nearby medical facilities.'
    },
    {
      icon: '📊',
      title: 'Health Tracking Dashboard',
      description: 'Monitor your health metrics, track progress, and maintain a comprehensive health history.'
    },
    {
      icon: '🔒',
      title: 'Privacy & Security',
      description: 'Your health data is encrypted and protected with industry-standard security measures.'
    },
    {
      icon: '📱',
      title: 'Mobile-Friendly Design',
      description: 'Access your health assistant anywhere with our responsive, mobile-optimized interface.'
    }
  ];

  const teamMembers = [
    {
      name: 'Megha Kumari',
      role: 'Lead Developer',
      description: 'Computer Science student at Banasthali Vidyapith specializing in AI and healthcare technology.',
      image: '👩‍💻'
    },
    {
      name: 'Lovely Pandey',
      role: 'Frontend Developer',
      description: 'Student at Banasthali Vidyapith focused on user interface design and user experience.',
      image: '👩‍🎨'
    },
    {
      name: 'Anupriya',
      role: 'Backend Developer',
      description: 'Student at Banasthali Vidyapith working on server-side development and database management.',
      image: '👩‍💼'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About AI Health Chatbot
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Empowering individuals with intelligent health guidance through cutting-edge AI technology. 
            Our mission is to make quality healthcare information accessible to everyone, anytime, anywhere.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              We believe that everyone deserves access to reliable health information and guidance. Our AI health chatbot 
              combines the latest advances in artificial intelligence with medical expertise to provide personalized, 
              accurate, and accessible health support. We&apos;re committed to bridging the gap between patients and healthcare 
              professionals through innovative technology.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Describe Your Symptoms</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Share your health concerns, symptoms, or questions through our intuitive chat interface.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI analyzes your input using medical knowledge and provides personalized guidance.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Get Recommendations</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive actionable health advice, recommendations, and when to seek professional care.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-8 mb-16">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-3">Important Medical Disclaimer</h3>
              <div className="text-yellow-700 dark:text-yellow-300 space-y-3">
                <p>
                  <strong>This AI health chatbot is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.</strong>
                </p>
                <p>
                  Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. 
                  Never disregard professional medical advice or delay in seeking it because of something you have read or received from this chatbot.
                </p>
                <p>
                  <strong>In case of a medical emergency, immediately call your local emergency services (911 in the US) or go to the nearest emergency room.</strong>
                </p>
                <p>
                  The information provided by this chatbot is based on general medical knowledge and may not be applicable to your specific situation. 
                  Individual health conditions vary, and what works for one person may not work for another.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology & Privacy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Technology</h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                Our AI is built on state-of-the-art natural language processing models, trained on vast medical literature 
                and continuously updated with the latest healthcare research.
              </p>
              <p>
                We use advanced machine learning algorithms to understand context, recognize symptoms, and provide 
                relevant health information tailored to your specific needs.
              </p>
              <p>
                Our system is designed to learn and improve over time while maintaining the highest standards of 
                accuracy and reliability in health information delivery.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Privacy & Security</h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                Your privacy is our top priority. All conversations are encrypted end-to-end, and we never share 
                your personal health information with third parties.
              </p>
              <p>
                We comply with HIPAA regulations and international privacy standards to ensure your data remains 
                secure and confidential at all times.
              </p>
              <p>
                You have full control over your data and can request deletion of your information at any time 
                through our privacy settings.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Health Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who trust our AI health chatbot for reliable health guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat" className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Start Chatting Now
            </Link>
            <Link href="/dashboard" className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}