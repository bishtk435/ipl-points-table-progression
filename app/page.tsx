"use client";

import { useState, useMemo } from "react";
import { SeasonCard } from "@/components/SeasonCard";
import { TeamFilterChips } from "@/components/TeamFilterChips";
import { SeasonFilters } from "@/components/SeasonFilters";
import { seasons } from "@/data/seasons";
import { IPL_TEAMS } from "@/data/teams";
import { BiTrophy } from "react-icons/bi";
import { AiOutlineTable, AiOutlineBarChart } from "react-icons/ai";
import Link from "next/link";

export default function HomePage() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterTeam, setFilterTeam] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle team filter toggle
  const handleTeamFilter = (teamId: string) => {
    setFilterTeam(teamId === filterTeam ? null : teamId);
  };

  // Get champions count for each team
  const championshipCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    seasons.forEach(season => {
      if (!counts[season.champion_team]) {
        counts[season.champion_team] = 0;
      }
      counts[season.champion_team]++;
    });
    
    // Convert to array and sort by count
    return Object.entries(counts)
      .map(([teamId, count]) => {
        const team = IPL_TEAMS.find(t => t.id === teamId);
        return {
          id: teamId,
          name: team?.name || "Unknown Team",
          shortName: team?.shortName || "",
          count,
          logoUrl: team?.teamLogoUrl
        };
      })
      .sort((a, b) => b.count - a.count);
  }, []);

  // Get unique champion teams for dropdown
  const championTeams = useMemo(() => {
    const uniqueTeamIds = new Set<string>();
    seasons.forEach(season => uniqueTeamIds.add(season.champion_team));
    
    return Array.from(uniqueTeamIds)
      .map(teamId => {
        const team = IPL_TEAMS.find(t => t.id === teamId);
        return {
          id: teamId,
          name: team?.name || "Unknown Team",
          shortName: team?.shortName || ""
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Filter and sort seasons
  const filteredAndSortedSeasons = useMemo(() => {
    let filtered = [...seasons];
    
    // Filter by champion team if selected
    if (filterTeam) {
      filtered = filtered.filter(season => {
        return season.champion_team === filterTeam;
      });
    }
    
    // Filter by search
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(season => {
        // Search by year
        if (season.season_year.toString().includes(lowerSearchTerm)) {
          return true;
        }
        
        // Get team info for champion team
        const teamId = season.champion_team;
        const team = IPL_TEAMS.find(t => t.id === teamId);
        if (team && team.name.toLowerCase().includes(lowerSearchTerm)) {
          return true;
        }
        
        return false;
      });
    }
    
    // Sort by year
    return filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.season_year - b.season_year;
      } else {
        return b.season_year - a.season_year;
      }
    });
  }, [seasons, sortOrder, filterTeam, searchTerm]);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return dateString;
    }
  };

  // Get team details from ID
  const getTeamDetails = (teamId: string) => {
    return IPL_TEAMS.find(team => team.id === teamId);
  };

  // Get last 5 seasons for quick links
  const recentSeasons = useMemo(() => {
    return [...seasons]
      .sort((a, b) => b.season_year - a.season_year)
      .slice(0, 5);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="flex flex-col items-center justify-between p-4 md:p-8 lg:p-12 flex-1">
        <div className="max-w-6xl w-full">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
              IPL Points Table Progression
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore the journey of IPL seasons through points table progressions.
              Discover how teams performed throughout each tournament.
            </p>
          </div>
          
          {/* Points Table Progression Feature */}
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <AiOutlineBarChart className="h-6 w-6 text-indigo-500" />
                  Points Table Progression
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Watch how the points table evolved match by match throughout the season. See teams rise and fall in the standings as the tournament progresses.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
                  {recentSeasons.map((season) => (
                    <Link 
                      key={season.season_year}
                      href={`/progress/${season.season_year}`}
                      className="flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 py-2 px-3 rounded-lg font-medium text-sm transition-all"
                    >
                      <AiOutlineTable className="mr-1 h-4 w-4" />
                      {season.season_year}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg w-full md:w-64">
                <div className="text-white text-lg font-semibold mb-2">Features:</div>
                <ul className="text-white/90 text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">•</span> Dynamic table updates
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span> Match-by-match progression
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span> Team performance tracking
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span> Interactive playback controls
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Most Successful Teams Summary */}
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4"><span className="flex items-center gap-2">Most Successful Teams <BiTrophy className="h-6 w-6 text-yellow-500 shrink-0" /></span>
            </h2>
            <TeamFilterChips 
              teams={championshipCounts}
              activeTeamId={filterTeam}
              onTeamSelect={handleTeamFilter}
            />
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <SeasonFilters
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
              championFilter={filterTeam}
              championTeams={championTeams}
              onChampionFilterChange={setFilterTeam}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              seasonCount={seasons.length}
              minYear={Math.min(...seasons.map(s => s.season_year))}
              maxYear={Math.max(...seasons.map(s => s.season_year))}
            />
            
            {filteredAndSortedSeasons.length > 0 ? (
              <div className="grid gap-4">
                {filteredAndSortedSeasons.map((season) => (
                  <div 
                    key={season.season_year}
                    className="transition-all duration-300 ease-in-out"
                  >
                    <SeasonCard
                      year={season.season_year}
                      startDate={season.start_date}
                      endDate={season.end_date}
                      numberOfTeams={season.number_of_teams}
                      numberOfMatches={season.number_of_matches}
                      championTeam={getTeamDetails(season.champion_team)}
                      formatDate={formatDate}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">No seasons found with the selected filters.</p>
                <button 
                  onClick={() => {
                    setFilterTeam(null);
                    setSearchTerm("");
                  }}
                  className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg transition-all duration-200"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
          
          <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4">
              <p>&copy; {new Date().getFullYear()} IPL Stats and Progressions</p>
              <div className="flex items-center space-x-4">
                <span>•</span>
                <span>Data sourced from official IPL records</span>
                <span>•</span>
                <span>Updated through IPL {Math.max(...seasons.map(s => s.season_year))}</span>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
