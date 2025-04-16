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
  seasonYear?: string;
}

export const MatchCard = ({ 
  matchNumber, 
  matchDate, 
  matchDetails,
  isActive,
  onClick,
}: MatchCardProps) => {

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`
        cursor-pointer p-2 mb-2 rounded-lg border transition-colors w-full
        ${isActive 
          ? 'bg-indigo-900/50 border-indigo-500' 
          : 'bg-gray-800/70 border-gray-700 hover:border-gray-600'
        }
      `}
      onClick={onClick}
    >
      {/* Match header with venue */}
      <div className="flex items-center justify-between mb-2">
        <span className={`
          text-xs font-medium px-2 py-0.5 rounded
          ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}
        `}>
          #{matchNumber}
        </span>
        <span className="text-gray-400 text-xs bg-gray-800/50 px-2 py-0.5 rounded truncate max-w-[60%] text-right">
          {format(new Date(matchDate), 'dd MMM')}
        </span>
      </div>
      
      {/* Team vs Team - more compact layout */}
      <div className="flex flex-col space-y-2">
        {/* Team 1 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-6 h-6 relative flex-shrink-0">
              {getTeamInfo(matchDetails.team1.name) && (
                <Image 
                  src={getTeamInfo(matchDetails.team1.name)?.teamLogoUrl || ''} 
                  alt={matchDetails.team1.name}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <div className="ml-1.5 flex flex-col">
              <span className="text-xs font-medium text-white">
                {getTeamInfo(matchDetails.team1.name)?.shortName || matchDetails.team1.name.split(' ').pop()}
              </span>
            </div>
          </div>
          
          {/* VS indicator - center */}
          <div className="px-1">
            <span className="text-xs text-gray-500 font-medium">vs</span>
          </div>
          
          {/* Team 2 */}
          <div className="flex items-center justify-end">
            <div className="mr-1.5 flex flex-col items-end">
              <span className="text-xs font-medium text-white text-right">
                {getTeamInfo(matchDetails.team2.name)?.shortName || matchDetails.team2.name.split(' ').pop()}
              </span>
            </div>
            <div className="w-6 h-6 relative flex-shrink-0">
              {getTeamInfo(matchDetails.team2.name) && (
                <Image 
                  src={getTeamInfo(matchDetails.team2.name)?.teamLogoUrl || ''} 
                  alt={matchDetails.team2.name}
                  fill
                  className="object-contain"
                />
              )}
            </div>
          </div>
        </div>
        
        {/* Compact venue */}
        <div className="text-[10px] text-gray-500 truncate text-center">
          <span>{matchDetails.venue}</span>
        </div>
      </div>
      
      {/* Match result - compact styling */}
      <div className="mt-1.5">
        <div className={`
          text-center w-full rounded p-1
          ${!matchDetails.winningTeamId 
            ? 'bg-gray-700/30 text-gray-400' 
            : 'bg-green-900/30 text-green-400 border border-green-900/30'
          }
          text-xs
        `}>
          {matchDetails.winningTeamId === matchDetails.team1.id
            ? `${getTeamInfo(matchDetails.team1.name)?.shortName || matchDetails.team1.name.split(' ').pop()} won`
            : matchDetails.winningTeamId === matchDetails.team2.id
            ? `${getTeamInfo(matchDetails.team2.name)?.shortName || matchDetails.team2.name.split(' ').pop()} won`
            : 'No Result'} 
          {matchDetails.margin && matchDetails.margin.runs 
            ? ` by ${matchDetails.margin.runs} runs` 
            : matchDetails.margin && matchDetails.margin.wickets 
            ? ` by ${matchDetails.margin.wickets} wickets` 
            : ''}
        </div>
      </div>
    </motion.div>
  );
}; 