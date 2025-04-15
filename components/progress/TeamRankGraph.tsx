import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { PointsTableSnapshot } from '@/types/progress';
import { motion } from 'framer-motion';
import { getTeamInfo } from '@/data/teams';
import Image from 'next/image';

interface TeamRankGraphProps {
  progression: PointsTableSnapshot[];
  teamId: string;
  currentIndex: number;
}

export const TeamRankGraph = ({ progression, teamId, currentIndex }: TeamRankGraphProps) => {
  const [graphData, setGraphData] = useState<Array<{ matchNumber: number; rank: number; date: string }>>([]);
  
  useEffect(() => {
    // Generate data for the graph
    const data = progression.map(snapshot => {
      const teamStanding = snapshot.pointsTable.find(team => team.teamId === teamId);
      return {
        matchNumber: snapshot.matchNumber,
        rank: teamStanding?.rank || 0,
        date: snapshot.matchDate
      };
    }).filter(item => item.rank > 0);
    
    setGraphData(data);
  }, [progression, teamId]);
  
  const teamInfo = getTeamInfo(progression[0]?.pointsTable.find(team => team.teamId === teamId)?.teamName || '');
  
  // Only display up to current index
  const visibleData = graphData.slice(0, currentIndex + 1);
  
  // Calculate domain for YAxis (always making 1 the min rank)
  const maxRank = Math.max(...graphData.map(d => d.rank), 10);
  
  // Get current rank and trend
  const currentRank = visibleData.length > 0 ? visibleData[visibleData.length - 1].rank : 0;
  const previousRank = visibleData.length > 1 ? visibleData[visibleData.length - 2].rank : currentRank;
  const rankTrend = currentRank < previousRank ? 'up' : (currentRank > previousRank ? 'down' : 'same');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-700"
    >
      <div className="p-4 bg-gray-900/70 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {teamInfo?.teamLogoUrl && (
              <div className="w-12 h-12 relative mr-3">
                <Image
                  src={teamInfo.teamLogoUrl}
                  alt={teamInfo.name || 'Team'}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold text-white">
                {teamInfo?.name || 'Team'} 
              </h3>
              <div className="text-sm text-gray-300">
                Rank Progression Analysis
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-400">Current Rank</div>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white mr-2">{currentRank}</span>
              {rankTrend === 'up' && (
                <span className="text-green-400 text-xs">▲ Improved</span>
              )}
              {rankTrend === 'down' && (
                <span className="text-red-400 text-xs">▼ Dropped</span>
              )}
              {rankTrend === 'same' && (
                <span className="text-gray-400 text-xs">• Unchanged</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={visibleData}
              margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis 
                dataKey="matchNumber" 
                label={{ value: 'Match Number', position: 'insideBottomRight', offset: -5, fill: '#aaa' }}
                stroke="#aaa"
                tick={{ fill: '#aaa' }}
              />
              <YAxis 
                reversed 
                domain={[1, maxRank]}
                label={{ value: 'Rank', angle: -90, position: 'insideLeft', fill: '#aaa', dy: 50 }}
                ticks={Array.from({ length: maxRank }, (_, i) => i + 1)}
                stroke="#aaa"
                tick={{ fill: '#aaa' }}
              />
              <Tooltip 
                formatter={(value: number) => [`Rank: ${value}`, '']}
                labelFormatter={(label) => `Match ${label}`}
                contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
                itemStyle={{ color: '#fff' }}
              />
              <ReferenceLine 
                y={4.5} 
                stroke="#8883cc" 
                strokeDasharray="3 3" 
                label={{ 
                  value: 'Playoff Qualification', 
                  position: 'right', 
                  fill: '#8883cc',
                  fontSize: 12
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="rank" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8', r: 4, strokeWidth: 1, stroke: '#111' }}
                activeDot={{ r: 8, fill: '#fff', stroke: '#8884d8', strokeWidth: 2 }}
                isAnimationActive={false}
                name="Rank"
              />
              <Legend verticalAlign="bottom" align="center" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
          <p>
            Teams placed <span className="font-semibold text-indigo-400">at or above rank 4</span> qualify 
            for the playoffs. {currentRank <= 4 ? (
              <span className="text-green-400">
                Currently on track for playoff qualification!
              </span>
            ) : (
              <span className="text-yellow-400">
                Needs to improve ranking to qualify for playoffs.
              </span>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}; 