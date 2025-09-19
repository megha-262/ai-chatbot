'use client';

import { useState, useEffect, useRef } from 'react';

interface Reel {
  id: number;
  title: string;
  category: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  author: string;
  views: string;
  likes: number;
  description: string;
}

interface ReelViewerProps {
  reels: Reel[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReelViewer({ reels, initialIndex, isOpen, onClose }: ReelViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [playingVideos, setPlayingVideos] = useState<Set<number>>(new Set());
  const [likedReels, setLikedReels] = useState<Set<number>>(new Set());
  const [savedReels, setSavedReels] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const container = containerRef.current;
      const scrollToIndex = () => {
        const targetScrollTop = currentIndex * container.clientHeight;
        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      };
      
      // Small delay to ensure the component is fully rendered
      setTimeout(scrollToIndex, 100);
    }
  }, [isOpen, currentIndex]);

  const handleScroll = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reels.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const togglePlay = (reelId: number) => {
    const video = document.querySelector(`video[data-reel-id="${reelId}"]`) as HTMLVideoElement;
    if (video) {
      if (playingVideos.has(reelId)) {
        video.pause();
        setPlayingVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(reelId);
          return newSet;
        });
      } else {
        video.play().catch(console.error);
        setPlayingVideos(prev => new Set(prev).add(reelId));
      }
    }
  };

  // Auto-play current video and pause others
  useEffect(() => {
    const videos = document.querySelectorAll('video');
    videos.forEach((video, index) => {
      if (index === currentIndex) {
        video.play().catch(console.error);
        setPlayingVideos(prev => new Set(prev).add(reels[index].id));
      } else {
        video.pause();
        setPlayingVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(reels[index].id);
          return newSet;
        });
      }
    });
  }, [currentIndex, reels]);

  // Intersection Observer for video autoplay
  useEffect(() => {
    if (!isOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          const reelId = parseInt(video.getAttribute('data-reel-id') || '0');
          
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            // Video is more than 50% visible
            video.play().catch(console.error);
            setPlayingVideos(prev => new Set(prev).add(reelId));
          } else {
            // Video is less than 50% visible
            video.pause();
            setPlayingVideos(prev => {
              const newSet = new Set(prev);
              newSet.delete(reelId);
              return newSet;
            });
          }
        });
      },
      {
        threshold: [0.5], // Trigger when 50% of video is visible
        root: containerRef.current,
      }
    );

    // Observe all videos
    const videos = document.querySelectorAll('video[data-reel-id]');
    videos.forEach((video) => observer.observe(video));

    return () => {
      videos.forEach((video) => observer.unobserve(video));
      observer.disconnect();
    };
  }, [isOpen, reels]);

  const toggleLike = (reelId: number) => {
    setLikedReels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reelId)) {
        newSet.delete(reelId);
      } else {
        newSet.add(reelId);
      }
      return newSet;
    });
  };

  const toggleSave = (reelId: number) => {
    setSavedReels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reelId)) {
        newSet.delete(reelId);
      } else {
        newSet.add(reelId);
      }
      return newSet;
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Nutrition':
        return 'bg-green-500 text-white';
      case 'Exercise':
        return 'bg-blue-500 text-white';
      case 'Mental Health':
        return 'bg-purple-500 text-white';
      case 'Medical':
        return 'bg-red-500 text-white';
      case 'Wellness':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-60 text-white hover:text-gray-300 transition-colors"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-60 text-white hover:text-gray-300 transition-colors"
        disabled={currentIndex === 0}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-60 text-white hover:text-gray-300 transition-colors"
        disabled={currentIndex === reels.length - 1}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Centered Reel Container */}
      <div className="w-full max-w-sm mx-auto h-[80vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        <div 
          ref={containerRef}
          className="w-full h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
          style={{ 
            scrollBehavior: 'smooth',
            scrollSnapType: 'y mandatory'
          }}
          onScroll={handleScroll}
        >
          {reels.map((reel, index) => (
            <div
              key={reel.id}
              className="h-full w-full snap-start flex flex-col p-4"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Video Player */}
              <div className="relative flex-1 bg-gray-800 rounded-xl overflow-hidden mb-4">
                <video
                  data-reel-id={reel.id}
                  ref={(el) => {
                    if (el) {
                      el.onloadeddata = () => {
                        if (index === currentIndex) {
                          el.play().catch(console.error);
                          setPlayingVideos(prev => new Set(prev).add(reel.id));
                        }
                      };
                    }
                  }}
                  className="w-full h-full object-cover"
                  src={reel.videoUrl}
                  poster={reel.thumbnail}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  onPlay={() => setPlayingVideos(prev => new Set(prev).add(reel.id))}
                  onPause={() => setPlayingVideos(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(reel.id);
                    return newSet;
                  })}
                />
                
                {/* Play/Pause Button */}
                <button
                  onClick={() => togglePlay(reel.id)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-200"
                >
                  {playingVideos.has(reel.id) ? (
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>

                {/* Mute/Unmute Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const video = e.currentTarget.parentElement?.querySelector('video');
                    if (video) {
                      video.muted = !video.muted;
                    }
                  }}
                  className="absolute top-3 right-3 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                </button>

                {/* Category Badge */}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(reel.category)}`}>
                  {reel.category}
                </div>
              </div>

              {/* Reel Info */}
              <div className="text-white">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{reel.title}</h3>
                <p className="text-sm text-gray-300 mb-4 line-clamp-2">{reel.description}</p>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleLike(reel.id)}
                      className={`flex items-center space-x-1 transition-colors duration-200 ${
                        likedReels.has(reel.id) ? 'text-red-500' : 'text-gray-300 hover:text-red-500'
                      }`}
                    >
                      <svg className="w-6 h-6" fill={likedReels.has(reel.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm">{reel.likes}</span>
                    </button>

                    <button
                      onClick={() => toggleSave(reel.id)}
                      className={`transition-colors duration-200 ${
                        savedReels.has(reel.id) ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'
                      }`}
                    >
                      <svg className="w-6 h-6" fill={savedReels.has(reel.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>

                  <div className="text-xs text-gray-400">
                    {reel.views} views • {reel.duration}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}