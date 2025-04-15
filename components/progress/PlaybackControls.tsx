import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaChevronDown } from 'react-icons/fa';
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
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const speedMenuRef = useRef<HTMLDivElement>(null);

  // Close speed menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(event.target as Node)) {
        setIsSpeedMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Available speed options
  const speedOptions = [0.5, 1, 1.5, 2, 3, 5];

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 max-w-4xl z-50">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120, damping: 20 }}
        className="bg-gray-800/90 backdrop-blur-lg border border-gray-700 shadow-[0_8px_32px_-15px_rgba(79,70,229,0.6)] rounded-xl p-3"
      >
        {/* Progress Bar with Match Count */}
        <div className="relative h-1.5 bg-gray-700 rounded-full overflow-hidden mb-2">
          <motion.div 
            className="absolute h-full bg-gradient-to-r from-indigo-500 to-purple-600"
            initial={{ width: `${(currentIndex / (totalMatches - 1)) * 100}%` }}
            animate={{ width: `${(currentIndex / (totalMatches - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex items-center justify-between">
          {/* Match Counter */}
          <div className="text-xs text-gray-300 font-medium">
            Match {currentIndex + 1} of {totalMatches}
          </div>
          
          {/* Main Playback Controls */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={onPrevious}
              disabled={currentIndex === 0}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-700 rounded-full p-2 text-white transition-colors"
            >
              <FaStepBackward className="w-3.5 h-3.5" />
            </motion.button>
            
            {isPlaying ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={onPause}
                className="bg-red-500 hover:bg-red-600 rounded-full p-3 text-white transition-colors"
              >
                <FaPause className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={onPlay}
                disabled={currentIndex === totalMatches - 1}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-full p-3 text-white transition-colors"
              >
                <FaPlay className="w-4 h-4 ml-0.5" />
              </motion.button>
            )}
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={onNext}
              disabled={currentIndex === totalMatches - 1}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-700 rounded-full p-2 text-white transition-colors"
            >
              <FaStepForward className="w-3.5 h-3.5" />
            </motion.button>
          </div>
          
          {/* Speed Control Dropdown */}
          <div className="relative" ref={speedMenuRef}>
            <button
              onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
              className="flex items-center space-x-1 text-sm text-white bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md transition-colors"
            >
              <IoSpeedometer className="text-indigo-400 w-4 h-4" />
              <span className="text-xs">{playSpeed}s</span>
              <FaChevronDown className="w-2.5 h-2.5 text-gray-400" />
            </button>
            
            <AnimatePresence>
              {isSpeedMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full mb-1 right-0 bg-gray-700 rounded-md shadow-lg overflow-hidden"
                >
                  <div className="py-1 w-28 border border-gray-600 rounded-md">
                    {speedOptions.map(speed => (
                      <button
                        key={speed}
                        onClick={() => {
                          onSpeedChange(speed);
                          setIsSpeedMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-sm text-white hover:bg-gray-600 transition-colors ${
                          playSpeed === speed ? 'bg-indigo-600/40' : ''
                        }`}
                      >
                        {speed}s {playSpeed === speed && '✓'}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 