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
  TeamRankGraph,
  MatchCard
} from '@/components/progress';
import { PointsProgression } from '@/types/progress';
import { seasons } from '@/data/seasons';

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
    if (timelineScrollRef.current) {
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
  }, [currentIndex]);

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
  const isLastMatch = currentIndex === totalMatches - 1;
  const seasonData = seasons.find(season => season.season_year.toString() === seasonYear);

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
        <div className="flex space-x-2 pb-1">
          {pointsData.progression.map((match, index) => (
            <div
              key={match.matchNumber}
              className="flex-shrink-0 match-card"
              style={{ width: "200px" }}
            >
              <MatchCard
                matchNumber={match.matchNumber}
                matchDate={match.matchDate}
                matchDetails={match.matchDetails}
                isActive={currentIndex === index}
                onClick={() => handleSelectMatch(index)}
                seasonYear={seasonYear}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

//   // Render mobile timeline horizontally scrollable
  const renderMobileTimeline = () => (
    <div className="lg:hidden mb-4">
      {renderMatchTimelineHorizontal()}
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

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto pb-24">
        <Header seasonYear={seasonYear} />
        
        {/* Qualification Banner - Show when at the last match */}
        {isLastMatch && (
          <div className="bg-emerald-900/30 p-3 rounded-lg border border-emerald-800 text-sm mb-5">
            <p className="text-emerald-300 flex items-center">
              <span className="font-semibold mr-2">🏆 Final Standings:</span>
              {seasonData?.isPlayOffFormat 
                ? "Teams ranked 1-2 have qualified for Qualifier 1. Teams ranked 3-4 have qualified for the Eliminator." 
                : "Teams ranked 1-4 have qualified for the Semi-finals."}
            </p>
          </div>
        )}
        
        {/* Pro Tip banner moved to the top */}
        {!selectedTeamId && !isLastMatch && (
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Points Table */}
              <div className="order-2 lg:order-1 lg:col-span-7">
                <PointsTable 
                  pointsTable={currentSnapshot.pointsTable}
                  selectedTeamId={selectedTeamId}
                  onSelectTeam={handleSelectTeam}
                  seasonYear={seasonYear}
                  isLastMatch={isLastMatch}
                />
              </div>
              
              {/* Team Rank Graph */}
              <div className="order-1 lg:order-2 lg:col-span-5">
                <TeamRankGraph 
                  progression={pointsData.progression}
                  teamId={selectedTeamId}
                  currentIndex={currentIndex}
                  seasonYear={seasonYear}
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
                isLastMatch={isLastMatch}
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