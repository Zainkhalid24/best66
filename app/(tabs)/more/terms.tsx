import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TermsScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackButton />
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.divider }]}>
          <ThemedText type="title">Terms of Service</ThemedText>
          <ThemedText type="bodyMuted">Review the terms before competing.</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Fair play</ThemedText>
          <ThemedText type="bodyMuted">No cheating, no duplicate accounts.</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Eligibility</ThemedText>
          <ThemedText type="bodyMuted">
            You must provide accurate information and use the app legally in your region.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Picks and scoring</ThemedText>
          <ThemedText type="bodyMuted">
            Your picks lock when saved. Scoring follows the rules shown in the app.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Results and data</ThemedText>
          <ThemedText type="bodyMuted">
            Match data comes from external providers and may be delayed or corrected.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">User content</ThemedText>
          <ThemedText type="bodyMuted">
            You are responsible for what you share. Do not post abusive or illegal content.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Account security</ThemedText>
          <ThemedText type="bodyMuted">
            Keep your login details safe. We are not liable for losses from shared accounts.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Service changes</ThemedText>
          <ThemedText type="bodyMuted">
            We may update features, rules, or availability to improve the product.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Termination</ThemedText>
          <ThemedText type="bodyMuted">
            We may suspend accounts that violate these terms or harm other users.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Contact</ThemedText>
          <ThemedText type="bodyMuted">
            Questions about terms? Contact support from the More tab.
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
