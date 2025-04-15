import Image from 'next/image';
import { getTeamInfo } from '@/data/teams';
import { MatchDetails as MatchDetailsType } from '@/types/progress';
import { motion } from 'framer-motion';

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
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 shadow-xl rounded-xl p-6 mb-6 border border-gray-700"
    >
      <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
        <span className="bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-lg mr-3">
          Match {matchNumber} of {totalMatches}
        </span>
        <span className="text-gray-300 text-sm">
          {new Date(matchDate).toLocaleDateString(undefined, { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <p className="text-gray-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Venue: <span className="text-white ml-1">{matchDetails.venue}</span>
          </p>
        </div>
          
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              {getTeamInfo(matchDetails.team1.name) && (
                <div className="w-16 h-16 relative mb-2 transform transition-transform duration-300 hover:scale-110">
                  <Image 
                    src={getTeamInfo(matchDetails.team1.name)?.teamLogoUrl || ''} 
                    alt={matchDetails.team1.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <span className="text-sm font-medium text-white">{matchDetails.team1.name}</span>
            </div>
            
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white text-lg font-bold">vs</span>
            
            <div className="flex flex-col items-center">
              {getTeamInfo(matchDetails.team2.name) && (
                <div className="w-16 h-16 relative mb-2 transform transition-transform duration-300 hover:scale-110">
                  <Image 
                    src={getTeamInfo(matchDetails.team2.name)?.teamLogoUrl || ''} 
                    alt={matchDetails.team2.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <span className="text-sm font-medium text-white">{matchDetails.team2.name}</span>
            </div>
          </div>
        </div>
          
        <div className="flex justify-center items-center md:justify-end bg-gray-900/50 p-4 rounded-lg">
          <div className="text-center">
            <p className="font-semibold text-indigo-400 mb-1">Result:</p>
            <p className="text-white">{matchDetails.result}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 