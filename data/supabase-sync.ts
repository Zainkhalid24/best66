import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from '@/lib/supabase';
import {
  loadLeaderboard,
  loadLeagues,
  loadPredictions,
  loadProfileName,
  loadRounds,
  saveLeaderboard,
  saveLeagues,
  savePredictions,
  saveRounds,
  type LeaderboardEntry,
  type League,
  type RoundResult,
} from '@/data/best6-store';

const USER_KEY = 'best6:userId';

function createId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const rand = (Math.random() * 16) | 0;
    const value = char === 'x' ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
}

export async function getOrCreateUserId() {
  const { data } = await supabase.auth.getUser();
  if (data?.user?.id) {
    await AsyncStorage.setItem(USER_KEY, data.user.id);
    return data.user.id;
  }
  const existing = await AsyncStorage.getItem(USER_KEY);
  if (existing) {
    return existing;
  }
  const created = createId();
  await AsyncStorage.setItem(USER_KEY, created);
  return created;
}

export async function syncProfile() {
  const userId = await getOrCreateUserId();
  const name = await loadProfileName();
  await supabase.from('profiles').upsert({ id: userId, name });
}

export async function syncPredictions() {
  const userId = await getOrCreateUserId();
  const predictions = await loadPredictions();
  const rows = Object.entries(predictions).map(([matchId, prediction]) => ({
    user_id: userId,
    match_id: Number(matchId),
    home: prediction.home ?? 0,
    away: prediction.away ?? 0,
  }));
  await supabase.from('predictions').delete().eq('user_id', userId);
  if (rows.length) {
    await supabase.from('predictions').insert(rows);
  }
}

export async function syncRounds() {
  const userId = await getOrCreateUserId();
  const rounds = await loadRounds();
  const rows = rounds.map((round) => ({
    id: round.id,
    user_id: userId,
    matchday: round.matchday,
    total_points: round.totalPoints,
    first_goal_minute: round.firstGoalMinute ?? null,
    created_at: round.createdAt,
  }));
  await supabase.from('rounds').delete().eq('user_id', userId);
  if (rows.length) {
    await supabase.from('rounds').insert(rows);
  }
}

export async function syncLeagues() {
  const userId = await getOrCreateUserId();
  const leagues = await loadLeagues();
  await supabase.from('league_members').delete().eq('user_id', userId);
  for (const league of leagues) {
    const { data } = await supabase
      .from('leagues')
      .select('id')
      .eq('code', league.code)
      .maybeSingle();
    let leagueId = data?.id;
    if (!leagueId) {
      const created = await supabase
        .from('leagues')
        .insert({ name: league.name, code: league.code })
        .select('id')
        .single();
      leagueId = created.data?.id;
    }
    if (leagueId) {
      await supabase.from('league_members').insert({ league_id: leagueId, user_id: userId });
    }
  }
}

export async function syncLeaderboard() {
  const userId = await getOrCreateUserId();
  const entries = await loadLeaderboard();
  const you = entries.find((entry) => entry.id === 'you');
  if (!you) {
    return;
  }
  await supabase.from('leaderboard').upsert({
    user_id: userId,
    total_points: you.totalPoints,
    weekly_points: you.weeklyPoints,
    updated_at: new Date().toISOString(),
  });
}

export async function bootstrapSync() {
  const userId = await getOrCreateUserId();

  const profile = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (profile.data?.name) {
    await AsyncStorage.setItem('best6:profileName', profile.data.name);
  }
  const localPredictions = await loadPredictions();
  const predictions = await supabase.from('predictions').select('*').eq('user_id', userId);
  const mergedPredictions: Record<number, { home: number | null; away: number | null }> = {
    ...localPredictions,
  };
  if (predictions.data?.length) {
    predictions.data.forEach((row) => {
      mergedPredictions[row.match_id] = { home: row.home, away: row.away };
    });
  }
  await savePredictions(mergedPredictions);
  await syncPredictions();

  const localRounds = await loadRounds();
  const rounds = await supabase.from('rounds').select('*').eq('user_id', userId);
  const mergedRounds = new Map<string, RoundResult>();
  localRounds.forEach((round) => mergedRounds.set(round.id, round));
  rounds.data?.forEach((row) => {
    mergedRounds.set(row.id, {
      id: row.id,
      createdAt: row.created_at,
      matchday: row.matchday,
      picks: [],
      totalPoints: row.total_points,
      firstGoalMinute: row.first_goal_minute ?? undefined,
    });
  });
  await saveRounds(Array.from(mergedRounds.values()));
  await syncRounds();

  const localLeagues = await loadLeagues();
  const memberships = await supabase
    .from('league_members')
    .select('league_id, leagues(name, code)')
    .eq('user_id', userId);
  const mergedLeagues = new Map<string, League>();
  localLeagues.forEach((league) => mergedLeagues.set(league.code, league));
  memberships.data?.forEach((row: any) => {
    if (row.leagues?.code) {
      mergedLeagues.set(row.leagues.code, {
        id: row.league_id,
        name: row.leagues?.name ?? 'League',
        code: row.leagues?.code ?? 'B6-000',
        members: 0,
      });
    }
  });
  await saveLeagues(Array.from(mergedLeagues.values()));
  await syncLeagues();

  const localLeaderboard = await loadLeaderboard();
  const leaderboard = await supabase.from('leaderboard').select('*').eq('user_id', userId);
  const mergedLeaderboard = new Map<string, LeaderboardEntry>();
  localLeaderboard.forEach((entry) => mergedLeaderboard.set(entry.id, entry));
  leaderboard.data?.forEach((row) => {
    mergedLeaderboard.set('you', {
      id: 'you',
      name: 'You',
      totalPoints: row.total_points ?? 0,
      weeklyPoints: row.weekly_points ?? 0,
    });
  });
  await saveLeaderboard(Array.from(mergedLeaderboard.values()));
  await syncLeaderboard();
}
