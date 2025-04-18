import React from 'react';
import Image from 'next/image';

interface TeamChip {
  id: string;
  name: string;
  shortName: string;
  count: number;
  logoUrl?: string;
}

interface TeamFilterChipsProps {
  teams: TeamChip[];
  activeTeamId: string | null;
  onTeamSelect: (teamId: string) => void;
}

export function TeamFilterChips({ teams, activeTeamId, onTeamSelect }: TeamFilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {teams.map((team, index) => (
        <button
          key={team.id}
          onClick={() => onTeamSelect(team.id)}
          className={`flex items-center px-3 py-2 rounded-full text-sm font-medium ${
            team.id === activeTeamId 
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-2 border-blue-300 dark:border-blue-700' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
          } transition-all duration-200 shadow-sm hover:shadow`}
        >
          <span className="flex items-center">
            {team.logoUrl ? (
              <span className="w-5 h-5 mr-1.5 relative flex-shrink-0">
                <Image
                  src={team.logoUrl}
                  alt={team.name}
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </span>
            ) : index < 3 && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1 text-yellow-500">
                <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
              </svg>
            )}
            {team.shortName || team.name}
          </span>
          <span className="ml-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-inner">
            {team.count}
          </span>
        </button>
      ))}
    </div>
  );
} 