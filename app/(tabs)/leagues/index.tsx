import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Best6Logo } from '@/components/best6-logo';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/context/language-context';
import { loadLeagues, type League } from '@/data/best6-store';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LeaguesScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();
  const [leagues, setLeagues] = useState<League[]>([]);

  const loadStoredLeagues = useCallback(() => {
    let isActive = true;
    loadLeagues()
      .then((stored) => {
        if (isActive) {
          setLeagues(stored);
        }
      })
      .catch(() => undefined);
    return () => {
      isActive = false;
    };
  }, []);

  useFocusEffect(loadStoredLeagues);

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedView variant="surface" style={[styles.hero, { borderColor: palette.divider }]}>
          <Best6Logo size={42} />
          <ThemedText type="title">{t('leagues')}</ThemedText>
          <ThemedText type="bodyMuted">
            Build rivalries, climb private ladders, and compare weekly form.
          </ThemedText>
          <View style={styles.heroActions}>
            <Pressable
              onPress={() => router.push('/leagues/groups')}
              style={[styles.primaryButton, { backgroundColor: palette.tint }]}>
              <ThemedText type="button" style={{ color: palette.surface }}>
                {t('createLeague')}
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => router.push('/leagues/groups')}
              style={[styles.secondaryButton, { borderColor: palette.divider }]}>
              <ThemedText type="button">{t('joinLeague')}</ThemedText>
            </Pressable>
          </View>
        </ThemedView>

        <View style={styles.cardList}>
          {leagues.length === 0 ? (
            <ThemedText type="bodyMuted">No leagues yet. Create or join one to get started.</ThemedText>
          ) : (
            leagues.map((league) => (
              <ThemedView
                key={league.id}
                variant="surface"
                style={[styles.leagueCard, { borderColor: palette.divider }]}>
                <View style={styles.leagueHeader}>
                  <ThemedText type="subtitle">{league.name}</ThemedText>
                  <View style={[styles.memberBadge, { backgroundColor: palette.surfaceAlt }]}>
                    <ThemedText type="caption">{league.members} members</ThemedText>
                  </View>
                </View>
                <ThemedText type="bodyMuted">
                  Weekly pot: Winner takes 60%, runner-up 30%, best upset 10%.
                </ThemedText>
                <Pressable
                  onPress={() => router.push('/leagues/groups')}
                  style={[styles.inlineButton, { backgroundColor: palette.surfaceAlt }]}>
                  <ThemedText type="button">Open League</ThemedText>
                </Pressable>
              </ThemedView>
            ))
          )}
        </View>
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
  hero: {
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 20,
    gap: 10,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  cardList: {
    gap: 14,
  },
  leagueCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
  },
  leagueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  inlineButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 8,
  },
});
