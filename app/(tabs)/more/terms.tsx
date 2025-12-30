import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/context/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TermsScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackButton />
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.divider }]}>
          <ThemedText type="title">{t('terms')}</ThemedText>
          <ThemedText type="bodyMuted">{t('termsIntro')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('termsFairPlayTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('termsFairPlayBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('termsEligibilityTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('termsEligibilityBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('termsPicksTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('termsPicksBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('termsResultsTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('termsResultsBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('termsUserContentTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('termsUserContentBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('termsAccountSecurityTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('termsAccountSecurityBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('termsServiceChangesTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('termsServiceChangesBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('termsTerminationTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('termsTerminationBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('termsContactTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('termsContactBody')}</ThemedText>
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


