import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function PrivacyScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackButton />
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.divider }]}>
          <ThemedText type="title">Privacy Policy</ThemedText>
          <ThemedText type="bodyMuted">How we handle your data.</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Data collection</ThemedText>
          <ThemedText type="bodyMuted">
            We collect your name, email, picks, and usage data needed to run Best6.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">How we use data</ThemedText>
          <ThemedText type="bodyMuted">
            Data is used to keep your account secure, save picks, calculate points, and show
            leaderboards.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Third-party services</ThemedText>
          <ThemedText type="bodyMuted">
            We rely on trusted providers for authentication, storage, and match data.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Sharing</ThemedText>
          <ThemedText type="bodyMuted">
            We do not sell your personal data. Public leaderboards may show your name.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Security</ThemedText>
          <ThemedText type="bodyMuted">
            We use standard security practices, but no system is completely secure.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Your control</ThemedText>
          <ThemedText type="bodyMuted">
            You can request access, correction, or deletion of your data at any time.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Contact</ThemedText>
          <ThemedText type="bodyMuted">
            Questions about privacy? Contact support from the More tab.
          </ThemedText>
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
