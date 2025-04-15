'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Header, 
  PlaybackControls, 
  PointsTable, 
  LoadingSpinner, 
  ErrorMessage,
  MatchesSidebar 
} from '@/components/progress';
import { PointsProgression } from '@/types/progress';
import Image from 'next/image';
import { getTeamInfo } from '@/data/teams';

export default function PointsTableProgression() {
  const params = useParams<{ seasonYear: string }>();
  const seasonYear = params.seasonYear;

  const [pointsData, setPointsData] = useState<PointsProgression | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(2); // in seconds

  useEffect(() => {
    async function fetchPointsData() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/points-progression?season=${seasonYear}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data for the ${seasonYear} season.`);
        }
        
        const data = await response.json();
        setPointsData(data);
        setCurrentIndex(0);
      } catch (err) {
        console.error('Error fetching points data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data.');
      } finally {
        setIsLoading(false);
      }
    }

    if (seasonYear) {
      fetchPointsData();
    }
  }, [seasonYear]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    
    if (isPlaying && pointsData && currentIndex < pointsData.progression.length - 1) {
      timerId = setTimeout(() => {
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, playSpeed * 1000);
    } else if (isPlaying && pointsData && currentIndex >= pointsData.progression.length - 1) {
      setIsPlaying(false);
    }
    
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isPlaying, currentIndex, pointsData, playSpeed]);

  const handlePlay = () => {
    if (pointsData && currentIndex < pointsData.progression.length - 1) {
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (pointsData && currentIndex < pointsData.progression.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaySpeed(speed);
  };

  const handleSelectMatch = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} seasonYear={seasonYear} />;
  }

  if (!pointsData || pointsData.progression.length === 0) {
    return (
      <ErrorMessage 
        message="No Data Available" 
        seasonYear={seasonYear} 
      />
    );
  }

  const currentSnapshot = pointsData.progression[currentIndex];
  const totalMatches = pointsData.progression.length;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto pb-24">
        <Header seasonYear={seasonYear} />
        
        {/* Responsive Layout: Points Table and Match History */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Points Table - Main Content */}
          <div className="lg:flex-1 order-2 lg:order-1">
            <PointsTable 
              pointsTable={currentSnapshot.pointsTable}
            />
          </div>
          
          {/* Match Timeline - Sidebar (right on desktop, top on mobile) */}
          <div className="lg:w-80 order-1 lg:order-2">
            {/* Visible on desktop - vertical scrollable list */}
            <div className="hidden lg:block h-full">
              <MatchesSidebar 
                matches={pointsData.progression}
                currentIndex={currentIndex}
                onSelectMatch={handleSelectMatch}
              />
            </div>
            
            {/* Visible on mobile - horizontal scrollable list */}
            <div className="lg:hidden mb-4">
              <h3 className="text-white text-sm font-semibold mb-2">Match Timeline</h3>
              <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
                {pointsData.progression.map((match, index) => (
                  <div key={match.matchNumber} className="w-40 flex-shrink-0">
                    <div 
                      className={`
                        cursor-pointer p-2 rounded-lg border transition-colors
                        ${currentIndex === index 
                          ? 'bg-indigo-900/50 border-indigo-500' 
                          : 'bg-gray-800/70 border-gray-700'
                        }
                      `}
                      onClick={() => handleSelectMatch(index)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400">Match {match.matchNumber}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="w-5 h-5 relative">
                          {getTeamInfo(match.matchDetails.team1.name) && (
                            <Image 
                              src={getTeamInfo(match.matchDetails.team1.name)?.teamLogoUrl || ''} 
                              alt={match.matchDetails.team1.name}
                              fill
                              className="object-contain"
                            />
                          )}
                        </div>
                        <span className="text-xs font-bold text-gray-400">vs</span>
                        <div className="w-5 h-5 relative">
                          {getTeamInfo(match.matchDetails.team2.name) && (
                            <Image 
                              src={getTeamInfo(match.matchDetails.team2.name)?.teamLogoUrl || ''} 
                              alt={match.matchDetails.team2.name}
                              fill
                              className="object-contain"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <PlaybackControls
        currentIndex={currentIndex}
        totalMatches={totalMatches}
        isPlaying={isPlaying}
        playSpeed={playSpeed}
        onPlay={handlePlay}
        onPause={handlePause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSpeedChange={handleSpeedChange}
      />
    </div>
  );
} 