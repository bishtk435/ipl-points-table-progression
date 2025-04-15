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
    <Card className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold text-lg shrink-0">
                {year}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">IPL {year}</h3>
                <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-x-4 gap-y-1 mt-1">
                  <span className="flex items-center gap-1">
                    <FiCalendar className="w-3 h-3 shrink-0" />
                    <span className="truncate">{formatDate(startDate)} - {formatDate(endDate)}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <FiUsers className="w-3 h-3 shrink-0" />
                    <span>{numberOfTeams} Teams</span>
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <FiAward className="w-3 h-3 shrink-0" />
                    <span>{numberOfMatches} Matches</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <BiTrophy className="h-4 w-4 text-yellow-500 shrink-0" />
                  <span className="text-sm font-medium whitespace-nowrap">{championTeam?.shortName || championTeam?.name}</span>
                </div>
                
                {championTeam?.teamLogoUrl && (
                  <div className="w-8 h-8 relative shrink-0">
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
              
              <Link href={`/season/${year}`} passHref>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs whitespace-nowrap flex items-center gap-1 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-200 transform hover:translate-x-1 transition-all"
                >
                  <FiTrendingUp className="w-3 h-3" />
                  <span className="hidden md:inline">View</span> Progression
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 