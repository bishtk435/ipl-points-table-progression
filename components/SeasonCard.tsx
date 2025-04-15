import { FiCalendar, FiUsers, FiAward, FiTrendingUp } from "react-icons/fi";
import { BiTrophy } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TeamInfo } from "@/data/teams";

interface SeasonCardProps {
  year: number;
  startDate: string;
  endDate: string;
  numberOfTeams: number;
  numberOfMatches: number;
  championTeam: TeamInfo | undefined;
  formatDate: (dateString: string) => string;
}

export function SeasonCard({
  year,
  startDate,
  endDate,
  numberOfTeams,
  numberOfMatches,
  championTeam,
  formatDate
}: SeasonCardProps) {
  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-800 border-0 shadow-md hover:shadow-xl group transition-all duration-300 ease-out rounded-3xl">
      <CardContent className="p-0">
        <div className="p-6 group-hover:scale-[1.02] transform transition-transform duration-300 ease-out">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-5">
              <div className="flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 dark:from-violet-600 dark:to-indigo-800 text-white font-bold text-2xl shrink-0 shadow-md backdrop-blur-sm border border-violet-400/30 dark:border-indigo-500/30 transition-all duration-300 ease-out group-hover:from-indigo-500 group-hover:to-violet-600 dark:group-hover:from-indigo-600 dark:group-hover:to-violet-800">
                {year}
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">IPL {year}</h3>
                <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-x-5 gap-y-2">
                  <span className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
                    <span className="truncate">{formatDate(startDate)} - {formatDate(endDate)}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <FiUsers className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
                    <span>{numberOfTeams} Teams</span>
                  </span>
                  <span className="hidden sm:flex items-center gap-2">
                    <FiAward className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
                    <span>{numberOfMatches} Matches</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-5 mt-2 sm:mt-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <BiTrophy className="h-6 w-6 text-yellow-500 shrink-0" />
                  <span className="text-sm font-semibold whitespace-nowrap text-gray-700 dark:text-gray-300">{championTeam?.shortName || championTeam?.name}</span>
                </div>
                
                {championTeam?.teamLogoUrl && (
                  <div className="w-12 h-12 relative shrink-0 ml-1">
                    <Image
                      src={championTeam.teamLogoUrl}
                      alt={championTeam.name}
                      width={48}
                      height={48}
                      className="object-contain drop-shadow-md"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Link href={`/progress/${year}`} passHref>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs whitespace-nowrap flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-200 transform hover:translate-x-1 transition-all rounded-lg border-gray-200 dark:border-gray-700 shadow-sm px-4 py-2.5 font-medium"
                  >
                    <FiTrendingUp className="w-4 h-4" />
                    <span className="hidden md:inline">View</span> Season
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 