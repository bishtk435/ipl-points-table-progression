import Image from 'next/image';
import { motion } from 'framer-motion';
import { getTeamInfo } from '@/data/teams';
import { TeamStanding, ResultEntry } from '@/types/progress';
import { seasons } from '@/data/seasons';
import { FaTrophy } from 'react-icons/fa';

interface PointsTableProps {
  pointsTable: TeamStanding[];
  selectedTeamId: string | null;
  onSelectTeam: (teamId: string) => void;
  seasonYear: string;
  isLastMatch?: boolean;
}

export const PointsTable = ({ 
  pointsTable, 
  selectedTeamId, 
  onSelectTeam, 
  seasonYear,
  isLastMatch = false 
}: PointsTableProps) => {
  // Get champion team for this season
  const seasonData = seasons.find(season => season.season_year.toString() === seasonYear);
  const championTeamId = seasonData?.champion_team || '';
  const isPlayoffFormat = seasonData?.isPlayOffFormat || false;
  
  // Get the last 5 results for a team
  const getLast5Results = (results: ResultEntry[]) => {
    return results.slice(-5).map(result => {
      if (result.result === 'WIN') return 'W';
      if (result.result === 'LOSS') return 'L';
      return 'NR';
    });
  };

  // Get qualification message based on team rank and playoff format
  const getQualificationMessage = (rank: number) => {
    if (!isLastMatch) return null;
    
    if (isPlayoffFormat) {
      if (rank === 1 || rank === 2) return "Qualified for Qualifier 1";
      if (rank === 3 || rank === 4) return "Qualified for Eliminator";
    } else {
      if (rank <= 4) return "Qualified for Semi-finals";
    }
    return null;
  };

  const handleTeamClick = (teamId: string) => {
    onSelectTeam(teamId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gray-800/90 shadow-xl rounded-lg overflow-hidden border border-gray-700/50 backdrop-blur-sm"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700/50">
          <thead className="bg-gray-900/90">
            <tr className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              <th scope="col" className="px-3 py-2 text-left">#</th>
              <th scope="col" className="px-3 py-2 text-left">Team</th>
              <th scope="col" className="px-3 py-2 text-left">M</th>
              <th scope="col" className="px-3 py-2 text-left">W</th>
              <th scope="col" className="px-3 py-2 text-left">L</th>
              <th scope="col" className="px-3 py-2 text-left">Pts</th>
              <th scope="col" className="px-3 py-2 text-left">NRR</th>
              <th scope="col" className="px-3 py-2 text-left">Last 5</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {pointsTable.map((team, index) => {
              const isPlayoffTeam = team.rank <= 4;
              const isSelected = selectedTeamId === team.teamId;
              const isChampion = team.teamId === championTeamId;
              const teamInfo = getTeamInfo(team.teamName);
              const last5 = getLast5Results(team.result_progression);
              const qualificationMessage = getQualificationMessage(team.rank);
              
              return (
                <motion.tr 
                  key={team.teamId} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={`
                    cursor-pointer transition-colors duration-200
                    ${isSelected ? 'bg-indigo-700/70 hover:bg-indigo-700/80' : 
                      isPlayoffTeam ? 'bg-indigo-900/30 hover:bg-indigo-900/50' : 
                      'bg-gray-800/70 hover:bg-gray-700/80'}
                  `}
                  onClick={() => handleTeamClick(team.teamId)}
                >
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className={`
                      flex items-center justify-center w-5 h-5 rounded-full text-xs
                      ${isSelected ? 'bg-indigo-500 text-white' :
                        isChampion ? 'bg-amber-600 text-white' :
                        isPlayoffTeam ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}
                      font-bold
                    `}>
                      {team.rank}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="flex items-center">
                      {teamInfo?.teamLogoUrl && (
                        <div className="flex-shrink-0 h-8 w-8 relative mr-2">
                          <Image
                            src={teamInfo.teamLogoUrl}
                            alt={team.teamName}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm font-medium text-white">
                          {isLastMatch && isPlayoffTeam ? (
                            <span className="flex items-center">
                              {team.teamName} 
                              <span className="ml-1 text-xs font-semibold bg-indigo-500 text-white px-1 rounded">Q</span>
                            </span>
                          ) : team.teamName}
                          {isChampion && (
                            <FaTrophy className="ml-1.5 text-amber-400" size={12} title="Champion Team" />
                          )}
                        </div>
                        {qualificationMessage && (
                          <div className="text-[10px] text-emerald-400 font-medium mt-0.5">
                            {qualificationMessage}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-300">
                    {team.matches}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs text-green-400 font-medium">
                    {team.wins}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs text-red-400 font-medium">
                    {team.loss}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                      {team.points}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-300">
                    <span className={team.net_run_rate > 0 ? 'text-green-400' : team.net_run_rate < 0 ? 'text-red-400' : 'text-gray-400'}>
                      {team.net_run_rate > 0 ? '+' : ''}{team.net_run_rate.toFixed(3)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="flex space-x-0.5">
                      {last5.map((result, idx) => {
                        let bgColor = 'bg-gray-600';
                        let textColor = 'text-gray-200';
                        
                        if (result === 'W') {
                          bgColor = 'bg-green-500';
                          textColor = 'text-white';
                        } else if (result === 'L') {
                          bgColor = 'bg-red-500';
                          textColor = 'text-white';
                        } else if (result === 'NR') {
                          bgColor = 'bg-gray-500';
                          textColor = 'text-white';
                        }
                        
                        return (
                          <motion.div 
                            key={idx}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2, delay: 0.2 + idx * 0.05 }}
                            className={`${bgColor} ${textColor} w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-medium`}
                          >
                            {result}
                          </motion.div>
                        );
                      })}
                      {/* Fill with empty circles if less than 5 matches */}
                      {Array.from({ length: Math.max(0, 5 - last5.length) }).map((_, idx) => (
                        <motion.div 
                          key={`empty-${idx}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2, delay: 0.2 + (last5.length + idx) * 0.05 }}
                          className="bg-gray-800 border border-gray-600 w-5 h-5 flex items-center justify-center rounded-full"
                        />
                      ))}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}; 