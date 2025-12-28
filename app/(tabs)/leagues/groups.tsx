import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/context/language-context';
import { loadLeagues, saveLeagues, type League } from '@/data/best6-store';
import { syncLeagues } from '@/data/supabase-sync';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LeaguesGroupsScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [leagueName, setLeagueName] = useState('');
  const [leagueCode, setLeagueCode] = useState('');

  useEffect(() => {
    loadLeagues()
      .then((stored) => setLeagues(stored))
      .catch(() => undefined);
  }, []);

  const handleCreate = async () => {
    if (!leagueName.trim()) {
      return;
    }
    const newLeague: League = {
      id: `league-${Date.now()}`,
      name: leagueName.trim(),
      code: leagueCode.trim() || `B6-${Math.floor(Math.random() * 900 + 100)}`,
      members: 1,
    };
    const updated = [newLeague, ...leagues];
    setLeagues(updated);
    setLeagueName('');
    setLeagueCode('');
    await saveLeagues(updated);
    syncLeagues().catch(() => undefined);
  };

  const handleJoin = async () => {
    if (!leagueCode.trim()) {
      return;
    }
    const newLeague: League = {
      id: `league-${Date.now()}`,
      name: `League ${leagueCode.trim()}`,
      code: leagueCode.trim(),
      members: 12,
    };
    const updated = [newLeague, ...leagues];
    setLeagues(updated);
    setLeagueName('');
    setLeagueCode('');
    await saveLeagues(updated);
    syncLeagues().catch(() => undefined);
  };

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>
          League Workshop
        </ThemedText>
        <ThemedText type="bodyMuted" style={styles.subtitle}>
          Spin up a private league or join with a code from your friends.
        </ThemedText>

        <ThemedView variant="surface" style={[styles.card, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('createLeague')}</ThemedText>
          <TextInput
            placeholder={t('leagueName')}
            placeholderTextColor={palette.textMuted}
            value={leagueName}
            onChangeText={setLeagueName}
            style={[styles.input, { borderColor: palette.divider, color: palette.text }]}
          />
          <TextInput
            placeholder={t('code')}
            placeholderTextColor={palette.textMuted}
            value={leagueCode}
            onChangeText={setLeagueCode}
            style={[styles.input, { borderColor: palette.divider, color: palette.text }]}
          />
          <Pressable
            onPress={handleCreate}
            style={[styles.primaryButton, { backgroundColor: palette.tint }]}>
            <ThemedText type="button" style={{ color: palette.surface }}>
              {t('createLeague')}
            </ThemedText>
          </Pressable>
        </ThemedView>

        <ThemedView variant="surface" style={[styles.card, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('joinLeague')}</ThemedText>
          <TextInput
            placeholder={t('code')}
            placeholderTextColor={palette.textMuted}
            value={leagueCode}
            onChangeText={setLeagueCode}
            style={[styles.input, { borderColor: palette.divider, color: palette.text }]}
          />
          <Pressable
            onPress={handleJoin}
            style={[styles.secondaryButton, { borderColor: palette.divider }]}>
            <ThemedText type="button">{t('joinLeague')}</ThemedText>
          </Pressable>
        </ThemedView>

        <View style={styles.list}>
          {leagues.map((league) => (
            <ThemedView
              key={league.id}
              variant="surface"
              style={[styles.leagueCard, { borderColor: palette.divider }]}>
              <View style={styles.leagueRow}>
                <ThemedText type="subtitle">{league.name}</ThemedText>
                <ThemedText type="bodyMuted">{league.members} members</ThemedText>
              </View>
              <ThemedText type="bodyMuted">{league.code}</ThemedText>
            </ThemedView>
          ))}
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
    gap: 16,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 10,
  },
  card: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  primaryButton: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  secondaryButton: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
    borderWidth: 1,
  },
  list: {
    gap: 12,
  },
  leagueCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  leagueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
