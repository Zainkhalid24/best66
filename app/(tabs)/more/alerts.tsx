import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/context/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AlertsScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [goalAlerts, setGoalAlerts] = useState(false);
  const [newsAlerts, setNewsAlerts] = useState(true);

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BackButton />
        <ThemedText type="title" style={styles.title}>
          {t('alerts')}
        </ThemedText>
        <ThemedView variant="surface" style={[styles.card, { borderColor: palette.divider }]}>
          <View style={styles.row}>
            <View style={styles.textBlock}>
              <ThemedText type="subtitle">{t('alertsKickoffTitle')}</ThemedText>
              <ThemedText type="bodyMuted">{t('alertsKickoffBody')}</ThemedText>
            </View>
            <Switch value={matchAlerts} onValueChange={setMatchAlerts} />
          </View>
          <View style={styles.row}>
            <View style={styles.textBlock}>
              <ThemedText type="subtitle">{t('alertsGoalTitle')}</ThemedText>
              <ThemedText type="bodyMuted">{t('alertsGoalBody')}</ThemedText>
            </View>
            <Switch value={goalAlerts} onValueChange={setGoalAlerts} />
          </View>
          <View style={styles.row}>
            <View style={styles.textBlock}>
              <ThemedText type="subtitle">{t('alertsLeagueTitle')}</ThemedText>
              <ThemedText type="bodyMuted">{t('alertsLeagueBody')}</ThemedText>
            </View>
            <Switch value={newsAlerts} onValueChange={setNewsAlerts} />
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
  },
  title: {
    marginBottom: 16,
  },
  card: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
});
