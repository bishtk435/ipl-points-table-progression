'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Header, 
  MatchDetails, 
  PlaybackControls, 
  PointsTable, 
  LoadingSpinner, 
  ErrorMessage 
} from '@/components/progress';
import { PointsProgression } from '@/types/progress';

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
      <div className="max-w-7xl mx-auto">
        <Header seasonYear={seasonYear} />
        
        <MatchDetails 
          matchNumber={currentSnapshot.matchNumber}
          totalMatches={totalMatches}
          matchDate={currentSnapshot.matchDate}
          matchDetails={currentSnapshot.matchDetails}
        />
        
        <PointsTable 
          pointsTable={currentSnapshot.pointsTable}
        />
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