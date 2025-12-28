import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Best6Logo } from '@/components/best6-logo';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const tiles = [
  { id: 'profile', title: 'Profile', description: 'Your account card and stats.' },
  { id: 'account', title: 'Account', description: 'Email, password, security.' },
  { id: 'history', title: 'History', description: 'Review saved rounds and points.' },
  { id: 'alerts', title: 'Alerts', description: 'Match reminders and score alerts.' },
  { id: 'rewards', title: 'Rewards', description: 'Weekly missions and perks.' },
  { id: 'settings', title: 'Settings', description: 'Language, timezone, favorites.' },
  { id: 'help', title: 'Help', description: 'Quick tips and guides.' },
  { id: 'faq', title: 'FAQ', description: 'Common questions answered.' },
  { id: 'support', title: 'Support', description: 'Get help from our team.' },
  { id: 'contact', title: 'Contact', description: 'Reach us directly.' },
  { id: 'terms', title: 'Terms', description: 'Terms of service.' },
  { id: 'privacy', title: 'Privacy', description: 'Privacy policy.' },
  { id: 'logout', title: 'Log out', description: 'Sign out of Best6.' },
];

export default function MoreScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ThemedView variant="surface" style={[styles.header, { borderColor: palette.divider }]}>
          <Best6Logo size={56} />
          <View style={styles.headerText}>
            <ThemedText type="title">Control Center</ThemedText>
            <ThemedText type="bodyMuted">
              Manage your predictions, squads, and rewards in one place.
            </ThemedText>
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
              <ThemedText type="subtitle">{tile.title}</ThemedText>
              <ThemedText type="bodyMuted">{tile.description}</ThemedText>
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
            <ThemedText type="subtitle">League Workshop</ThemedText>
            <ThemedText type="bodyMuted">Create or join private leagues.</ThemedText>
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
