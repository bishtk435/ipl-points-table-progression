/**
 * Teams constants for IPL data processing
 * Generated from team data in all_seasons.json
 */

/**
 * Interface for team information
 */
export interface TeamInfo {
    name: string;
    id: string;
    shortName?: string;
    previousNames: string[];
    homeVenueId?: string;
    teamLogoUrl?: string;
    primaryColor?: string;
}

/**
 * All IPL teams across all seasons
 */
export const IPL_TEAMS: TeamInfo[] = [
    {
        name: "Royal Challengers Bengaluru",
        id: "royal-challengers-bengaluru-335970",
        shortName: "RCB",
        previousNames: ['Royal Challengers Bangalore'],
        homeVenueId: "m-chinnaswamy-stadium-bengaluru-57897",
        teamLogoUrl: "/team_logos/RCB.avif",
        primaryColor: "#D1161E"
    },
    {
        name: "Kolkata Knight Riders",
        id: "kolkata-knight-riders-335971",
        shortName: "KKR",
        previousNames: [],
        homeVenueId: "eden-gardens-kolkata-57980",
        teamLogoUrl: "/team_logos/KKR.avif",
        primaryColor: "#3A225D"
    },
    {
        name: "Punjab Kings",
        id: "punjab-kings-335973",
        shortName: "PBKS",
        previousNames: ['Kings XI Punjab'],
        homeVenueId: "i-s-bindra-punjab-cricket-association-stadium-57991",
        teamLogoUrl: "/team_logos/PBK.avif",
        primaryColor: "#ED1B24"
    },
    {
        name: "Chennai Super Kings",
        id: "chennai-super-kings-335974",
        shortName: "CSK",
        previousNames: [],
        homeVenueId: "ma-chidambaram-stadium-chepauk-chennai-58008",
        teamLogoUrl: "/team_logos/CSK.avif",
        primaryColor: "#F9CD05"
    },
    {
        name: "Delhi Capitals",
        id: "delhi-capitals-335975",
        shortName: "DC",
        previousNames: ['Delhi Daredevils'],
        homeVenueId: "arun-jaitley-stadium-delhi-58040",
        teamLogoUrl: "/team_logos/DC.avif",
        primaryColor: "#0078BC"
    },
    {
        name: "Rajasthan Royals",
        id: "rajasthan-royals-335977",
        shortName: "RR",
        previousNames: [],
        homeVenueId: "sawai-mansingh-stadium-jaipur-58162",
        teamLogoUrl: "/team_logos/RR.avif",
        primaryColor: "#EA1A85"
    },
    {
        name: "Mumbai Indians",
        id: "mumbai-indians-335978",
        shortName: "MI",
        previousNames: [],
        homeVenueId: "wankhede-stadium-mumbai-58324",
        teamLogoUrl: "/team_logos/MI.avif",
        primaryColor: "#004BA0"
    },
    {
        name: "Deccan Chargers",
        id: "deccan-chargers-335980",
        shortName: "DEC",
        previousNames: [],
        homeVenueId: "rajiv-gandhi-international-stadium-uppal-hyderabad-58142",
        teamLogoUrl: "/team_logos/DEC.avif",
        primaryColor: "#D1B000"
    },
    {
        name: "Kochi Tuskers Kerala",
        id: "kochi-tuskers-kerala-474668",
        shortName: "KTK",
        previousNames: [],
        teamLogoUrl: "/team_logos/KTK.avif",
        primaryColor: "#FF6600"
    },
    {
        name: "Pune Warriors",
        id: "pune-warriors-474666",
        shortName: "PWI",
        previousNames: [],
        homeVenueId: "subrata-roy-stadium-pune-58143",
        teamLogoUrl: "/team_logos/PWI.avif",
        primaryColor: "#2F9BE3"
    },
    {
        name: "Sunrisers Hyderabad",
        id: "sunrisers-hyderabad-628333",
        shortName: "SRH",
        previousNames: [],
        homeVenueId: "hyderabad-international-cricket-stadium-hyderabad-58144",
        teamLogoUrl: "/team_logos/SRH.avif",
        primaryColor: "#F7A721"
    },
    {
        name: "Rising Pune Supergiants",
        id: "rising-pune-supergiant-968721",
        shortName: "RPS",
        previousNames: [],
        homeVenueId: "subrata-roy-stadium-pune-58143",
        teamLogoUrl: "/team_logos/RPS.avif",
        primaryColor: "#803B85"
    },
    {
        name: "Gujarat Lions",
        id: "gujarat-lions-968725",
        shortName: "GL",
        previousNames: [],
        homeVenueId: "narendra-modi-stadium-ahmedabad-58145",
        teamLogoUrl: "/team_logos/GL.avif",
        primaryColor: "#E05D0D"
    },
    {
        name: "Lucknow Super Giants",
        id: "lucknow-super-giants-1298768",
        shortName: "LSG",
        previousNames: [],
        homeVenueId: "narendra-modi-stadium-ahmedabad-58145",
        teamLogoUrl: "/team_logos/LSG.avif",
        primaryColor: "#A72056"
    },
    {
        name: "Gujarat Titans",
        id: "gujarat-titans-1298769",
        shortName: "GT",
        previousNames: [],
        homeVenueId: "narendra-modi-stadium-ahmedabad-58145",
        teamLogoUrl: "/team_logos/GT.avif",
        primaryColor: "#1C3C7C"
    }
];

/**
 * Team name aliases (mapped to canonical names)
 */
export const TEAM_ALIASES: Record<string, string> = {
    "Delhi Daredevils": "Delhi Capitals",
    "Rising Pune Supergiant": "Rising Pune Supergiants",
    "Kings XI Punjab": "Punjab Kings",
    "Royal Challengers Bangalore": "Royal Challengers Bengaluru",
    "RCB": "Royal Challengers Bengaluru"
};

/**
 * Teams by season
 */
export const TEAMS_BY_SEASON: Record<string, string[]> = {
    "2008": [
        "Royal Challengers Bengaluru",
        "Kolkata Knight Riders",
        "Punjab Kings",
        "Chennai Super Kings",
        "Delhi Capitals",
        "Rajasthan Royals",
        "Mumbai Indians",
        "Deccan Chargers"
    ],
    "2009": [
        "Chennai Super Kings",
        "Mumbai Indians",
        "Royal Challengers Bengaluru",
        "Rajasthan Royals",
        "Delhi Capitals",
        "Punjab Kings",
        "Deccan Chargers",
        "Kolkata Knight Riders"
    ],
    "2010": [
        "Deccan Chargers",
        "Kolkata Knight Riders",
        "Mumbai Indians",
        "Rajasthan Royals",
        "Punjab Kings",
        "Delhi Capitals",
        "Royal Challengers Bengaluru",
        "Chennai Super Kings"
    ],
    "2011": [
        "Chennai Super Kings",
        "Kolkata Knight Riders",
        "Deccan Chargers",
        "Rajasthan Royals",
        "Kochi Tuskers Kerala",
        "Royal Challengers Bengaluru",
        "Delhi Capitals",
        "Mumbai Indians",
        "Pune Warriors",
        "Punjab Kings"
    ],
    "2012": [
        "Chennai Super Kings",
        "Mumbai Indians",
        "Kolkata Knight Riders",
        "Delhi Capitals",
        "Pune Warriors",
        "Rajasthan Royals",
        "Punjab Kings",
        "Royal Challengers Bengaluru",
        "Deccan Chargers"
    ],
    "2013": [
        "Kolkata Knight Riders",
        "Delhi Capitals",
        "Royal Challengers Bengaluru",
        "Mumbai Indians",
        "Sunrisers Hyderabad",
        "Pune Warriors",
        "Rajasthan Royals",
        "Chennai Super Kings",
        "Punjab Kings"
    ],
    "2014": [
        "Mumbai Indians",
        "Kolkata Knight Riders",
        "Delhi Capitals",
        "Royal Challengers Bengaluru",
        "Chennai Super Kings",
        "Punjab Kings",
        "Sunrisers Hyderabad",
        "Rajasthan Royals"
    ],
    "2015": [
        "Kolkata Knight Riders",
        "Mumbai Indians",
        "Chennai Super Kings",
        "Delhi Capitals",
        "Punjab Kings",
        "Rajasthan Royals",
        "Sunrisers Hyderabad",
        "Royal Challengers Bengaluru"
    ],
    "2016": [
        "Mumbai Indians",
        "Rising Pune Supergiants",
        "Kolkata Knight Riders",
        "Delhi Capitals",
        "Punjab Kings",
        "Gujarat Lions",
        "Royal Challengers Bengaluru",
        "Sunrisers Hyderabad"
    ],
    "2017": [
        "Sunrisers Hyderabad",
        "Royal Challengers Bengaluru",
        "Rising Pune Supergiants",
        "Mumbai Indians",
        "Gujarat Lions",
        "Kolkata Knight Riders",
        "Punjab Kings",
        "Delhi Capitals"
    ],
    "2018": [
        "Mumbai Indians",
        "Chennai Super Kings",
        "Delhi Capitals",
        "Punjab Kings",
        "Royal Challengers Bengaluru",
        "Kolkata Knight Riders",
        "Rajasthan Royals",
        "Sunrisers Hyderabad"
    ],
    "2019": [
        "Royal Challengers Bengaluru",
        "Chennai Super Kings",
        "Sunrisers Hyderabad",
        "Kolkata Knight Riders",
        "Delhi Capitals",
        "Mumbai Indians",
        "Punjab Kings",
        "Rajasthan Royals"
    ],
    "2020": [
        "Mumbai Indians",
        "Chennai Super Kings",
        "Delhi Capitals",
        "Punjab Kings",
        "Kolkata Knight Riders",
        "Royal Challengers Bengaluru",
        "Sunrisers Hyderabad",
        "Rajasthan Royals"
    ],
    "2021": [
        "Mumbai Indians",
        "Royal Challengers Bengaluru",
        "Chennai Super Kings",
        "Delhi Capitals",
        "Kolkata Knight Riders",
        "Sunrisers Hyderabad",
        "Punjab Kings",
        "Rajasthan Royals"
    ],
    "2022": [
        "Chennai Super Kings",
        "Kolkata Knight Riders",
        "Mumbai Indians",
        "Delhi Capitals",
        "Royal Challengers Bengaluru",
        "Punjab Kings",
        "Lucknow Super Giants",
        "Gujarat Titans",
        "Rajasthan Royals",
        "Sunrisers Hyderabad"
    ],
    "2023": [
        "Chennai Super Kings",
        "Gujarat Titans",
        "Punjab Kings",
        "Kolkata Knight Riders",
        "Lucknow Super Giants",
        "Delhi Capitals",
        "Rajasthan Royals",
        "Sunrisers Hyderabad",
        "Mumbai Indians",
        "Royal Challengers Bengaluru"
    ],
    "2024": [
        "Royal Challengers Bengaluru",
        "Chennai Super Kings",
        "Delhi Capitals",
        "Punjab Kings",
        "Kolkata Knight Riders",
        "Sunrisers Hyderabad",
        "Rajasthan Royals",
        "Lucknow Super Giants",
        "Gujarat Titans",
        "Mumbai Indians"
    ]
};

/**
 * Lookup object to quickly get team info by name
 */
export const TEAM_BY_NAME: Record<string, TeamInfo> = IPL_TEAMS.reduce((acc, team) => {
    acc[team.name] = team;
    return acc;
}, {} as Record<string, TeamInfo>);

/**
 * Get team info by team name (handles aliases)
 * @param name - The team name (can be an alias)
 * @returns The team info or undefined if not found
 */
export function getTeamInfo(name: string): TeamInfo | undefined {
    // Check if it's an alias first
    const canonicalName = TEAM_ALIASES[name] || name;
    return TEAM_BY_NAME[canonicalName];
} 