import * as Sharing from 'expo-sharing';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image } from 'expo-image';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import ViewShot from 'react-native-view-shot';

import { Best6Logo } from '@/components/best6-logo';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useLanguage } from '@/context/language-context';
import {
  calculatePoints,
  computeWeeklyPoints,
  loadLeaderboard,
  loadMatches,
  loadPredictions,
  loadRounds,
  saveLeaderboard,
  saveMatches,
  savePredictions,
  saveRoundResult,
  saveRounds,
  sampleMatches,
  type Match,
  type Prediction,
  type RoundResult,
} from '@/data/best6-store';
import { syncLeaderboard, syncPredictions, syncRounds } from '@/data/supabase-sync';
import { useColorScheme } from '@/hooks/use-color-scheme';

type TabKey = 'play' | 'result' | 'schedule';

export default function PlayScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { t, tTeam } = useLanguage();
  const [tab, setTab] = useState<TabKey>('play');
  const [scheduleFilter, setScheduleFilter] = useState<'upcoming' | 'live' | 'finished'>('upcoming');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [predictions, setPredictions] = useState<Record<number, Prediction>>({});
  const [h2hByMatch, setH2hByMatch] = useState<
    Record<number, { home: string; away: string; homeScore: number | null; awayScore: number | null; date: string }[]>
  >({});
  const [h2hLoading, setH2hLoading] = useState<Record<number, boolean>>({});
  const [recentByTeam, setRecentByTeam] = useState<Record<string, { outcome: 'W' | 'D' | 'L' }[]>>({});
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [expandedMatchId, setExpandedMatchId] = useState<number | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [firstGoalMinute, setFirstGoalMinute] = useState('1');
  const [firstGoalError, setFirstGoalError] = useState('');
  const [saveNotice, setSaveNotice] = useState('');
  const [saveError, setSaveError] = useState('');
  const [matchesError, setMatchesError] = useState('');
  const [standingsError, setStandingsError] = useState('');
  const [positionsByTeamId, setPositionsByTeamId] = useState<Record<string, number>>({});
  const [showSaveModal, setShowSaveModal] = useState(false);
  const shareShotRef = useRef<React.ElementRef<typeof ViewShot> | null>(null);
  const minuteScrollRef = useRef<ScrollView | null>(null);
  const lockPulse = useRef(new Animated.Value(1)).current;

  const matchday = matches[0]?.matchday ?? 12;
  const userName = 'You';

  useEffect(() => {
    loadMatches()
      .then((cached) => {
        if (cached.length) {
          setMatches(cached);
        }
      })
      .catch(() => undefined);
    loadPredictions()
      .then((stored) => setPredictions(stored))
      .catch(() => undefined);
    migrateRoundCaps().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!isSaved) {
      lockPulse.setValue(1);
      return;
    }
    Animated.sequence([
      Animated.timing(lockPulse, { toValue: 1.08, duration: 140, useNativeDriver: true }),
      Animated.timing(lockPulse, { toValue: 1, duration: 140, useNativeDriver: true }),
    ]).start();
  }, [isSaved, lockPulse]);

  const updateFirstGoalMinute = (nextValue: number) => {
    const clamped = Math.min(120, Math.max(1, nextValue));
    setFirstGoalMinute(String(clamped));
    setFirstGoalError('');
    minuteScrollRef.current?.scrollTo({ y: (clamped - 1) * 36, animated: true });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((current) => (current + 1) % 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const apiKey = process.env.EXPO_PUBLIC_FOOTBALL_DATA_KEY;
    if (!apiKey) {
      setMatchesError('Missing API key for fixtures.');
      setMatches([]);
      return;
    }
    const controller = new AbortController();
    setLoadingMatches(true);
    let isMounted = true;
    const matchday = 19;
    const targetDate = '2025-12-30';
    const fetchFixturesWindow = async () => {
      const url = `https://api.football-data.org/v4/competitions/PL/matches?matchday=${matchday}`;
      const response = await fetch(url, {
        headers: {
          'X-Auth-Token': apiKey,
        },
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`Fixtures request failed (${response.status}).`);
      }
      const data = await response.json();
      return data?.matches ?? [];
    };
    const loadFixtures = async () => {
      try {
        const combined = await fetchFixturesWindow();
        const filtered = combined.filter((fixture: any) => {
          const dateValue = fixture?.utcDate ?? '';
          return typeof dateValue === 'string' && dateValue.startsWith(targetDate);
        });
        if (filtered.length) {
          const shuffled = [...filtered];
          for (let i = shuffled.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          const mapped = shuffled
            .slice(0, 6)
            .sort((a: any, b: any) => {
              const aTime = new Date(a.utcDate ?? 0).getTime();
              const bTime = new Date(b.utcDate ?? 0).getTime();
              return aTime - bTime;
            })
            .map((match: any) => {
              const statusValue = match.status;
              const mappedStatus =
                statusValue === 'FINISHED' || statusValue === 'AWARDED' || statusValue === 'POSTPONED'
                  ? 'FINISHED'
                  : statusValue === 'IN_PLAY' || statusValue === 'PAUSED'
                    ? 'IN_PLAY'
                    : 'SCHEDULED';
              return {
                id: match.id ?? Math.random(),
                utcDate: match.utcDate ?? new Date().toISOString(),
                status: mappedStatus,
                matchday: match.matchday ?? undefined,
                homeTeam: {
                  id: match.homeTeam?.id?.toString() ?? 'HOME',
                  name: match.homeTeam?.name ?? 'Home',
                  crest: match.homeTeam?.crest ?? undefined,
                },
                awayTeam: {
                  id: match.awayTeam?.id?.toString() ?? 'AWAY',
                  name: match.awayTeam?.name ?? 'Away',
                  crest: match.awayTeam?.crest ?? undefined,
                },
                score: {
                  fullTime: {
                    home: match.score?.fullTime?.home ?? null,
                    away: match.score?.fullTime?.away ?? null,
                  },
                },
              };
            });
          if (mapped.length) {
            if (isMounted) {
              setMatches(mapped);
              setMatchesError('');
            }
            saveMatches(mapped).catch(() => undefined);
            return;
          }
        }
        if (isMounted) {
          setMatches([]);
          setMatchesError('No matches found for the selected date.');
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setMatches([]);
        setMatchesError(
          err instanceof Error
            ? err.message
            : 'Unable to fetch fixtures.'
        );
      } finally {
        if (isMounted) {
          setLoadingMatches(false);
        }
      }
    };
    loadFixtures();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const apiKey = process.env.EXPO_PUBLIC_FOOTBALL_DATA_KEY;
    if (!apiKey) {
      return;
    }
    const today = new Date();
    const season = today.getMonth() >= 7 ? today.getFullYear() : today.getFullYear() - 1;
    fetch(`https://api.football-data.org/v4/competitions/PL/standings?season=${season}`, {
      headers: {
        'X-Auth-Token': apiKey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const standings = data?.standings?.[0]?.table;
        if (!standings) {
          return;
        }
        const mapped: Record<string, number> = {};
        standings.forEach((entry: any) => {
          if (entry?.team?.id) {
            mapped[String(entry.team.id)] = entry.position;
          }
        });
        setPositionsByTeamId(mapped);
        setStandingsError('');
      })
      .catch(() => setStandingsError('Standings unavailable.'));
  }, []);

  useEffect(() => {
    const apiKey = process.env.EXPO_PUBLIC_FOOTBALL_DATA_KEY;
    if (!apiKey || matches.length === 0) {
      return;
    }
    // Odds requests removed to avoid RapidAPI rate limits.
  }, [matches]);

  // Live refresh removed to avoid RapidAPI rate limits.

  const totalPoints = useMemo(() => {
    return matches.reduce((sum, match) => {
      const prediction = predictions[match.id];
      if (!prediction) {
        return sum;
      }
      const result = match.score?.fullTime
        ? { home: match.score.fullTime.home ?? 0, away: match.score.fullTime.away ?? 0 }
        : null;
      return sum + calculatePoints(prediction, result);
    }, 0);
  }, [matches, predictions]);

  const filteredSchedule = useMemo(() => {
    return matches.filter((match) => {
      if (scheduleFilter === 'live') {
        return match.status === 'IN_PLAY' || match.status === 'PAUSED';
      }
      if (scheduleFilter === 'finished') {
        return match.status === 'FINISHED';
      }
      return match.status === 'SCHEDULED' || match.status === 'TIMED';
    });
  }, [matches, scheduleFilter]);

  const adjustPrediction = (matchId: number, side: 'home' | 'away', delta: number) => {
    setPredictions((current) => {
      const existing = current[matchId]?.[side] ?? null;
      const base = existing === null ? 0 : existing;
      const next = Math.min(9, Math.max(0, base + delta));
      return {
        ...current,
        [matchId]: {
          home: side === 'home' ? next : current[matchId]?.home ?? null,
          away: side === 'away' ? next : current[matchId]?.away ?? null,
        },
      };
    });
  };

  const renderTeamBadge = (
    match: Match,
    side: 'home' | 'away',
    size: 'default' | 'large' | 'share' = 'default',
    backgroundColor: string = palette.surfaceAlt,
    iconColor: string = palette.textMuted
  ) => {
    const team = side === 'home' ? match.homeTeam : match.awayTeam;
    const crest = team.crest;
    const badgeStyle =
      size === 'share' ? styles.teamBadgeShare : size === 'large' ? styles.teamBadgeLarge : styles.teamBadge;
    const crestStyle =
      size === 'share' ? styles.teamCrestShare : size === 'large' ? styles.teamCrestLarge : styles.teamCrest;
    const iconSize = size === 'share' ? 28 : size === 'large' ? 24 : 22;

    return (
      <View style={[badgeStyle, { backgroundColor }]}>
        {crest ? (
          <Image source={{ uri: crest }} style={crestStyle} contentFit="contain" />
        ) : (
          <IconSymbol size={iconSize} name="sportscourt.fill" color={iconColor} />
        )}
      </View>
    );
  };

  const formatKickoff = (utcDate: string) => {
    const date = new Date(utcDate);
    const day = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const time = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    return `${day} - ${time}`;
  };

  const formatShareDate = (utcDate?: string) => {
    if (!utcDate) {
      return '';
    }
    return new Date(utcDate).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCountdown = (utcDate: string) => {
    const now = Date.now();
    const kickoff = new Date(utcDate).getTime();
    const diff = kickoff - now;
    if (Number.isNaN(kickoff) || diff <= 0) {
      return 'Kickoff';
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const migrateRoundCaps = async () => {
    const rounds = await loadRounds();
    if (!rounds.length) {
      return;
    }
    let changed = false;
    const updated = rounds.map((round) => {
      const capped = Math.min(30, round.totalPoints);
      if (capped !== round.totalPoints) {
        changed = true;
        return { ...round, totalPoints: capped };
      }
      return round;
    });
    if (changed) {
      await saveRounds(updated);
      const totalPointsFromRounds = updated.reduce((sum, item) => sum + item.totalPoints, 0);
      const weeklyPointsFromRounds = computeWeeklyPoints(updated);
      const leaderboard = await loadLeaderboard();
      const existing = leaderboard.find((entry) => entry.id === 'you');
      const updatedEntry = {
        id: 'you',
        name: 'You',
        totalPoints: totalPointsFromRounds,
        weeklyPoints: weeklyPointsFromRounds,
      };
      const updatedLeaderboard = existing
        ? leaderboard.map((entry) => (entry.id === 'you' ? { ...entry, ...updatedEntry } : entry))
        : [updatedEntry, ...leaderboard];
      await saveLeaderboard(updatedLeaderboard);
      syncRounds().catch(() => undefined);
      syncLeaderboard().catch(() => undefined);
    }
  };

  const getLastFive = (teamName: string) => {
    const opponents = ['Rovers', 'United', 'City', 'Athletic', 'Albion', 'County', 'Wanderers'];
    const hash = teamName
      .split('')
      .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    return Array.from({ length: 5 }, (_, index) => {
      const opponent = opponents[(hash + index) % opponents.length];
      const homeScore = (hash + index * 2) % 4;
      const awayScore = (hash + index * 3) % 4;
      const outcome =
        homeScore === awayScore ? 'D' : homeScore > awayScore ? 'W' : 'L';
      return { opponent, homeScore, awayScore, outcome };
    });
  };

  const fetchRecentForm = async (teamId?: string | null) => {
    if (!teamId || recentByTeam[teamId]) {
      return;
    }
    const apiKey = process.env.EXPO_PUBLIC_FOOTBALL_DATA_KEY;
    if (!apiKey) {
      return;
    }
    try {
      const response = await fetch(
        `https://api.football-data.org/v4/teams/${teamId}/matches?status=FINISHED&limit=5`,
        {
          headers: {
            'X-Auth-Token': apiKey,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Recent form request failed (${response.status}).`);
      }
      const data = await response.json();
      const matches = data?.matches ?? [];
      const mapped = matches.map((fixture: any) => {
        const winner = fixture?.score?.winner;
        if (winner === 'DRAW') {
          return { outcome: 'D' as const };
        }
        const homeId = String(fixture?.homeTeam?.id ?? '');
        const awayId = String(fixture?.awayTeam?.id ?? '');
        if (winner === 'HOME_TEAM') {
          return { outcome: homeId === teamId ? 'W' : 'L' };
        }
        if (winner === 'AWAY_TEAM') {
          return { outcome: awayId === teamId ? 'W' : 'L' };
        }
        return { outcome: 'D' as const };
      });
      setRecentByTeam((current) => ({ ...current, [teamId]: mapped }));
    } catch {
      setRecentByTeam((current) => ({ ...current, [teamId]: [] }));
    }
  };

  const fetchHeadToHead = async (match: Match) => {
    const apiKey = process.env.EXPO_PUBLIC_FOOTBALL_DATA_KEY;
    if (!apiKey || !match.homeTeam.id || !match.awayTeam.id) {
      return;
    }
    const awayTeamId = String(match.awayTeam.id);
    setH2hLoading((current) => ({ ...current, [match.id]: true }));
    try {
      const url = `https://api.football-data.org/v4/teams/${match.homeTeam.id}/matches?status=FINISHED&limit=10`;
      const response = await fetch(url, {
        headers: {
          'X-Auth-Token': apiKey,
        },
      });
      if (!response.ok) {
        throw new Error(`Head-to-head request failed (${response.status}).`);
      }
      const data = await response.json();
      const matches = data?.matches ?? [];
      const filtered = matches
        .filter((fixture: any) => {
          const homeId = fixture?.homeTeam?.id;
          const awayId = fixture?.awayTeam?.id;
          return String(homeId) === awayTeamId || String(awayId) === awayTeamId;
        })
        .sort((a: any, b: any) => {
          const aTime = new Date(a.utcDate ?? 0).getTime();
          const bTime = new Date(b.utcDate ?? 0).getTime();
          return bTime - aTime;
        })
        .slice(0, 3);
      const mapped = filtered.map((fixture: any) => ({
        home: fixture.homeTeam?.name ?? 'Home',
        away: fixture.awayTeam?.name ?? 'Away',
        homeScore: fixture.score?.fullTime?.home ?? null,
        awayScore: fixture.score?.fullTime?.away ?? null,
        date: fixture.utcDate ?? '',
      }));
      setH2hByMatch((current) => ({ ...current, [match.id]: mapped }));
    } catch {
      setH2hByMatch((current) => ({ ...current, [match.id]: [] }));
    } finally {
      setH2hLoading((current) => ({ ...current, [match.id]: false }));
    }
  };

  const getHeadToHead = (match: Match) => h2hByMatch[match.id] ?? [];

  const toggleMatchStats = (match: Match) => {
    setExpandedMatchId((current) => (current === match.id ? null : match.id));
    if (!h2hByMatch[match.id]) {
      fetchHeadToHead(match).catch(() => undefined);
    }
    fetchRecentForm(match.homeTeam.id).catch(() => undefined);
    fetchRecentForm(match.awayTeam.id).catch(() => undefined);
  };

  const ScoreStepper = ({
    value,
    onIncrement,
    onDecrement,
    minusColor,
    plusColor,
    disabled,
  }: {
    value: number | null;
    onIncrement: () => void;
    onDecrement: () => void;
    minusColor: string;
    plusColor: string;
    disabled: boolean;
  }) => (
    <View style={styles.scoreStepper}>
      <Pressable
        onPress={onIncrement}
        disabled={disabled}
        style={[styles.stepButton, { borderColor: palette.divider, opacity: disabled ? 0.4 : 1 }]}>
        <ThemedText type="display" style={[styles.stepSymbol, styles.stepSymbolPlus, { color: plusColor }]}>
          +
        </ThemedText>
      </Pressable>
      <View style={[styles.scoreCircle, { borderColor: palette.divider }]}>
        <ThemedText type="subtitle">{value ?? 0}</ThemedText>
      </View>
      <Pressable
        onPress={onDecrement}
        disabled={disabled}
        style={[styles.stepButton, { borderColor: palette.divider, opacity: disabled ? 0.4 : 1 }]}>
        <ThemedText type="display" style={[styles.stepSymbol, { color: minusColor }]}>
          -
        </ThemedText>
      </Pressable>
    </View>
  );

  const renderLiveBadge = () => (
    <View style={[styles.liveBadge, { backgroundColor: palette.tint }]}>
      <ThemedText type="caption" style={{ color: palette.surface }}>
        LIVE
      </ThemedText>
    </View>
  );

  const renderScoreResult = (match: Match, prediction: Prediction) => {
    if (!match.score?.fullTime) {
      return null;
    }
    const result = {
      home: match.score.fullTime.home ?? 0,
      away: match.score.fullTime.away ?? 0,
    };
    const isExact =
      prediction.home !== null &&
      prediction.away !== null &&
      prediction.home === result.home &&
      prediction.away === result.away;
    const backgroundColor = isExact ? palette.success : palette.danger;
    return (
      <View style={[styles.resultBadge, { backgroundColor }]}>
        <ThemedText type="caption" style={{ color: palette.surface }}>
          {`${result.home}-${result.away}`}
        </ThemedText>
      </View>
    );
  };

  const handleSave = async () => {
    if (isSaved) {
      setIsSaved(false);
      setPendingRound(null);
      setSaveNotice('');
      return;
    }
    setFirstGoalError('');
    setSaveError('');
    setSaveNotice('');
    const minuteValue = Number.parseInt(firstGoalMinute.trim(), 10);
    if (!Number.isFinite(minuteValue) || minuteValue < 1 || minuteValue > 120) {
      setFirstGoalError('Select a first-goal minute between 1 and 120.');
      return;
    }
    setSaving(true);
    try {
      await savePredictions(predictions);
      syncPredictions().catch(() => undefined);
      const picks = matches.map((match) => {
        const prediction = predictions[match.id] ?? { home: 0, away: 0 };
        const safePrediction = {
          home: prediction.home ?? 0,
          away: prediction.away ?? 0,
        };
        const result = match.score?.fullTime
          ? { home: match.score.fullTime.home ?? 0, away: match.score.fullTime.away ?? 0 }
          : null;
        const points = calculatePoints(safePrediction, result);
        return { matchId: match.id, prediction: safePrediction, result, points };
      });
      const totalPoints = Math.min(30, picks.reduce((sum, pick) => sum + pick.points, 0));
      const round = {
        id: `round-${Date.now()}`,
        createdAt: new Date().toISOString(),
        matchday,
        picks,
        totalPoints,
        firstGoalMinute: minuteValue,
      };
      await finalizeRound(round);
      syncRounds().catch(() => undefined);
      syncLeaderboard().catch(() => undefined);
      setIsSaved(true);
      setSaveNotice('Picks saved.');
      setShowSaveModal(true);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    const uri = await shareShotRef.current?.capture?.();
    if (!uri) {
      return;
    }
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    }
  };

  const finalizeRound = async (round: RoundResult) => {
    const rounds = await saveRoundResult(round);
    const totalPointsFromRounds = rounds.reduce((sum, item) => sum + item.totalPoints, 0);
    const weeklyPointsFromRounds = computeWeeklyPoints(rounds);
    const leaderboard = await loadLeaderboard();
    const existing = leaderboard.find((entry) => entry.id === 'you');
    const updatedEntry = {
      id: 'you',
      name: 'You',
      totalPoints: totalPointsFromRounds,
      weeklyPoints: weeklyPointsFromRounds,
    };
    const updated = existing
      ? leaderboard.map((entry) => (entry.id === 'you' ? { ...entry, ...updatedEntry } : entry))
      : [updatedEntry, ...leaderboard];
    await saveLeaderboard(updated);
  };

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedView style={[styles.hero, { backgroundColor: palette.surface }]}>
          <View style={[styles.heroHalo, { backgroundColor: palette.surfaceAlt }]} />
          <View style={styles.heroImageWrap}>
            <Image
              source={
                require('../../assets/images/play-hero-1.png.png')
              }
              style={styles.heroImage}
              contentFit="cover"
            />
          </View>
          <View style={styles.heroTopRow}>
            <View style={styles.heroTitleRow}>
              <Best6Logo size={46} />
              <View style={styles.heroText}>
                <ThemedText type="label" style={{ color: palette.textMuted }}>
                  {t('matchday')} {matchday}
                </ThemedText>
                <ThemedText type="display">Prediction Room</ThemedText>
              </View>
            </View>
            <View style={[styles.pointsBadge, { backgroundColor: palette.surfaceAlt }]}>
              <ThemedText type="caption" style={{ color: palette.textMuted }}>
                {t('points')}
              </ThemedText>
              <ThemedText type="subtitle">{totalPoints}</ThemedText>
            </View>
          </View>
        <ThemedText type="bodyMuted" style={styles.heroCopy}>
            Get 6 correct picks and win 6,000,000 IQD.
        </ThemedText>
        </ThemedView>

        <View style={styles.segmented}>
          {(['play', 'result', 'schedule'] as TabKey[]).map((key) => {
            const active = tab === key;
            return (
              <Pressable
                key={key}
                onPress={() => setTab(key)}
                style={[
                  styles.segment,
                  { backgroundColor: active ? palette.tint : palette.surface },
                ]}>
                <ThemedText
                  type="button"
                  style={{ color: active ? palette.surface : palette.text }}>
                  {t(key)}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {loadingMatches ? (
          <View style={styles.loading}>
            <ActivityIndicator color={palette.tint} />
          </View>
        ) : null}

        {tab === 'play' && (
          <View style={styles.matchList}>
            {matches.some((match) => match.status === 'IN_PLAY' || match.status === 'PAUSED') ? (
              <ThemedText type="caption" style={{ color: palette.textMuted }}>
                Live scores update every 30 seconds.
              </ThemedText>
            ) : null}
            {matchesError ? (
              <ThemedText type="caption" style={{ color: palette.danger }}>
                {matchesError}
              </ThemedText>
            ) : null}
            {standingsError ? (
              <ThemedText type="caption" style={{ color: palette.danger }}>
                {standingsError}
              </ThemedText>
            ) : null}
            {matches.map((match, index) => {
              const prediction = predictions[match.id] ?? { home: null, away: null };
              const kickoffPassed = new Date(match.utcDate).getTime() <= Date.now();
              const locked = isSaved || kickoffPassed;
              const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED' || match.status === 'TIMED';
              const isExpanded = expandedMatchId === match.id;
              const h2hMatches = getHeadToHead(match);
              const isH2hLoading = h2hLoading[match.id];
              return (
                <Pressable key={match.id} onPress={() => toggleMatchStats(match)}>
                  <ThemedView
                    variant="surface"
                  style={[
                    styles.matchCard,
                    { borderColor: palette.divider, shadowColor: palette.cardShadow },
                  ]}>
                  <View style={styles.matchHeader}>
                    <ThemedText type="label" style={{ color: palette.textMuted }}>
                      {new Date(match.utcDate).toLocaleDateString()}
                    </ThemedText>
                    {match.status === 'SCHEDULED' ? (
                      <View style={[styles.matchChip, { backgroundColor: palette.surfaceAlt }]}>
                        <ThemedText type="caption">{formatCountdown(match.utcDate)}</ThemedText>
                      </View>
                    ) : null}
                    {isLive ? renderLiveBadge() : null}
                    <View style={[styles.matchChip, { backgroundColor: palette.surfaceAlt }]}>
                      <ThemedText type="caption">{`#${index + 1}`}</ThemedText>
                    </View>
                  </View>
                    <View style={styles.teamsRow}>
                      <View style={styles.teamBlock}>
                        {renderTeamBadge(match, 'home', 'large')}
                        <ThemedText type="body" style={styles.teamName} numberOfLines={1}>
                          {tTeam(match.homeTeam.name)}
                        </ThemedText>
                        <ThemedText type="caption" style={{ color: palette.textMuted }}>
                          Home
                        </ThemedText>
                      </View>
                      <View style={styles.scoreInputs}>
                        {isLive ? renderLiveBadge() : null}
                        <ScoreStepper
                          value={prediction.home}
                          onIncrement={() => adjustPrediction(match.id, 'home', 1)}
                          onDecrement={() => adjustPrediction(match.id, 'home', -1)}
                          minusColor={palette.danger}
                          plusColor={palette.success}
                          disabled={locked}
                        />
                        <ThemedText type="subtitle" style={styles.vsText}>
                          VS
                        </ThemedText>
                        <ScoreStepper
                          value={prediction.away}
                          onIncrement={() => adjustPrediction(match.id, 'away', 1)}
                          onDecrement={() => adjustPrediction(match.id, 'away', -1)}
                          minusColor={palette.danger}
                          plusColor={palette.success}
                          disabled={locked}
                        />
                    </View>
                    <View style={styles.teamBlockRight}>
                      {renderTeamBadge(match, 'away', 'large')}
                      <ThemedText type="body" style={[styles.teamName, styles.teamNameRight]} numberOfLines={1}>
                        {tTeam(match.awayTeam.name)}
                      </ThemedText>
                      <ThemedText type="caption" style={{ color: palette.textMuted }}>
                        Away
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.contextRow}>
                    {positionsByTeamId[match.homeTeam.id ?? ''] ? (
                      <ThemedText type="caption" style={{ color: palette.textMuted }}>
                        {`Pos #${positionsByTeamId[match.homeTeam.id ?? '']} vs #${
                          positionsByTeamId[match.awayTeam.id ?? ''] ?? '-'
                        }`}
                      </ThemedText>
                    ) : null}
                  </View>
                  {isLive ? (
                    <View style={styles.liveRow}>
                        <ThemedText type="caption" style={{ color: palette.textMuted }}>
                          Live score
                        </ThemedText>
                        {renderScoreResult(match, prediction) ?? (
                          <View style={[styles.resultBadge, { backgroundColor: palette.surfaceAlt }]}>
                            <ThemedText type="caption">{t('live')}</ThemedText>
                          </View>
                        )}
                      </View>
                    ) : null}
                    {isExpanded ? (
                      <View style={[styles.statsBlock, { borderTopColor: palette.divider }]}>
                        <ThemedText type="label" style={{ color: palette.textMuted }}>
                          Recent matches
                        </ThemedText>
                          <View style={styles.statsRow}>
                          <View style={styles.statsColumn}>
                            <View style={styles.statsRowInlineLeft}>
                              {(recentByTeam[match.homeTeam.id ?? ''] ?? []).map((item, statIndex) => {
                                const outcomeColor =
                                  item.outcome === 'W'
                                    ? palette.success
                                    : item.outcome === 'L'
                                      ? palette.danger
                                      : palette.textMuted;
                                return (
                                  <ThemedText
                                    key={`home-${match.id}-${statIndex}`}
                                    type="caption"
                                    style={{ color: outcomeColor, textDecorationLine: 'underline' }}>
                                    {item.outcome}
                                  </ThemedText>
                                );
                              })}
                            </View>
                          </View>
                          <View style={styles.statsColumn}>
                            <View style={styles.statsRowInlineRight}>
                              {(recentByTeam[match.awayTeam.id ?? ''] ?? []).map((item, statIndex) => {
                                const outcomeColor =
                                  item.outcome === 'W'
                                    ? palette.success
                                    : item.outcome === 'L'
                                      ? palette.danger
                                      : palette.textMuted;
                                return (
                                  <ThemedText
                                    key={`away-${match.id}-${statIndex}`}
                                    type="caption"
                                    style={{ color: outcomeColor, textDecorationLine: 'underline' }}>
                                    {item.outcome}
                                  </ThemedText>
                                );
                              })}
                            </View>
                          </View>
                        </View>
                        <View style={styles.h2hBlock}>
                          <ThemedText type="label" style={{ color: palette.textMuted }}>
                            H2H
                          </ThemedText>
                          {isH2hLoading ? (
                            <ThemedText type="caption" style={{ color: palette.textMuted }}>
                              Loading H2H...
                            </ThemedText>
                          ) : h2hMatches.length ? (
                            h2hMatches.map((item, h2hIndex) => (
                              <View key={`h2h-${match.id}-${h2hIndex}`} style={styles.h2hLine}>
                                <ThemedText type="caption" style={{ color: palette.textMuted }}>
                                  {item.date ? new Date(item.date).toLocaleDateString() : 'H2H'}
                                </ThemedText>
                                <ThemedText type="caption">
                                  {`${item.homeScore ?? '-'}-${item.awayScore ?? '-'}`}
                                </ThemedText>
                              </View>
                            ))
                          ) : (
                            <ThemedText type="caption" style={{ color: palette.textMuted }}>
                              No H2H data
                            </ThemedText>
                          )}
                        </View>
                      </View>
                    ) : null}
                    {locked && (
                      <Animated.View style={{ transform: [{ scale: lockPulse }] }}>
                        <ThemedText type="caption" style={[styles.lockedLabel, { color: palette.textMuted }]}>
                          Locked
                        </ThemedText>
                      </Animated.View>
                    )}
                  </ThemedView>
                </Pressable>
              );
            })}
            <View style={[styles.tieBreakerCard, { borderColor: palette.divider }]}>
              <ThemedText type="subtitle">First goal tie-breaker</ThemedText>
              {!isSaved ? (
                <ThemedText type="bodyMuted">
                  If points are tied, the closest first-goal minute wins.
                </ThemedText>
              ) : null}
              <View style={styles.minuteHeader}>
                <ThemedText type="caption" style={{ color: palette.textMuted }}>
                  Selected minute
                </ThemedText>
                <ThemedText type="caption" style={{ color: palette.textMuted }}>
                  Range 1 - 120
                </ThemedText>
              </View>
              <View style={styles.minuteControlRow}>
                <View style={[styles.minuteNumberBadge, { backgroundColor: palette.surfaceAlt }]}>
                  {isSaved ? (
                    <ThemedText type="display">{firstGoalMinute.trim() || '1'}</ThemedText>
                  ) : (
                    <View style={styles.minuteScrollWindow}>
                      <ScrollView
                        ref={(node) => {
                          minuteScrollRef.current = node;
                        }}
                        style={styles.minuteScrollTouch}
                        showsVerticalScrollIndicator={false}
                        snapToInterval={36}
                        decelerationRate="fast"
                        contentContainerStyle={styles.minuteScrollContent}
                        scrollEventThrottle={16}
                        onScroll={(event) => {
                          const offsetY = event.nativeEvent.contentOffset.y;
                          const index = Math.round(offsetY / 36);
                          const minute = Math.min(120, Math.max(1, index + 1));
                          if (minute.toString() !== firstGoalMinute) {
                            setFirstGoalMinute(String(minute));
                            setFirstGoalError('');
                          }
                        }}
                        onMomentumScrollEnd={(event) => {
                          const index = Math.round(event.nativeEvent.contentOffset.y / 36);
                          const minute = Math.min(120, Math.max(1, index + 1));
                          setFirstGoalMinute(String(minute));
                          setFirstGoalError('');
                        }}>
                        {Array.from({ length: 120 }, (_, index) => {
                          const value = index + 1;
                          const isSelected = value === Number.parseInt(firstGoalMinute, 10);
                          return (
                            <View key={value} style={styles.minuteScrollItem}>
                              <ThemedText
                                type="subtitle"
                                style={{ color: isSelected ? palette.text : palette.textMuted }}>
                                {value}
                              </ThemedText>
                            </View>
                          );
                        })}
                      </ScrollView>
                      <View
                        pointerEvents="none"
                        style={[styles.minuteScrollHighlight, { borderColor: palette.divider }]}
                      />
                    </View>
                  )}
                </View>
              </View>
              <ThemedText type="caption" style={[styles.minuteSelectedLabel, { color: palette.textMuted }]}>
                {`Selected: ${firstGoalMinute.trim() || '1'}`}
              </ThemedText>
              {!isSaved ? (
                <View style={styles.minutePresetRow}>
                  {[15, 30, 45, 60, 75, 90].map((preset) => {
                    const isSelected = preset === Number.parseInt(firstGoalMinute, 10);
                    return (
                      <Pressable
                        key={preset}
                        onPress={() => updateFirstGoalMinute(preset)}
                        style={[
                          styles.minutePresetChip,
                          {
                            backgroundColor: isSelected ? palette.tint : palette.surfaceAlt,
                          },
                        ]}>
                        <ThemedText
                          type="caption"
                          style={{ color: isSelected ? palette.surface : palette.text }}>
                          {preset}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}
              {firstGoalError ? (
                <ThemedText type="caption" style={{ color: palette.danger }}>
                  {firstGoalError}
                </ThemedText>
              ) : null}
            {saveError ? (
              <ThemedText type="caption" style={{ color: palette.danger }}>
                {saveError}
              </ThemedText>
            ) : null}
            {saveNotice ? (
              <ThemedText type="caption" style={{ color: palette.textMuted }}>
                {saveNotice}
              </ThemedText>
            ) : null}
            </View>
            <View style={styles.actionRow}>
              <Pressable
                onPress={handleShare}
                style={[styles.secondaryButton, { borderColor: palette.divider }]}>
                <ThemedText type="button">{t('sharePicks')}</ThemedText>
              </Pressable>
              <Animated.View style={[styles.saveButtonWrap, { transform: [{ scale: lockPulse }] }]}>
                <Pressable
                  onPress={handleSave}
                  disabled={saving}
                  style={[styles.primaryButton, { backgroundColor: palette.tint }]}>
                  <ThemedText type="button" style={{ color: palette.surface }}>
                    {saving ? 'Saving...' : isSaved ? 'Edit' : t('savePicks')}
                  </ThemedText>
                </Pressable>
              </Animated.View>
            </View>
          </View>
        )}

        {tab === 'result' && (
          <View style={styles.resultStack}>
            <ThemedView variant="surface" style={[styles.resultCard, { borderColor: palette.divider }]}>
              <ThemedText type="subtitle">This round so far</ThemedText>
              <ThemedText type="bodyMuted" style={styles.resultCopy}>
                Exact scores return 5 points. Right outcome returns 2 points.
              </ThemedText>
              <View style={styles.resultRow}>
                <View>
                  <ThemedText type="label" style={{ color: palette.textMuted }}>
                    {t('points')}
                  </ThemedText>
                  <ThemedText type="display">{totalPoints}</ThemedText>
                </View>
                <View style={[styles.resultPill, { backgroundColor: palette.surfaceAlt }]}>
                  <ThemedText type="caption">{t('weeklyForm')}</ThemedText>
                  <ThemedText type="subtitle">+{Math.max(totalPoints, 0)}</ThemedText>
                </View>
              </View>
            </ThemedView>

            <ThemedView variant="surface" style={[styles.resultCard, { borderColor: palette.divider }]}>
              <ThemedText type="subtitle">Match breakdown</ThemedText>
              <View style={styles.resultList}>
                {matches.map((match) => {
                  const prediction = predictions[match.id] ?? { home: null, away: null };
                  const isLive =
                    match.status === 'IN_PLAY' || match.status === 'PAUSED' || match.status === 'TIMED';
                  const isFinished = match.status === 'FINISHED';
                  const scoreValue = match.score?.fullTime;
                  const scoreText = scoreValue
                    ? `${scoreValue.home ?? '-'}-${scoreValue.away ?? '-'}`
                    : '-';
                  const points = calculatePoints(prediction, match.score?.fullTime ?? null);
                  return (
                    <View key={match.id} style={[styles.resultItem, { borderColor: palette.divider }]}>
                      <View style={styles.resultItemHeader}>
                        {renderTeamBadge(match, 'home', 'large')}
                        <View style={styles.resultCenter}>
                          <ThemedText type="caption" style={{ color: palette.textMuted }}>
                            You predicted
                          </ThemedText>
                          <ThemedText type="subtitle" style={{ color: palette.textMuted }}>
                            {prediction.home ?? '-'}-{prediction.away ?? '-'}
                          </ThemedText>
                          {isLive ? (
                            <>
                              <ThemedText type="caption" style={{ color: palette.danger }}>
                                Live
                              </ThemedText>
                              <ThemedText type="subtitle" style={{ color: palette.danger }}>
                                {scoreText}
                              </ThemedText>
                            </>
                          ) : isFinished ? (
                            <>
                              <ThemedText type="caption" style={{ color: palette.textMuted }}>
                                Final
                              </ThemedText>
                              <ThemedText type="subtitle" style={{ color: palette.success }}>
                                {scoreText}
                              </ThemedText>
                            </>
                          ) : null}
                        </View>
                        {renderTeamBadge(match, 'away', 'large')}
                      </View>
                      <View style={styles.resultItemFooter}>
                        <View style={[styles.pointsChip, { backgroundColor: palette.surfaceAlt }]}>
                          <ThemedText type="caption">{`+${points}`}</ThemedText>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View style={[styles.tieBreakerRow, { borderColor: palette.divider }]}>
                <ThemedText type="caption" style={{ color: palette.textMuted }}>
                  First goal minute (tie-breaker)
                </ThemedText>
                <ThemedText type="subtitle">
                  {firstGoalMinute.trim() ? firstGoalMinute : '—'}
                </ThemedText>
              </View>
            </ThemedView>
          </View>
        )}

        {tab === 'schedule' && (
          <View style={styles.scheduleStack}>
            <ThemedView variant="surface" style={[styles.resultCard, { borderColor: palette.divider }]}>
              <ThemedText type="subtitle">Fixture schedule</ThemedText>
              <ThemedText type="bodyMuted">
                Upcoming, live, and finished fixtures in your local time.
              </ThemedText>
            </ThemedView>

            <View style={styles.segmented}>
              {(['upcoming', 'live', 'finished'] as const).map((filter) => {
                const active = scheduleFilter === filter;
                return (
                  <Pressable
                    key={filter}
                    onPress={() => setScheduleFilter(filter)}
                    style={[
                      styles.segment,
                      { backgroundColor: active ? palette.tint : palette.surface },
                    ]}>
                    <ThemedText
                      type="button"
                      style={{ color: active ? palette.surface : palette.text }}>
                      {t(filter)}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.scheduleList}>
              {filteredSchedule.length === 0 ? (
                <ThemedText type="bodyMuted">No fixtures available.</ThemedText>
              ) : (
                filteredSchedule.map((match) => {
                  const kickoff = new Date(match.utcDate);
                  const time = kickoff.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const date = kickoff.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  });
                  const statusLabel =
                    match.status === 'IN_PLAY' || match.status === 'PAUSED'
                      ? 'Live'
                      : match.status === 'FINISHED'
                        ? 'Final'
                        : 'Upcoming';
                  return (
                    <ThemedView
                      key={match.id}
                      variant="surface"
                      style={[styles.scheduleCard, { borderColor: palette.divider }]}>
                      <View style={styles.scheduleRow}>
                        <View style={styles.scheduleTeam}>
                          {renderTeamBadge(match, 'home')}
                          <ThemedText type="caption">{tTeam(match.homeTeam.name)}</ThemedText>
                        </View>
                        <View style={styles.scheduleCenter}>
                          <ThemedText type="caption" style={{ color: palette.textMuted }}>
                            {date}
                          </ThemedText>
                          <ThemedText type="subtitle">{time}</ThemedText>
                          <ThemedText type="caption" style={{ color: palette.textMuted }}>
                            {statusLabel}
                          </ThemedText>
                        </View>
                        <View style={styles.scheduleTeam}>
                          {renderTeamBadge(match, 'away')}
                          <ThemedText type="caption">{tTeam(match.awayTeam.name)}</ThemedText>
                        </View>
                      </View>
                    </ThemedView>
                  );
                })
              )}
            </View>
          </View>
        )}
      </ScrollView>

      <ViewShot ref={shareShotRef} options={{ format: 'png', quality: 0.9 }} style={styles.shareCard}>
        <View style={styles.shareCanvas}>
          <View style={styles.shareGlow} />
          <View style={styles.shareHeader}>
            <Best6Logo size={34} />
            <View style={styles.shareHeaderText}>
              <ThemedText type="subtitle" style={styles.shareTitle}>
                Best6
              </ThemedText>
              <ThemedText type="caption" style={styles.shareSubtitle}>
                Weekly Predictions
              </ThemedText>
            </View>
          </View>

          <View style={styles.shareMetaRow}>
            <ThemedText type="caption" style={styles.shareMetaText}>
              {`Matchday ${matchday}`}
            </ThemedText>
            <ThemedText type="caption" style={styles.shareMetaText}>
              {formatShareDate(matches[0]?.utcDate)}
            </ThemedText>
          </View>

          <View style={styles.shareMainCard}>
            {matches.slice(0, 6).map((match) => {
              const prediction = predictions[match.id] ?? { home: 0, away: 0 };
              return (
                <View key={match.id} style={styles.shareRow}>
                  <View style={styles.shareSide}>
                    {renderTeamBadge(match, 'home', 'share', '#35235E', '#FFE878')}
                  </View>
                  <View style={styles.shareScoreBlock}>
                    <View style={styles.shareScoreRow}>
                      <ThemedText type="subtitle" style={styles.shareScore}>
                        {prediction.home ?? 0}
                      </ThemedText>
                      <ThemedText type="subtitle" style={styles.shareScoreDash}>-</ThemedText>
                      <ThemedText type="subtitle" style={styles.shareScore}>
                        {prediction.away ?? 0}
                      </ThemedText>
                    </View>
                    <ThemedText type="caption" style={styles.shareTime}>
                      {formatKickoff(match.utcDate)}
                    </ThemedText>
                  </View>
                  <View style={styles.shareSide}>
                    {renderTeamBadge(match, 'away', 'share', '#35235E', '#FFE878')}
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.shareFooter}>
            <ThemedText type="caption" style={styles.shareFooterText}>
              {`My picks for Matchday ${matchday}`}
            </ThemedText>
            <ThemedText type="caption" style={styles.shareFooterText}>
              {`Total picks: ${Math.min(6, matches.length)}`}
            </ThemedText>
            <ThemedText type="caption" style={styles.shareFooterText}>
              {`First goal minute: ${firstGoalMinute}`}
            </ThemedText>
          </View>

          <ThemedText type="caption" style={styles.shareBrand}>
            {`Made with Best6 - ${userName}`}
          </ThemedText>
        </View>
      </ViewShot>

      {showSaveModal && (
        <View style={styles.paymentOverlay}>
          <View style={[styles.paymentCard, { backgroundColor: palette.surface }]}>
            <ThemedText type="subtitle">Picks saved</ThemedText>
            <ThemedText type="bodyMuted">Your predictions are locked.</ThemedText>
            <View style={styles.paymentActions}>
              <Pressable
                onPress={() => setShowSaveModal(false)}
                style={[styles.primaryButton, { backgroundColor: palette.tint }]}>
                <ThemedText type="button" style={{ color: palette.surface }}>
                  OK
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      )}

    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 140,
  },
  hero: {
    padding: 20,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
  },
  heroHalo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    top: -60,
    right: -80,
    opacity: 0.9,
  },
  heroImageWrap: {
    width: '100%',
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 14,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroText: {
    flex: 1,
  },
  heroTextBlock: {
    flex: 1,
    gap: 10,
  },
  heroCopy: {
    marginTop: 12,
    maxWidth: 260,
  },
  pointsBadge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
  },
  segmented: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
  },
  matchList: {
    gap: 14,
  },
  shareCard: {
    position: 'absolute',
    left: -9999,
    top: -9999,
    width: 360,
    height: 640,
  },
  shareCanvas: {
    flex: 1,
    borderRadius: 28,
    padding: 20,
    backgroundColor: '#2D1B4E',
    overflow: 'hidden',
  },
  shareGlow: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: 'rgba(255, 232, 120, 0.16)',
    top: -120,
    right: -140,
  },
  shareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shareHeaderText: {
    gap: 2,
  },
  shareTitle: {
    color: '#FFE878',
  },
  shareSubtitle: {
    color: 'rgba(255, 232, 120, 0.7)',
  },
  shareMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  shareMetaText: {
    color: 'rgba(255, 232, 120, 0.7)',
  },
  shareMainCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 22,
    backgroundColor: '#35235E',
    borderWidth: 1,
    borderColor: 'rgba(255, 232, 120, 0.35)',
    gap: 10,
  },
  shareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shareSide: {
    width: 90,
    alignItems: 'center',
    gap: 6,
  },
  shareScoreBlock: {
    alignItems: 'center',
    gap: 6,
  },
  shareScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareScore: {
    minWidth: 22,
    textAlign: 'center',
    color: '#FFE878',
  },
  shareScoreDash: {
    color: 'rgba(255, 232, 120, 0.6)',
  },
  shareTime: {
    color: 'rgba(255, 232, 120, 0.6)',
  },
  shareFooter: {
    marginTop: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 232, 120, 0.35)',
    gap: 4,
  },
  shareFooterText: {
    color: 'rgba(255, 232, 120, 0.7)',
  },
  shareBrand: {
    marginTop: 'auto',
    textAlign: 'center',
    color: 'rgba(255, 232, 120, 0.6)',
  },
  matchCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  contextRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  lockedLabel: {
    marginTop: 10,
    textAlign: 'center',
  },
  matchChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teamBlock: {
    flex: 1,
    gap: 6,
  },
  teamBlockRight: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 6,
  },
  scoreInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreStepper: {
    alignItems: 'center',
    gap: 6,
  },
  stepButton: {
    width: 40,
    height: 34,
    borderRadius: 0,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepSymbol: {
    fontSize: 52,
    lineHeight: 54,
    fontFamily: Fonts.handwriting,
    transform: [{ rotate: '-4deg' }],
  },
  stepSymbolPlus: {
    transform: [{ rotate: '-4deg' }, { translateY: -5 }],
  },
  scoreCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamBadgeLarge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamBadgeShare: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamCrest: {
    width: 28,
    height: 28,
  },
  teamCrestLarge: {
    width: 36,
    height: 36,
  },
  teamCrestShare: {
    width: 42,
    height: 42,
  },
  teamName: {
    fontSize: 12,
    lineHeight: 14,
  },
  teamNameRight: {
    textAlign: 'right',
  },
  resultCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  scheduleStack: {
    gap: 16,
  },
  scheduleList: {
    gap: 12,
  },
  scheduleCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  scheduleTeam: {
    alignItems: 'center',
    gap: 6,
    width: 90,
  },
  scheduleCenter: {
    alignItems: 'center',
    gap: 4,
  },
  resultStack: {
    gap: 16,
  },
  resultCopy: {
    marginTop: 6,
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
  },
  resultList: {
    marginTop: 12,
    gap: 10,
  },
  resultItem: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  resultItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'space-between',
  },
  resultCenter: {
    alignItems: 'center',
    gap: 2,
    minWidth: 110,
  },
  resultItemFooter: {
    marginTop: 6,
    alignItems: 'center',
  },
  pointsChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tieBreakerRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vsText: {
    minWidth: 28,
    textAlign: 'center',
  },
  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  liveRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsBlock: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  statsRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 16,
  },
  h2hBlock: {
    marginTop: 12,
    gap: 6,
    alignItems: 'center',
  },
  statsColumn: {
    flex: 1,
    gap: 6,
  },
  statsRowInline: {
    flexDirection: 'row-reverse',
    gap: 8,
    alignItems: 'center',
  },
  statsRowInlineLeft: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  statsRowInlineRight: {
    flexDirection: 'row-reverse',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  h2hLine: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  tieBreakerCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    gap: 8,
    marginTop: 8,
  },
  minuteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  minuteControlRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
  },
  minuteNumberBadge: {
    flex: 1,
    borderRadius: 18,
    alignItems: 'center',
    width: '100%',
  },
  minuteScrollWindow: {
    height: 160,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  minuteScrollTouch: {
    width: '100%',
  },
  minuteScrollContent: {
    paddingVertical: 42,
  },
  minuteScrollItem: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minuteScrollHighlight: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 42,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
  },
  minutePresetRow: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  minutePresetChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  minuteSelectedLabel: {
    marginTop: 6,
    textAlign: 'center',
  },
  secondaryButton: {
    flex: 1,
    flexBasis: 0,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  primaryButton: {
    flex: 1,
    flexBasis: 0,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonWrap: {
    flex: 1.2,
  },
  paymentOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 20,
  },
  paymentCard: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  paymentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  loading: {
    paddingVertical: 20,
  },
});




