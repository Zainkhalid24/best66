import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/context/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

const timezones = ['UTC', 'GMT+2', 'GMT+4'];
const teams = ['Arsenal', 'Barcelona', 'Real Madrid', 'Liverpool'];

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { t, language, setLanguage, tTeam } = useLanguage();
  const [timezone, setTimezone] = useState('UTC');
  const [favoriteTeam, setFavoriteTeam] = useState(teams[0]);

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BackButton />
        <ThemedText type="title" style={styles.title}>
          {t('settings')}
        </ThemedText>

        <ThemedView variant="surface" style={[styles.card, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('language')}</ThemedText>
          <View style={styles.segmented}>
            {(['en', 'ku'] as const).map((code) => (
              <Pressable
                key={code}
                onPress={() => setLanguage(code)}
                style={[
                  styles.segment,
                  {
                    backgroundColor: language === code ? palette.tint : palette.surfaceAlt,
                  },
                ]}>
                <ThemedText
                  type="button"
                  style={{ color: language === code ? palette.surface : palette.text }}>
                  {code.toUpperCase()}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </ThemedView>

        <ThemedView variant="surface" style={[styles.card, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('timezone')}</ThemedText>
          <View style={styles.segmented}>
            {timezones.map((zone) => (
              <Pressable
                key={zone}
                onPress={() => setTimezone(zone)}
                style={[
                  styles.segment,
                  { backgroundColor: timezone === zone ? palette.tint : palette.surfaceAlt },
                ]}>
                <ThemedText
                  type="button"
                  style={{ color: timezone === zone ? palette.surface : palette.text }}>
                  {zone}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </ThemedView>

        <ThemedView variant="surface" style={[styles.card, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('favoriteTeam')}</ThemedText>
          <View style={styles.segmented}>
            {teams.map((team) => (
              <Pressable
                key={team}
                onPress={() => setFavoriteTeam(team)}
                style={[
                  styles.segment,
                  { backgroundColor: favoriteTeam === team ? palette.tint : palette.surfaceAlt },
                ]}>
                <ThemedText
                  type="button"
                  style={{ color: favoriteTeam === team ? palette.surface : palette.text }}>
                  {tTeam(team)}
                </ThemedText>
              </Pressable>
            ))}
          </View>
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
    gap: 16,
  },
  title: {
    marginBottom: 6,
  },
  card: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
  },
  segmented: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
});
