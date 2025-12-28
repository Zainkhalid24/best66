import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HelpScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackButton />
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.divider }]}>
          <ThemedText type="title">Help</ThemedText>
          <ThemedText type="bodyMuted">Quick tips to get the most from Best6.</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Make predictions</ThemedText>
          <ThemedText type="bodyMuted">Pick scores before kickoff to earn points.</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Save your picks</ThemedText>
          <ThemedText type="bodyMuted">Tap Save to lock your picks and update your points.</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Scoring rules</ThemedText>
          <ThemedText type="bodyMuted">
            Exact score = 5 points. Correct outcome (win/draw) = 2 points.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Tie-breaker</ThemedText>
          <ThemedText type="bodyMuted">
            Choose the first goal minute (1-120). This helps break ties on the leaderboard.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Leaderboards</ThemedText>
          <ThemedText type="bodyMuted">
            Your total points and weekly form update after you save picks.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Fixtures & updates</ThemedText>
          <ThemedText type="bodyMuted">
            Live scores refresh automatically. If fixtures are missing, sample matches show up.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Sharing</ThemedText>
          <ThemedText type="bodyMuted">
            Use Share to post your weekly picks and invite friends to compete.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Account & profile</ThemedText>
          <ThemedText type="bodyMuted">
            Update your email or password in Account. Your name and email appear in Profile.
          </ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Need more help?</ThemedText>
          <ThemedText type="bodyMuted">
            Check FAQ or Support in the More tab for common questions and direct help.
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
