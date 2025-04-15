import Image from 'next/image';
import { motion } from 'framer-motion';
import { getTeamInfo } from '@/data/teams';
import { TeamStanding, ResultEntry } from '@/types/progress';

interface PointsTableProps {
  pointsTable: TeamStanding[];
}

export const PointsTable = ({ pointsTable }: PointsTableProps) => {
  // Get the last 5 results for a team
  const getLast5Results = (results: ResultEntry[]) => {
    return results.slice(-5).map(result => {
      if (result.result === 'WIN') return 'W';
      if (result.result === 'LOSS') return 'L';
      return 'NR';
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-700"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Team
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                M
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                W
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                L
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Pts
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                NRR
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Last 5
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {pointsTable.map((team, index) => {
              const isPlayoffTeam = team.rank <= 4;
              const teamInfo = getTeamInfo(team.teamName);
              const last5 = getLast5Results(team.result_progression);
              
              return (
                <motion.tr 
                  key={team.teamId} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={isPlayoffTeam ? 'bg-indigo-900/30' : 'bg-gray-800 hover:bg-gray-700'}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full 
                      ${isPlayoffTeam ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}
                      font-bold text-sm
                    `}>
                      {team.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {teamInfo?.teamLogoUrl && (
                        <div className="flex-shrink-0 h-10 w-10 relative mr-3">
                          <Image
                            src={teamInfo.teamLogoUrl}
                            alt={team.teamName}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-white">
                          {team.teamName}
                        </div>
                        {isPlayoffTeam && (
                          <div className="text-xs text-indigo-400">
                            Playoff Qualification
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {team.matches}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                    {team.wins}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400">
                    {team.loss}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                      {team.points}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {team.net_run_rate > 0 ? '+' : ''}{team.net_run_rate.toFixed(3)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
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
                            transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                            className={`${bgColor} ${textColor} w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium`}
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
                          transition={{ duration: 0.3, delay: 0.3 + (last5.length + idx) * 0.1 }}
                          className="bg-gray-800 border border-gray-600 w-6 h-6 flex items-center justify-center rounded-full"
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