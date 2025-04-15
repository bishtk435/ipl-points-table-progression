"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { FiSearch, FiChevronDown, FiChevronUp, FiCalendar, FiUsers, FiAward } from "react-icons/fi";
import { BiTrophy } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { seasons } from "@/data/seasons";
import { IPL_TEAMS } from "@/data/teams";

export default function HomePage() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterTeam, setFilterTeam] = useState<string | null>(null);
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Toggle expand collapse
  const toggleExpand = (seasonYear: number) => {
    setExpandedSeason(expandedSeason === seasonYear ? null : seasonYear);
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
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
              IPL Points Table Progression
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore the journey of IPL seasons through stats, standings, and progressions.
              Discover how teams performed throughout each tournament.
            </p>
          </div>
          
          {/* Most Successful Teams Summary */}
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Most Successful Teams</h2>
            <div className="flex flex-wrap gap-2">
              {championshipCounts.map((team, index) => (
                <button
                  key={team.id}
                  onClick={() => setFilterTeam(team.id === filterTeam ? null : team.id)}
                  className={`flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                    team.id === filterTeam 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } transition-colors`}
                >
                  <span className="flex items-center">
                    {index < 3 && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1 text-yellow-500">
                        <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
                      </svg>
                    )}
                    {team.shortName || team.name}
                  </span>
                  <span className="ml-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {team.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">IPL Seasons</h2>
                
                <p className="text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                  {seasons.length} seasons ({Math.min(...seasons.map(s => s.season_year))} - {Math.max(...seasons.map(s => s.season_year))})
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <label htmlFor="sort-order" className="text-sm text-gray-600 dark:text-gray-400 min-w-16">Sort by:</label>
                  <select
                    id="sort-order"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                    className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md flex-grow"
                  >
                    <option value="desc">Newest first</option>
                    <option value="asc">Oldest first</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label htmlFor="champion-filter" className="text-sm text-gray-600 dark:text-gray-400 min-w-16">Champion:</label>
                  <select
                    id="champion-filter"
                    value={filterTeam || "all"}
                    onChange={(e) => setFilterTeam(e.target.value === "all" ? null : e.target.value)}
                    className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md flex-grow"
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
              </div>
            </div>
            
            {filteredAndSortedSeasons.length > 0 ? (
              <div className="space-y-4">
                {filteredAndSortedSeasons.map((season) => {
                  const championTeam = getTeamDetails(season.champion_team);
                  const isExpanded = expandedSeason === season.season_year;
                  
                  return (
                    <div 
                      key={season.season_year}
                      className={`transition-all duration-200 hover:translate-x-1 ${isExpanded ? '' : 'hover:shadow-md'}`}
                    >
                      <Card className={`overflow-hidden ${
                        isExpanded 
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 shadow-md' 
                          : 'bg-white dark:bg-gray-800'
                        } border-gray-200 dark:border-gray-700`}
                      >
                        <CardContent className="p-0">
                          <button 
                            onClick={() => toggleExpand(season.season_year)}
                            className="w-full text-left p-4 focus:outline-none transition-colors"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold">
                                  {season.season_year}
                                </div>
                                
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">IPL {season.season_year}</h3>
                                  <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-x-4">
                                    <span className="flex items-center gap-1">
                                      <FiCalendar className="w-3 h-3" />
                                      {formatDate(season.start_date)} - {formatDate(season.end_date)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <FiUsers className="w-3 h-3" />
                                      {season.number_of_teams} Teams
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <FiAward className="w-3 h-3" />
                                      {season.number_of_matches} Matches
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="flex items-center">
                                  <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1">
                                      <BiTrophy className="h-4 w-4 text-yellow-500" />
                                      <span className="text-sm font-medium">{championTeam?.shortName || championTeam?.name}</span>
                                    </div>
                                  </div>
                                  
                                  {championTeam?.teamLogoUrl && (
                                    <div className="w-8 h-8 relative ml-2">
                                      <Image
                                        src={championTeam.teamLogoUrl}
                                        alt={championTeam.name}
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                      />
                                    </div>
                                  )}
                                </div>
                                
                                <div className="text-gray-400">
                                  {isExpanded ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
                                </div>
                              </div>
                            </div>
                          </button>
                          
                          {isExpanded && (
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Season Summary</h4>
                                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <dt className="text-gray-500 dark:text-gray-400">Champion</dt>
                                    <dd className="font-medium text-gray-900 dark:text-white">{championTeam?.name}</dd>
                                    
                                    <dt className="text-gray-500 dark:text-gray-400">Runner-up</dt>
                                    <dd>{getTeamDetails(season.runner_up_team)?.name}</dd>
                                    
                                    <dt className="text-gray-500 dark:text-gray-400">Orange Cap</dt>
                                    <dd>{season.orange_cap_player.split('-')[0]}</dd>
                                    
                                    <dt className="text-gray-500 dark:text-gray-400">Purple Cap</dt>
                                    <dd>{season.purple_cap_player.split('-')[0]}</dd>
                                    
                                    <dt className="text-gray-500 dark:text-gray-400">MVP</dt>
                                    <dd>{season.most_valuable_player.split('-')[0]}</dd>
                                  </dl>
                                </div>
                                
                                <div>
                                  <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Tournament Details</h4>
                                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <dt className="text-gray-500 dark:text-gray-400">Teams</dt>
                                    <dd className="font-medium text-gray-900 dark:text-white">{season.number_of_teams}</dd>
                                    
                                    <dt className="text-gray-500 dark:text-gray-400">Matches</dt>
                                    <dd>{season.number_of_matches}</dd>
                                    
                                    <dt className="text-gray-500 dark:text-gray-400">Duration</dt>
                                    <dd>
                                      {Math.ceil((new Date(season.end_date).getTime() - new Date(season.start_date).getTime()) / (1000 * 3600 * 24))} days
                                    </dd>
                                    
                                    <dt className="text-gray-500 dark:text-gray-400">Emerging Player</dt>
                                    <dd>{season.emerging_player.split('-')[0]}</dd>
                                    
                                    <dt className="text-gray-500 dark:text-gray-400">Fair Play Award</dt>
                                    <dd>
                                      {season.fair_play_award_team.map(teamId => {
                                        const team = getTeamDetails(teamId);
                                        return team?.shortName || "Unknown";
                                      }).join(", ")}
                                    </dd>
                                  </dl>
                                </div>
                              </div>
                              
                              <div className="mt-4 text-right">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-xs bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  View detailed stats
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">No seasons found with the selected filters.</p>
                <button 
                  onClick={() => {
                    setFilterTeam(null);
                    setSearchTerm("");
                  }}
                  className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
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