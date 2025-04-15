"use client";

import { useState, useMemo } from "react";
import { SeasonCard } from "@/components/SeasonCard";
import { TeamFilterChips } from "@/components/TeamFilterChips";
import { SeasonFilters } from "@/components/SeasonFilters";
import { seasons } from "@/data/seasons";
import { IPL_TEAMS } from "@/data/teams";
import { BiTrophy } from "react-icons/bi";

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

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="flex flex-col items-center justify-between p-4 md:p-8 lg:p-12 flex-1">
        <div className="max-w-6xl w-full">
          
          {/* Points Table Progression Feature */}
          <div className="shadow-xl rounded-xl mb-8">
            <div className="flex flex-col items-center text-center mb-6">
              <h5 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-4">
                Points Table Progression
              </h5>
              <p className="text-lg md:text-xl font-medium text-gray-600 dark:text-gray-300 max-w-3xl">
                Visualize the dynamic journey of teams throughout the tournament with our interactive points table progression tool.
              </p>
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
