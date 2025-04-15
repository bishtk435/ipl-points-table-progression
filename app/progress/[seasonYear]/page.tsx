'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { 
  Header, 
  PlaybackControls, 
  PointsTable, 
  LoadingSpinner, 
  ErrorMessage,
  MatchesSidebar,
  TeamRankGraph
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
  const [playSpeed, setPlaySpeed] = useState(1); // in seconds
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  
  // Reference to the match timeline scroll container
  const timelineScrollRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll the match timeline to keep current match in view
  useEffect(() => {
    if (selectedTeamId && timelineScrollRef.current) {
      const scrollContainer = timelineScrollRef.current;
      const cards = scrollContainer.querySelectorAll('.match-card');
      
      if (cards && cards.length > currentIndex) {
        const currentCard = cards[currentIndex] as HTMLElement;
        if (currentCard) {
          const containerWidth = scrollContainer.clientWidth;
          const cardLeft = currentCard.offsetLeft;
          const cardWidth = currentCard.clientWidth;
          
          // Calculate the scroll position to center the current card
          const scrollTo = cardLeft - (containerWidth / 2) + (cardWidth / 2);
          
          // Smooth scroll to the position
          scrollContainer.scrollTo({
            left: Math.max(0, scrollTo),
            behavior: 'smooth'
          });
        }
      }
    }
  }, [currentIndex, selectedTeamId]);

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

  const handleSelectTeam = (teamId: string) => {
    // Toggle team selection
    setSelectedTeamId(prevTeamId => prevTeamId === teamId ? null : teamId);
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

  // Render Match Timeline Horizontal Cards (when team is selected)
  const renderMatchTimelineHorizontal = () => (
    <div className="w-full bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-700">
      <div className="p-3 bg-gray-900 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-white text-sm font-semibold">
          Match Timeline
        </h3>
        <span className="text-gray-400 text-xs">
          {pointsData.progression.length} matches
        </span>
      </div>
      <div className="p-3 overflow-x-auto hide-scrollbar" ref={timelineScrollRef}>
        <div className="flex space-x-3 pb-1">
          {pointsData.progression.map((match, index) => (
            <div
              key={match.matchNumber}
              className="flex-shrink-0 match-card"
              style={{ width: "150px" }}
            >
              <div 
                className={`
                  h-full rounded-lg border cursor-pointer transition-colors
                  ${currentIndex === index 
                    ? 'bg-indigo-900/50 border-indigo-500' 
                    : 'bg-gray-800/70 border-gray-700 hover:bg-gray-700/50'
                  }
                `}
                onClick={() => handleSelectMatch(index)}
              >
                <div className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 bg-gray-800/80 px-2 py-1 rounded">
                      {match.matchNumber}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(match.matchDate).toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <div className="w-7 h-7 relative">
                        {getTeamInfo(match.matchDetails.team1.name) && (
                          <Image 
                            src={getTeamInfo(match.matchDetails.team1.name)?.teamLogoUrl || ''} 
                            alt={match.matchDetails.team1.name}
                            fill
                            className="object-contain"
                          />
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-300 ml-2 truncate max-w-[85px]">
                        {match.matchDetails.team1.name.split(' ').pop()}
                      </span>
                    </div>
                    
                    <div className="flex justify-center">
                      <span className="text-xs text-gray-500">vs</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-7 h-7 relative">
                        {getTeamInfo(match.matchDetails.team2.name) && (
                          <Image 
                            src={getTeamInfo(match.matchDetails.team2.name)?.teamLogoUrl || ''} 
                            alt={match.matchDetails.team2.name}
                            fill
                            className="object-contain"
                          />
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-300 ml-2 truncate max-w-[85px]">
                        {match.matchDetails.team2.name.split(' ').pop()}
                      </span>
                    </div>
        </div>
          
                  {match.matchDetails.result && (
                    <div className="text-xs text-center w-full bg-gray-800/40 rounded-md p-1 mt-2 text-gray-400 truncate">
                      {match.matchDetails.result}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Match Timeline for regular sidebar view (when no team is selected)
  const renderMatchTimelineVertical = () => (
    <div className="w-full bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-700">
      <div className="p-3 bg-gray-900 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-white text-sm font-semibold">
          Match Timeline
        </h3>
        <span className="text-gray-400 text-xs">
          {pointsData.progression.length} matches
        </span>
      </div>
      <div className="h-full">
              <MatchesSidebar 
                matches={pointsData.progression}
                currentIndex={currentIndex}
                onSelectMatch={handleSelectMatch}
              />
            </div>
    </div>
  );
            
  // Render mobile timeline horizontally scrollable
  const renderMobileTimeline = () => (
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
  );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto pb-24">
        <Header seasonYear={seasonYear} />
        
        {/* Pro Tip banner moved to the top */}
        {!selectedTeamId && (
          <div className="bg-indigo-900/30 p-3 rounded-lg border border-indigo-800 text-sm mb-5">
            <p className="text-indigo-300">
              <span className="font-semibold">Pro Tip:</span> Click on any team in the points table to view its rank progression graph!
            </p>
          </div>
        )}
        
        {/* Different layout based on team selection */}
        {selectedTeamId ? (
          // Layout when a team is selected - Timeline above, points table and graph side by side
          <div className="flex flex-col gap-5">
            {/* Match Timeline at the top when team is selected */}
            <div>
              {renderMatchTimelineHorizontal()}
            </div>
            
            {/* Points Table and Graph side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Points Table */}
              <div className="order-2 lg:order-1">
                <PointsTable 
                  pointsTable={currentSnapshot.pointsTable}
                  selectedTeamId={selectedTeamId}
                  onSelectTeam={handleSelectTeam}
                  seasonYear={seasonYear}
                />
              </div>
              
              {/* Team Rank Graph */}
              <div className="order-1 lg:order-2">
                <TeamRankGraph 
                  progression={pointsData.progression}
                  teamId={selectedTeamId}
                  currentIndex={currentIndex}
                />
              </div>
            </div>
          </div>
        ) : (
          // Original layout when no team is selected - Points table and timeline side by side
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Points Table - Left side on desktop */}
            <div className="lg:col-span-9 order-2 lg:order-1">
              <PointsTable 
                pointsTable={currentSnapshot.pointsTable}
                selectedTeamId={selectedTeamId}
                onSelectTeam={handleSelectTeam}
                seasonYear={seasonYear}
              />
            </div>
            
            {/* Right Side Content - Timeline */}
            <div className="lg:col-span-3 order-1 lg:order-2 flex flex-col space-y-5">
              {/* Match Timeline - visible on desktop */}
              <div className="hidden lg:block">
                {renderMatchTimelineVertical()}
              </div>
              
              {/* Mobile timeline - horizontal scrolling */}
              {renderMobileTimeline()}
          </div>
        </div>
        )}
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