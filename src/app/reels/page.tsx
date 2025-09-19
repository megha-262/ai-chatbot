'use client';

import { useState } from 'react';
import ReelCard from '@/components/ReelCard';
import ReelViewer from '@/components/ReelViewer';

// Mock data for health reels
const healthReels = [
  {
    id: 1,
    title: "5-Minute Morning Yoga Routine",
    category: "Exercise",
    duration: "5:23",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=600&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    author: "Dr. Sarah Johnson",
    views: "12.5K",
    likes: 1250,
    description: "Start your day with this energizing yoga sequence designed to improve flexibility and mental clarity."
  },
  {
    id: 2,
    title: "Healthy Smoothie Bowl Recipe",
    category: "Nutrition",
    duration: "3:45",
    thumbnail: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=600&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    author: "Nutritionist Mike Chen",
    views: "8.2K",
    likes: 820,
    description: "Learn to make a nutrient-packed smoothie bowl with antioxidant-rich berries and superfoods."
  },
  {
    id: 3,
    title: "Breathing Exercises for Anxiety",
    category: "Mental Health",
    duration: "7:12",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    author: "Dr. Emily Rodriguez",
    views: "15.7K",
    likes: 1570,
    description: "Simple breathing techniques to help manage anxiety and promote relaxation throughout your day."
  },
  {
    id: 4,
    title: "Desk Stretches for Office Workers",
    category: "Exercise",
    duration: "4:30",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    author: "Physical Therapist Lisa Park",
    views: "9.8K",
    likes: 980,
    description: "Combat desk-related stiffness with these simple stretches you can do right at your workspace."
  },
  {
    id: 5,
    title: "Understanding Sleep Hygiene",
    category: "Wellness",
    duration: "6:15",
    thumbnail: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=600&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    author: "Sleep Specialist Dr. James Wilson",
    views: "11.3K",
    likes: 1130,
    description: "Essential tips for better sleep quality and establishing healthy bedtime routines."
  },
  {
    id: 6,
    title: "Heart-Healthy Mediterranean Meal",
    category: "Nutrition",
    duration: "8:45",
    thumbnail: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=600&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    author: "Chef Maria Gonzalez",
    views: "7.1K",
    likes: 710,
    description: "Prepare a delicious Mediterranean-style meal that supports cardiovascular health."
  }
];

const categories = ["All", "Exercise", "Nutrition", "Mental Health", "Wellness"];

export default function ReelsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedReelIndex, setSelectedReelIndex] = useState(0);

  const filteredReels = healthReels.filter(reel => {
    const matchesCategory = selectedCategory === "All" || reel.category === selectedCategory;
    const matchesSearch = reel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reel.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleReelClick = (reel: typeof healthReels[0]) => {
    const reelIndex = filteredReels.findIndex(r => r.id === reel.id);
    setSelectedReelIndex(reelIndex);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Health Reels
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover bite-sized health content from medical professionals and wellness experts
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search health reels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredReels.map((reel) => (
            <ReelCard
              key={reel.id}
              reel={reel}
              onClick={() => handleReelClick(reel)}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredReels.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No reels found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Reel Viewer */}
        <ReelViewer
          reels={filteredReels}
          initialIndex={selectedReelIndex}
          isOpen={isViewerOpen}
          onClose={handleCloseViewer}
        />
      </div>
    </div>
  );
}