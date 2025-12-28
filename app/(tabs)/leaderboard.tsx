import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Best6Logo } from '@/components/best6-logo';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/context/language-context';
import {
  computeWeeklyPoints,
  loadLeaderboard,
  loadRounds,
  type LeaderboardEntry,
  type RoundResult,
} from '@/data/best6-store';
import { useColorScheme } from '@/hooks/use-color-scheme';

const sampleLeaders: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Rami',
    totalPoints: 88,
    weeklyPoints: 20,
    predictions: [
      { home: 2, away: 1 },
      { home: 1, away: 0 },
      { home: 3, away: 2 },
      { home: 2, away: 2 },
      { home: 0, away: 1 },
      { home: 4, away: 1 },
    ],
  },
  {
    id: '2',
    name: 'Lina',
    totalPoints: 84,
    weeklyPoints: 18,
    predictions: [
      { home: 1, away: 1 },
      { home: 2, away: 0 },
      { home: 2, away: 1 },
      { home: 1, away: 2 },
      { home: 3, away: 0 },
      { home: 1, away: 0 },
    ],
  },
  {
    id: '3',
    name: 'Kai',
    totalPoints: 79,
    weeklyPoints: 14,
    predictions: [
      { home: 0, away: 0 },
      { home: 2, away: 2 },
      { home: 1, away: 0 },
      { home: 2, away: 1 },
      { home: 1, away: 3 },
      { home: 2, away: 0 },
    ],
  },
  { id: '4', name: 'You', totalPoints: 72, weeklyPoints: 12 },
];

const computeMonthlyPoints = (rounds: RoundResult[], now = new Date()) => {
  const monthAgo = new Date(now);
  monthAgo.setDate(now.getDate() - 30);
  return rounds.reduce((sum, round) => {
    const created = new Date(round.createdAt);
    if (created >= monthAgo) {
      return sum + round.totalPoints;
    }
    return sum;
  }, 0);
};

const computeSeasonPoints = (rounds: RoundResult[]) =>
  rounds.reduce((sum, round) => sum + round.totalPoints, 0);

export default function LeaderboardScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [monthlyPoints, setMonthlyPoints] = useState(0);
  const [seasonPoints, setSeasonPoints] = useState(0);

  useEffect(() => {
    loadLeaderboard()
      .then((entries) => {
        if (entries.length === 0) {
          setLeaders(sampleLeaders);
          return;
        }
        setLeaders(entries);
      })
      .catch(() => setLeaders(sampleLeaders));
    loadRounds()
      .then((rounds) => {
        setWeeklyPoints(computeWeeklyPoints(rounds));
        setMonthlyPoints(computeMonthlyPoints(rounds));
        setSeasonPoints(computeSeasonPoints(rounds));
      })
      .catch(() => undefined);
  }, []);

  const sortedLeaders = useMemo(
    () => [...leaders].sort((a, b) => b.totalPoints - a.totalPoints),
    [leaders]
  );

  const now = new Date();
  const season = `${now.getFullYear()}-${now.getFullYear() + 1}`;
  const month = now.toLocaleDateString(undefined, { month: 'long' });
  const round = `Round ${now.getMonth() + 1}`;

  const topLeaders = sortedLeaders.slice(0, 15);
  const podium = topLeaders.slice(0, 3);
  const others = topLeaders.slice(3);

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedView variant="surface" style={[styles.headerCard, { borderColor: palette.divider }]}>
          <View style={styles.headerRow}>
            <Best6Logo size={48} />
            <View style={styles.headerText}>
              <ThemedText type="title">{t('leaderboard')}</ThemedText>
              <ThemedText type="bodyMuted">{`${round} • ${month} • Season ${season}`}</ThemedText>
            </View>
          </View>
          <View style={styles.badgeGroup}>
            <View style={[styles.weekBadge, { backgroundColor: palette.surfaceAlt }]}>
              <ThemedText type="caption">{t('weeklyForm')}</ThemedText>
              <ThemedText type="subtitle">+{weeklyPoints}</ThemedText>
            </View>
            <View style={[styles.weekBadge, { backgroundColor: palette.surfaceAlt }]}>
              <ThemedText type="caption">Monthly</ThemedText>
              <ThemedText type="subtitle">+{monthlyPoints}</ThemedText>
            </View>
            <View style={[styles.weekBadge, { backgroundColor: palette.surfaceAlt }]}>
              <ThemedText type="caption">Season</ThemedText>
              <ThemedText type="subtitle">+{seasonPoints}</ThemedText>
            </View>
          </View>
        </ThemedView>

        <View style={styles.podium}>
          {podium.map((leader, index) => {
            const height = 110 + (2 - index) * 18;
            const highlightColor = palette.success;
            return (
              <View key={leader.id} style={styles.podiumSlot}>
                <View
                  style={[
                    styles.podiumBlock,
                    {
                      height,
                      backgroundColor: palette.surface,
                      borderColor: palette.divider,
                    },
                  ]}>
                  <ThemedText type="subtitle" style={{ color: highlightColor }}>
                    #{index + 1}
                  </ThemedText>
                  <View style={styles.podiumNameRow}>
                    <ThemedText type="body" style={{ color: highlightColor }}>
                      {leader.name}
                    </ThemedText>
                    {index === 0 ? (
                      <View style={[styles.crownBadge, { backgroundColor: palette.surfaceAlt }]}>
                        <IconSymbol name="crown.fill" size={16} color={highlightColor} />
                      </View>
                    ) : null}
                  </View>
                  <ThemedText type="caption" style={{ color: highlightColor }}>
                    {leader.totalPoints} pts
                  </ThemedText>
                  {leader.predictions ? (
                    <View style={styles.predictionRow}>
                      {leader.predictions.slice(0, 3).map((pick, pickIndex) => (
                        <View key={`${leader.id}-${pickIndex}`} style={styles.predictionBadge}>
                          <ThemedText type="caption">{`${pick.home}-${pick.away}`}</ThemedText>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>

        <ThemedView variant="surface" style={[styles.listCard, { borderColor: palette.divider }]}>
          {others.map((leader, index) => (
            <View key={leader.id} style={styles.listRow}>
              <ThemedText type="body">{index + 4}</ThemedText>
              <View style={styles.listName}>
                <ThemedText type="body">{leader.name}</ThemedText>
                {leader.predictions ? (
                  <View style={styles.predictionRow}>
                    {leader.predictions.slice(0, 3).map((pick, pickIndex) => (
                      <View key={`${leader.id}-list-${pickIndex}`} style={styles.predictionBadge}>
                        <ThemedText type="caption">{`${pick.home}-${pick.away}`}</ThemedText>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
              <ThemedText type="bodyMuted">{leader.totalPoints}</ThemedText>
            </View>
          ))}
        </ThemedView>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  headerCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 24,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  badgeGroup: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weekBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: 'center',
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 24,
  },
  podiumSlot: {
    flex: 1,
    alignItems: 'center',
  },
  podiumBlock: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  podiumNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  crownBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  predictionRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  predictionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  listCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listName: {
    flex: 1,
  },
});


