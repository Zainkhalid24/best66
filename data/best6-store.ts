import AsyncStorage from '@react-native-async-storage/async-storage';

export type Team = {
  id: string;
  name: string;
  shortName?: string;
  crest?: string;
};

export type Match = {
  id: number;
  utcDate: string;
  status: 'SCHEDULED' | 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'FINISHED';
  matchday?: number;
  homeTeam: Team;
  awayTeam: Team;
  score?: {
    fullTime?: {
      home: number | null;
      away: number | null;
    };
  };
};

export type Prediction = {
  home: number | null;
  away: number | null;
};

export type RoundPick = {
  matchId: number;
  prediction: Prediction;
  result?: { home: number; away: number } | null;
  points: number;
};

export type RoundResult = {
  id: string;
  createdAt: string;
  matchday: number;
  picks: RoundPick[];
  totalPoints: number;
  firstGoalMinute?: number;
};

export type League = {
  id: string;
  name: string;
  code: string;
  members: number;
};

export type LeaderboardEntry = {
  id: string;
  name: string;
  totalPoints: number;
  weeklyPoints: number;
  avatarColor?: string;
  predictions?: { home: number; away: number }[];
};

const STORAGE = {
  predictions: 'best6:predictions',
  rounds: 'best6:rounds',
  leagues: 'best6:leagues',
  leaderboard: 'best6:leaderboard',
  profileName: 'best6:profileName',
  matches: 'best6:matches',
};

const now = new Date();

export const sampleMatches: Match[] = [
  {
    id: 101,
    utcDate: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
    status: 'SCHEDULED',
    matchday: 12,
    homeTeam: {
      id: '57',
      name: 'Arsenal',
      shortName: 'ARS',
      crest: 'https://crests.football-data.org/57.png',
    },
    awayTeam: {
      id: '61',
      name: 'Chelsea',
      shortName: 'CHE',
      crest: 'https://crests.football-data.org/61.png',
    },
  },
  {
    id: 102,
    utcDate: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
    status: 'SCHEDULED',
    matchday: 12,
    homeTeam: {
      id: '64',
      name: 'Liverpool',
      shortName: 'LIV',
      crest: 'https://crests.football-data.org/64.png',
    },
    awayTeam: {
      id: '65',
      name: 'Manchester City',
      shortName: 'MCI',
      crest: 'https://crests.football-data.org/65.png',
    },
  },
  {
    id: 103,
    utcDate: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
    status: 'SCHEDULED',
    matchday: 12,
    homeTeam: {
      id: '81',
      name: 'Barcelona',
      shortName: 'BAR',
      crest: 'https://crests.football-data.org/81.png',
    },
    awayTeam: {
      id: '86',
      name: 'Real Madrid',
      shortName: 'RMA',
      crest: 'https://crests.football-data.org/86.png',
    },
  },
  {
    id: 104,
    utcDate: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
    status: 'SCHEDULED',
    matchday: 12,
    homeTeam: {
      id: '109',
      name: 'Juventus',
      shortName: 'JUV',
      crest: 'https://crests.football-data.org/109.png',
    },
    awayTeam: {
      id: '98',
      name: 'AC Milan',
      shortName: 'MIL',
      crest: 'https://crests.football-data.org/98.png',
    },
  },
  {
    id: 105,
    utcDate: new Date(now.getTime() + 5 * 60 * 60 * 1000).toISOString(),
    status: 'SCHEDULED',
    matchday: 12,
    homeTeam: {
      id: '524',
      name: 'PSG',
      shortName: 'PSG',
      crest: 'https://crests.football-data.org/524.png',
    },
    awayTeam: {
      id: '5',
      name: 'Bayern Munich',
      shortName: 'BAY',
      crest: 'https://crests.football-data.org/5.png',
    },
  },
  {
    id: 106,
    utcDate: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
    status: 'SCHEDULED',
    matchday: 12,
    homeTeam: {
      id: '73',
      name: 'Tottenham',
      shortName: 'TOT',
      crest: 'https://crests.football-data.org/73.png',
    },
    awayTeam: {
      id: '66',
      name: 'Manchester United',
      shortName: 'MUN',
      crest: 'https://crests.football-data.org/66.png',
    },
  },
];

export async function loadPredictions(): Promise<Record<number, Prediction>> {
  const raw = await AsyncStorage.getItem(STORAGE.predictions);
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function savePredictions(predictions: Record<number, Prediction>) {
  await AsyncStorage.setItem(STORAGE.predictions, JSON.stringify(predictions));
}

export async function loadRounds(): Promise<RoundResult[]> {
  const raw = await AsyncStorage.getItem(STORAGE.rounds);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveRoundResult(round: RoundResult) {
  const rounds = await loadRounds();
  const updated = [round, ...rounds.filter((existing) => existing.matchday !== round.matchday)];
  await AsyncStorage.setItem(STORAGE.rounds, JSON.stringify(updated));
  return updated;
}

export async function saveRounds(rounds: RoundResult[]) {
  await AsyncStorage.setItem(STORAGE.rounds, JSON.stringify(rounds));
  return rounds;
}

export async function loadLeagues(): Promise<League[]> {
  const raw = await AsyncStorage.getItem(STORAGE.leagues);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveLeagues(leagues: League[]) {
  await AsyncStorage.setItem(STORAGE.leagues, JSON.stringify(leagues));
}

export async function loadLeaderboard(): Promise<LeaderboardEntry[]> {
  const raw = await AsyncStorage.getItem(STORAGE.leaderboard);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveLeaderboard(entries: LeaderboardEntry[]) {
  await AsyncStorage.setItem(STORAGE.leaderboard, JSON.stringify(entries));
}

export async function loadMatches(): Promise<Match[]> {
  const raw = await AsyncStorage.getItem(STORAGE.matches);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveMatches(matches: Match[]) {
  await AsyncStorage.setItem(STORAGE.matches, JSON.stringify(matches));
}

export async function loadProfileName(): Promise<string> {
  const raw = await AsyncStorage.getItem(STORAGE.profileName);
  return raw ?? '';
}

export async function saveProfileName(name: string) {
  await AsyncStorage.setItem(STORAGE.profileName, name);
}

export async function clearAppData() {
  await AsyncStorage.multiRemove([
    STORAGE.predictions,
    STORAGE.rounds,
    STORAGE.leagues,
    STORAGE.leaderboard,
    STORAGE.profileName,
    STORAGE.matches,
    'best6:language',
  ]);
}

export function calculatePoints(prediction: Prediction, result?: { home: number; away: number } | null) {
  if (!result || prediction.home === null || prediction.away === null) {
    return 0;
  }
  if (prediction.home === result.home && prediction.away === result.away) {
    return 5;
  }
  const predictionOutcome = Math.sign(prediction.home - prediction.away);
  const resultOutcome = Math.sign(result.home - result.away);
  return predictionOutcome === resultOutcome ? 2 : 0;
}

export function computeWeeklyPoints(rounds: RoundResult[], now = new Date()) {
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  return rounds.reduce((sum, round) => {
    const created = new Date(round.createdAt);
    if (created >= weekAgo) {
      return sum + round.totalPoints;
    }
    return sum;
  }, 0);
}
