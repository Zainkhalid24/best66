import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/context/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function PrivacyScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackButton />
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.divider }]}>
          <ThemedText type="title">{t('privacy')}</ThemedText>
          <ThemedText type="bodyMuted">{t('privacyIntro')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('privacyDataCollectionTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('privacyDataCollectionBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('privacyDataUseTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('privacyDataUseBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('privacyThirdPartyTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('privacyThirdPartyBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('privacySharingTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('privacySharingBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('privacySecurityTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('privacySecurityBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('privacyControlTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('privacyControlBody')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('privacyContactTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('privacyContactBody')}</ThemedText>
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


