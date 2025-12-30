import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/context/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

const rewards = [
  { id: 'r1', titleKey: 'rewardTitleR1', detailKey: 'rewardDetailR1', points: 60 },
  { id: 'r2', titleKey: 'rewardTitleR2', detailKey: 'rewardDetailR2', points: 40 },
  { id: 'r3', titleKey: 'rewardTitleR3', detailKey: 'rewardDetailR3', points: 30 },
];

export default function RewardsScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BackButton />
        <ThemedText type="title" style={styles.title}>
          {t('rewards')}
        </ThemedText>
        <ThemedText type="bodyMuted" style={styles.subtitle}>
          {t('rewardsIntro')}
        </ThemedText>

        <View style={styles.list}>
          {rewards.map((reward) => (
            <ThemedView
              key={reward.id}
              variant="surface"
              style={[styles.card, { borderColor: palette.divider }]}>
              <View style={styles.cardRow}>
                <View style={styles.textBlock}>
                  <ThemedText type="subtitle">{t(reward.titleKey)}</ThemedText>
                  <ThemedText type="bodyMuted">{t(reward.detailKey)}</ThemedText>
                </View>
                <View style={[styles.pointsBadge, { backgroundColor: palette.surfaceAlt }]}>
                  <ThemedText type="caption">+{reward.points}</ThemedText>
                </View>
              </View>
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
  },
  title: {
    marginBottom: 6,
  },
  subtitle: {
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  pointsBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
});


