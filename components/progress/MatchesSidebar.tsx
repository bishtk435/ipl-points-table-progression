import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MatchCard } from './MatchCard';
import { PointsTableSnapshot } from '@/types/progress';
import { HiChevronDoubleDown } from 'react-icons/hi';

interface MatchesSidebarProps {
  matches: PointsTableSnapshot[];
  currentIndex: number;
  onSelectMatch: (index: number) => void;
}

export const MatchesSidebar = ({ 
  matches, 
  currentIndex, 
  onSelectMatch 
}: MatchesSidebarProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to keep the active card visible
  useEffect(() => {
    if (scrollContainerRef.current && matches.length > 0) {
      const activeCard = scrollContainerRef.current.querySelector('.active-card');
      if (activeCard) {
        // Scroll the active card into view with some offset
        activeCard.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [currentIndex, matches.length]);

  if (matches.length === 0) {
    return null;
  }
  
  return (
    <motion.div 
      className="matches-sidebar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white text-sm font-semibold">Match Timeline</h3>
        <span className="text-gray-400 text-xs">{matches.length} Matches</span>
      </div>
      
      {/* On Mobile - Hint text */}
      <div className="md:hidden flex items-center justify-center text-gray-400 text-xs mb-2">
        <HiChevronDoubleDown className="animate-bounce mr-1" />
        <span>Scroll to see all matches</span>
      </div>
      
      {/* Scrollable container */}
      <div 
        className="overflow-y-auto matches-scroll-container"
        style={{ maxHeight: 'calc(100vh - 300px)' }}
        ref={scrollContainerRef}
      >
        {matches.map((match, index) => (
          <div
            key={match.matchNumber}
            className={currentIndex === index ? 'active-card' : ''}
          >
            <MatchCard
              matchNumber={match.matchNumber}
              matchDate={match.matchDate}
              matchDetails={match.matchDetails}
              isActive={currentIndex === index}
              onClick={() => onSelectMatch(index)}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}; 