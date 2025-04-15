import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';
import { IoSpeedometer } from 'react-icons/io5';

interface PlaybackControlsProps {
  currentIndex: number;
  totalMatches: number;
  isPlaying: boolean;
  playSpeed: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSpeedChange: (speed: number) => void;
}

export const PlaybackControls = ({
  currentIndex,
  totalMatches,
  isPlaying,
  playSpeed,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSpeedChange
}: PlaybackControlsProps) => {
  const [showControls, setShowControls] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowControls(false);
      } else {
        setShowControls(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSpeedChange(Number(e.target.value));
  };

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: showControls ? 0 : 100 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 max-w-5xl z-50"
    >
      <div className="bg-gray-800 bg-opacity-90 backdrop-blur-lg border border-gray-700 shadow-2xl rounded-xl p-4 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Progress Bar */}
          <div className="w-full mb-4">
            <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="absolute h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                initial={{ width: `${(currentIndex / (totalMatches - 1)) * 100}%` }}
                animate={{ width: `${(currentIndex / (totalMatches - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">Match 1</span>
              <span className="text-xs text-white font-medium">
                {currentIndex + 1} of {totalMatches}
              </span>
              <span className="text-xs text-gray-400">Match {totalMatches}</span>
            </div>
          </div>
          
          {/* Playback Controls */}
          <div className="flex items-center space-x-4 mx-auto">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onPrevious}
              disabled={currentIndex === 0}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-700 rounded-full p-3 text-white transition-colors"
            >
              <FaStepBackward className="w-5 h-5" />
            </motion.button>
            
            {isPlaying ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onPause}
                className="bg-red-500 hover:bg-red-600 rounded-full p-5 text-white transition-colors"
              >
                <FaPause className="w-6 h-6" />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onPlay}
                disabled={currentIndex === totalMatches - 1}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-full p-5 text-white transition-colors"
              >
                <FaPlay className="w-6 h-6 ml-1" />
              </motion.button>
            )}
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onNext}
              disabled={currentIndex === totalMatches - 1}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-700 rounded-full p-3 text-white transition-colors"
            >
              <FaStepForward className="w-5 h-5" />
            </motion.button>
          </div>
          
          {/* Speed Control */}
          <div className="flex items-center space-x-3">
            <IoSpeedometer className="text-indigo-400 w-5 h-5" />
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={playSpeed}
                onChange={handleSpeedChange}
                className="w-24 md:w-32 accent-indigo-500"
              />
              <span className="text-white text-sm">{playSpeed}s</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 