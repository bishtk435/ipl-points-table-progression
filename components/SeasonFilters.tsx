import React from 'react';
import { FiSearch } from 'react-icons/fi';

interface FilterOption {
  id: string;
  name: string;
  shortName?: string;
}

interface SeasonFiltersProps {
  sortOrder: 'asc' | 'desc';
  onSortChange: (value: 'asc' | 'desc') => void;
  championFilter: string | null;
  championTeams: FilterOption[];
  onChampionFilterChange: (value: string | null) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  seasonCount: number;
  minYear: number;
  maxYear: number;
}

export function SeasonFilters({
  sortOrder,
  onSortChange,
  championFilter,
  championTeams,
  onChampionFilterChange,
  searchTerm,
  onSearchChange,
  seasonCount,
  minYear,
  maxYear
}: SeasonFiltersProps) {
  return (
    <div className="flex flex-col mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">IPL Seasons</h2>
        
        <p className="text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
          {seasonCount} seasons ({minYear} - {maxYear})
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <div className="flex items-center space-x-2">
          <label htmlFor="sort-order" className="text-sm text-gray-600 dark:text-gray-400 min-w-16">Sort by:</label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as 'asc' | 'desc')}
            className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg flex-grow focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 focus:outline-none transition-all duration-200"
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="champion-filter" className="text-sm text-gray-600 dark:text-gray-400 min-w-16">Champion:</label>
          <select
            id="champion-filter"
            value={championFilter || "all"}
            onChange={(e) => onChampionFilterChange(e.target.value === "all" ? null : e.target.value)}
            className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg flex-grow focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 focus:outline-none transition-all duration-200"
          >
            <option value="all">All Champions</option>
            {championTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.shortName ? `${team.shortName} - ${team.name}` : team.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search seasons..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 focus:outline-none transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
} 