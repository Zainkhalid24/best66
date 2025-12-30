import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/context/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HelpScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackButton />
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.divider }]}>
          <ThemedText type="title">{t('help')}</ThemedText>
          <ThemedText type="bodyMuted">{t('helpIntro')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('helpMakePredictionsTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('helpMakePredictionsBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('helpSavePicksTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('helpSavePicksBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('helpScoringRulesTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('helpScoringRulesBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('helpTieBreakerTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('helpTieBreakerBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('helpLeaderboardsTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('helpLeaderboardsBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('helpFixturesTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('helpFixturesBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('helpSharingTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('helpSharingBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('helpAccountTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('helpAccountBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('helpNeedHelpTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('helpNeedHelpBody')}</ThemedText>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
    gap: 12,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  item: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
});


