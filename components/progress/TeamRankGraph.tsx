import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { getTeamInfo } from '@/data/teams';
import Image from 'next/image';
import { FaTrophy } from 'react-icons/fa';
import { seasons } from '@/data/seasons';
import { motion } from 'framer-motion';
import { PointsTableSnapshot } from '@/types/progress';

interface TeamRankGraphProps {
  progression: PointsTableSnapshot[];
  teamId: string;
  currentIndex: number;
  seasonYear?: string;
}

interface GraphDataPoint {
  matchNumber: number;
  rank: number;
  date: string;
  dotColor: string;
}

interface DotProps {
  cx?: number;
  cy?: number;
  payload?: GraphDataPoint;
  [key: string]: unknown;
}

// Define a custom dot component
const CustomDot = (props: DotProps) => {
  const { cx, cy, payload } = props;
  if (!cx || !cy || !payload) return null;
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={payload.dotColor === DOT_COLORS.DEFAULT ? 4 : 5} 
      fill={payload.dotColor} 
      stroke="#111" 
      strokeWidth={1}
    />
  );
};

const DOT_COLORS = {
  DEFAULT: '#8884d8',
  NO_RESULT: '#6B7280',
  WIN: '#10B981',
  LOSS: '#EF4444',
}

// Define a custom active dot component
const CustomActiveDot = (props: DotProps) => {
  const { cx, cy, payload } = props;
  if (!cx || !cy || !payload) return null;
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={6} 
      fill={payload.dotColor} 
      stroke="#fff" 
      strokeWidth={2}
    />
  );
};

export const TeamRankGraph = ({
  progression,
  teamId,
  currentIndex,
  seasonYear
}: TeamRankGraphProps) => {
  const [graphData, setGraphData] = useState<Array<GraphDataPoint>>([]);

  // Get champion team for this season if seasonYear is provided
  const seasonData = seasonYear ? seasons.find(season => season.season_year.toString() === seasonYear) : undefined;
  const championTeamId = seasonData?.champion_team || '';
  const isChampion = teamId === championTeamId;

  useEffect(() => {
    // Generate data for the graph
    const data = progression.map(snapshot => {
      const teamStanding = snapshot.pointsTable.find(team => team.teamId === teamId);
      const isCurrentTeamMatch = snapshot.matchDetails.team1.id === teamId || snapshot.matchDetails.team2.id === teamId;

      // Some Default color
      let dotColor = DOT_COLORS.DEFAULT;

      if (isCurrentTeamMatch) {
        if (snapshot.matchDetails.result === "No Result") {
          dotColor = DOT_COLORS.NO_RESULT;
        } else {
          dotColor = snapshot.matchDetails.winningTeamId === teamId 
            ? DOT_COLORS.WIN
            : DOT_COLORS.LOSS;
        }
      }
      return {
        matchNumber: snapshot.matchNumber,
        rank: teamStanding?.rank || 0,
        date: snapshot.matchDate,
        dotColor: dotColor
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
      className="bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-700 flex flex-col h-full"
    >
      {/* Compact Header */}
      <div className="p-4 bg-gray-900/70 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {teamInfo?.teamLogoUrl && (
              <div className="w-8 h-8 relative mr-2">
                <Image
                  src={teamInfo.teamLogoUrl}
                  alt={teamInfo.name || 'Team'}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center">
                {teamInfo?.name || 'Team'}
                {isChampion && (
                  <FaTrophy className="ml-2 text-amber-400" size={14} title="Champion Team" />
                )}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="text-xs text-gray-400 mr-2">Current Rank</div>
            <div className="flex items-center">
              <span className="text-lg font-bold text-white mr-1">{currentRank}</span>
              {rankTrend === 'up' && (
                <span className="text-green-400 text-xs ml-1">▲</span>
              )}
              {rankTrend === 'down' && (
                <span className="text-red-400 text-xs ml-1">▼</span>
              )}
              {rankTrend === 'same' && (
                <span className="text-gray-400 text-xs ml-1 font-bold">-</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Chart Area */}
      <div className="flex-grow p-2">
        <div className="h-full min-h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={visibleData}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#555" opacity={0.5} />
              <XAxis
                dataKey="matchNumber"
                stroke="#aaa"
                tick={{ fill: '#aaa', fontSize: 11 }}
              />
              <YAxis
                reversed
                domain={[1, maxRank]}
                ticks={Array.from({ length: maxRank }, (_, i) => i + 1)}
                stroke="#aaa"
                tick={{ fill: '#aaa', fontSize: 11 }}
                width={20}
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
                  value: 'Playoffs',
                  position: 'insideBottomRight',
                  fill: '#8883cc',
                  fontSize: 10
                }}
              />
              <Line
                type="monotone"
                dataKey="rank"
                stroke="#8884d8"
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={<CustomActiveDot />}
                isAnimationActive={false}
                name="Rank"
              />
              <Legend verticalAlign="bottom" height={15} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compact Footer */}
      <div className="px-3 py-2 text-sm text-gray-300 bg-gray-800/80 border-t border-gray-700">
        <p className="flex items-center justify-center">
          <span className="h-0.5 w-12 bg-indigo-400 rounded mr-2"></span>
          Teams above rank 4 qualify for playoffs
          <span className="h-0.5 w-12 bg-indigo-400 rounded ml-2"></span>
        </p>
      </div>
    </motion.div>
  );
};