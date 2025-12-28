import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/context/language-context';
import { loadRounds, type RoundResult } from '@/data/best6-store';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();
  const [rounds, setRounds] = useState<RoundResult[]>([]);

  useEffect(() => {
    loadRounds()
      .then((data) => setRounds(data))
      .catch(() => undefined);
  }, []);

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BackButton />
        <ThemedText type="title" style={styles.title}>
          {t('history')}
        </ThemedText>
        {rounds.length === 0 ? (
          <ThemedText type="bodyMuted">No saved rounds yet. Lock your picks first.</ThemedText>
        ) : (
          rounds.map((round) => (
            <ThemedView
              key={round.id}
              variant="surface"
              style={[styles.roundCard, { borderColor: palette.divider }]}>
              <View style={styles.roundHeader}>
                <ThemedText type="subtitle">{`${t('matchday')} ${round.matchday}`}</ThemedText>
                <ThemedText type="bodyMuted">{round.totalPoints} pts</ThemedText>
              </View>
              {typeof round.firstGoalMinute === 'number' ? (
                <ThemedText type="caption" style={{ color: palette.textMuted }}>
                  {`First goal minute: ${round.firstGoalMinute}`}
                </ThemedText>
              ) : null}
              {round.picks.slice(0, 3).map((pick) => (
                <View key={pick.matchId} style={styles.pickRow}>
                  <ThemedText type="body">{`Match #${pick.matchId}`}</ThemedText>
                  <ThemedText type="bodyMuted">
                    {pick.prediction.home ?? '-'}:{pick.prediction.away ?? '-'}
                  </ThemedText>
                </View>
              ))}
              {round.picks.length > 3 ? (
                <ThemedText type="caption" style={{ color: palette.textMuted }}>
                  +{round.picks.length - 3} more matches
                </ThemedText>
              ) : null}
            </ThemedView>
          ))
        )}
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
  title: {
    marginBottom: 16,
  },
  roundCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
    gap: 8,
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
