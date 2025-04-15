import Image from 'next/image';
import { getTeamInfo } from '@/data/teams';
import { MatchDetails as MatchDetailsType } from '@/types/progress';
import { motion } from 'framer-motion';
import { HiLocationMarker } from 'react-icons/hi';

interface MatchDetailsProps {
  matchNumber: number;
  totalMatches: number;
  matchDate: string;
  matchDetails: MatchDetailsType;
}

export const MatchDetails = ({ 
  matchNumber, 
  totalMatches, 
  matchDate, 
  matchDetails 
}: MatchDetailsProps) => {
  // Format date to be more compact
  const formattedDate = new Date(matchDate).toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 shadow-xl rounded-xl p-3 mb-5 border border-gray-700"
    >
      <div className="flex flex-wrap items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <span className="bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-md">
            Match {matchNumber}/{totalMatches}
          </span>
          <span className="text-gray-300 text-xs">
            {formattedDate}
          </span>
        </div>
        
        <div className="flex items-center text-xs text-gray-400 mt-1 md:mt-0">
          <HiLocationMarker className="h-3.5 w-3.5 mr-1 text-indigo-400" />
          <span className="text-white text-xs">{matchDetails.venue}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex-1 flex justify-end pr-2">
          {getTeamInfo(matchDetails.team1.name) && (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 relative mb-1 transform transition-transform duration-300 hover:scale-110">
                <Image 
                  src={getTeamInfo(matchDetails.team1.name)?.teamLogoUrl || ''} 
                  alt={matchDetails.team1.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs font-medium text-white text-center max-w-20 truncate">
                {matchDetails.team1.name}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center px-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold mb-1">
            vs
          </span>
          <span className="bg-gray-700 px-2 py-0.5 rounded text-xs text-gray-300 whitespace-nowrap">
            {matchDetails.winningTeamId === matchDetails.team1.id ? matchDetails.team1.name : 
             matchDetails.winningTeamId === matchDetails.team2.id ? matchDetails.team2.name : 
             'No Result'}
            <span className="text-indigo-400 ml-1">won</span>
          </span>
        </div>
        
        <div className="flex-1 flex justify-start pl-2">
          {getTeamInfo(matchDetails.team2.name) && (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 relative mb-1 transform transition-transform duration-300 hover:scale-110">
                <Image 
                  src={getTeamInfo(matchDetails.team2.name)?.teamLogoUrl || ''} 
                  alt={matchDetails.team2.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs font-medium text-white text-center max-w-20 truncate">
                {matchDetails.team2.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}; 