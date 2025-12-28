import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SupportScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackButton />
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.divider }]}>
          <ThemedText type="title">Support</ThemedText>
          <ThemedText type="bodyMuted">We are here to help.</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Live chat</ThemedText>
          <ThemedText type="bodyMuted">Message us in-app any time. Typical response within 1 hour.</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Email support</ThemedText>
          <ThemedText type="bodyMuted">support@best6.app (24–48 hours)</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Report a result issue</ThemedText>
          <ThemedText type="bodyMuted">
            If a match result looks wrong, send the fixture name and screenshot.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Login problems</ThemedText>
          <ThemedText type="bodyMuted">
            Make sure your email is correct. Use Account to reset your password if needed.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Picks not saving</ThemedText>
          <ThemedText type="bodyMuted">
            Check your internet connection and try again. If it keeps happening, contact support.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Feature requests</ThemedText>
          <ThemedText type="bodyMuted">
            Share ideas with us. We review the most requested features every week.
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
