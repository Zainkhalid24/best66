import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function FaqScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackButton />
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.divider }]}>
          <ThemedText type="title">FAQ</ThemedText>
          <ThemedText type="bodyMuted">Answers to common questions.</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">How are points calculated?</ThemedText>
          <ThemedText type="bodyMuted">Exact score = 5 points. Correct outcome (win/draw) = 2 points.</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">When do picks lock?</ThemedText>
          <ThemedText type="bodyMuted">Picks lock when you tap Save.</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Can I edit my picks?</ThemedText>
          <ThemedText type="bodyMuted">Yes. Tap Edit to unlock and update, then Save again.</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">What is the tie-breaker?</ThemedText>
          <ThemedText type="bodyMuted">
            The first goal minute (1-120) breaks ties on the leaderboard.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Why do I see sample matches?</ThemedText>
          <ThemedText type="bodyMuted">
            If live fixtures are unavailable, the app shows sample matches instead.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">How often do scores update?</ThemedText>
          <ThemedText type="bodyMuted">Live scores refresh automatically every 30 seconds.</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Why is my leaderboard empty?</ThemedText>
          <ThemedText type="bodyMuted">
            Save your picks first. The leaderboard updates after a round is saved.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Can I share my picks?</ThemedText>
          <ThemedText type="bodyMuted">Yes, use Share to post your weekly picks.</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Where do I change my email or password?</ThemedText>
          <ThemedText type="bodyMuted">Go to More → Account to update your details.</ThemedText>
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
