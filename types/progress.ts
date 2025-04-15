export interface MatchDetails {
  team1: {
    id: string;
    name: string;
  };
  team2: {
    id: string;
    name: string;
  };
  venue: string;
  result: string;
  winningTeamId: string;
  margin: {
    wickets?: number;
    runs?: number;
  };
}

export interface ResultEntry {
  result: 'WIN' | 'LOSS' | 'NO_RESULT';
  opponentTeamId: string;
  date: string;
  matchId: number;
}

export interface TeamStanding {
  teamId: string;
  teamName: string;
  rank: number;
  matches: number;
  wins: number;
  loss: number;
  no_results: number;
  points: number;
  net_run_rate: number;
  runs_scored: number;
  overs_played: number;
  runs_conceded: number;
  overs_bowled: number;
  result_progression: ResultEntry[];
}

export interface PointsTableSnapshot {
  matchNumber: number;
  matchDate: string;
  matchDetails: MatchDetails;
  pointsTable: TeamStanding[];
}

export interface PointsProgression {
  season: string;
  progression: PointsTableSnapshot[];
} 