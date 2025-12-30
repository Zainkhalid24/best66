import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Best6Logo } from '@/components/best6-logo';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/context/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

const tiles = [
  { id: 'profile', titleKey: 'profile', descriptionKey: 'profileDesc' },
  { id: 'account', titleKey: 'account', descriptionKey: 'accountDesc' },
  { id: 'history', titleKey: 'history', descriptionKey: 'historyDesc' },
  { id: 'alerts', titleKey: 'alerts', descriptionKey: 'alertsDesc' },
  { id: 'rewards', titleKey: 'rewards', descriptionKey: 'rewardsDesc' },
  { id: 'settings', titleKey: 'settings', descriptionKey: 'settingsDesc' },
  { id: 'help', titleKey: 'help', descriptionKey: 'helpDesc' },
  { id: 'faq', titleKey: 'faq', descriptionKey: 'faqDesc' },
  { id: 'support', titleKey: 'support', descriptionKey: 'supportDesc' },
  { id: 'contact', titleKey: 'contact', descriptionKey: 'contactDesc' },
  { id: 'terms', titleKey: 'terms', descriptionKey: 'termsDesc' },
  { id: 'privacy', titleKey: 'privacy', descriptionKey: 'privacyDesc' },
  { id: 'logout', titleKey: 'logout', descriptionKey: 'logoutDesc' },
];

export default function MoreScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();
  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedView variant="surface" style={[styles.header, { borderColor: palette.divider }]}>
          <Best6Logo size={56} />
          <View style={styles.headerText}>
            <ThemedText type="title">{t('controlCenterTitle')}</ThemedText>
            <ThemedText type="bodyMuted">{t('controlCenterBody')}</ThemedText>
          </View>
        </ThemedView>

        <View style={styles.tileGrid}>
          {tiles.map((tile) => (
            <Pressable
              key={tile.id}
              onPress={() => router.push(`/more/${tile.id}`)}
              style={({ pressed }) => [
                styles.tile,
                {
                  backgroundColor: palette.surface,
                  borderColor: palette.divider,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}>
              <ThemedText type="subtitle">{t(tile.titleKey)}</ThemedText>
              <ThemedText type="bodyMuted">{t(tile.descriptionKey)}</ThemedText>
            </Pressable>
          ))}
          <Pressable
            onPress={() => router.push('/leagues/groups')}
            style={({ pressed }) => [
              styles.tileWide,
              {
                backgroundColor: palette.surfaceAlt,
                borderColor: palette.divider,
                opacity: pressed ? 0.9 : 1,
              },
            ]}>
            <ThemedText type="subtitle">{t('leagueWorkshop')}</ThemedText>
            <ThemedText type="bodyMuted">{t('leagueWorkshopDesc')}</ThemedText>
          </Pressable>
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
  header: {
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  tileGrid: {
    gap: 14,
  },
  tile: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
  },
  tileWide: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
  },
});


