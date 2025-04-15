import Image from 'next/image';
import { getTeamInfo } from '@/data/teams';
import { MatchDetails } from '@/types/progress';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface MatchCardProps {
  matchNumber: number;
  matchDate: string;
  matchDetails: MatchDetails;
  isActive: boolean;
  onClick: () => void;
}

export const MatchCard = ({ 
  matchNumber, 
  matchDate, 
  matchDetails,
  isActive,
  onClick
}: MatchCardProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`
        cursor-pointer p-2 mb-2 rounded-lg border transition-colors
        ${isActive 
          ? 'bg-indigo-900/50 border-indigo-500' 
          : 'bg-gray-800/70 border-gray-700 hover:border-gray-600'
        }
      `}
      onClick={onClick}
    >
      {/* Match number and date */}
      <div className="flex justify-between items-center mb-1.5">
        <span className={`
          text-xs font-medium px-1.5 py-0.5 rounded
          ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}
        `}>
          Match {matchNumber}
        </span>
        <span className="text-gray-400 text-xs">
          {format(new Date(matchDate), 'dd MMM')}
        </span>
      </div>
      
      {/* Team vs Team */}
      <div className="flex items-center">
        <div className="flex-1 flex justify-end pr-1">
          {getTeamInfo(matchDetails.team1.name) && (
            <div className="flex items-center">
              <span className="text-xs font-medium text-white max-w-20 truncate text-right mr-1">
                {matchDetails.team1.name}
              </span>
              <div className="w-6 h-6 relative">
                <Image 
                  src={getTeamInfo(matchDetails.team1.name)?.teamLogoUrl || ''} 
                  alt={matchDetails.team1.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-center px-1">
          <span className="text-xs text-gray-400 font-bold">vs</span>
        </div>
        
        <div className="flex-1 flex justify-start pl-1">
          {getTeamInfo(matchDetails.team2.name) && (
            <div className="flex items-center">
              <div className="w-6 h-6 relative">
                <Image 
                  src={getTeamInfo(matchDetails.team2.name)?.teamLogoUrl || ''} 
                  alt={matchDetails.team2.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs font-medium text-white max-w-20 truncate text-left ml-1">
                {matchDetails.team2.name}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Winner indicator - only show on active card */}
      {isActive && (
        <div className="mt-1.5 text-xs text-center">
          <span className={`
            px-2 py-0.5 rounded-full 
            ${matchDetails.winningTeamId ? 'bg-green-900/30 text-green-400' : 'bg-gray-700/50 text-gray-400'}
          `}>
            {matchDetails.winningTeamId === matchDetails.team1.id
              ? matchDetails.team1.name
              : matchDetails.winningTeamId === matchDetails.team2.id
              ? matchDetails.team2.name
              : 'No Result'} 
            {matchDetails.winningTeamId && " won"}
          </span>
        </div>
      )}
    </motion.div>
  );
}; 