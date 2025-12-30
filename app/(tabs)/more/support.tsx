import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/context/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SupportScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackButton />
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.divider }]}>
          <ThemedText type="title">{t('support')}</ThemedText>
          <ThemedText type="bodyMuted">{t('supportIntro')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('supportLiveChatTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('supportLiveChatBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('supportEmailTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('supportEmailBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('supportReportTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('supportReportBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('supportLoginTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('supportLoginBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('supportPicksTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('supportPicksBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('supportFeatureTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('supportFeatureBody')}</ThemedText>
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



