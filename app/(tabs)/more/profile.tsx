import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Best6Logo } from '@/components/best6-logo';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { loadProfileName } from '@/data/best6-store';
import { supabase } from '@/lib/supabase';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const [profileName, setProfileName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    loadProfileName()
      .then((name) => setProfileName(name))
      .catch(() => undefined);
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setEmail(data.user.email);
      }
    });
  }, []);

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackButton />
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.divider }]}>
          <Best6Logo size={64} />
          <ThemedText type="title">Your Profile</ThemedText>
          <ThemedText type="bodyMuted">Manage your identity and competition stats.</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Name</ThemedText>
          <ThemedText type="bodyMuted">{profileName || 'Not set'}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Email</ThemedText>
          <ThemedText type="bodyMuted">{email || 'Not available'}</ThemedText>
        </View>
        <View style={[styles.statRow, { borderColor: palette.divider }]}>
          <View style={styles.stat}>
            <ThemedText type="subtitle">24</ThemedText>
            <ThemedText type="caption" style={{ color: palette.textMuted }}>
              Rounds played
            </ThemedText>
          </View>
          <View style={styles.stat}>
            <ThemedText type="subtitle">128</ThemedText>
            <ThemedText type="caption" style={{ color: palette.textMuted }}>
              Total points
            </ThemedText>
          </View>
          <View style={styles.stat}>
            <ThemedText type="subtitle">6</ThemedText>
            <ThemedText type="caption" style={{ color: palette.textMuted }}>
              Leagues
            </ThemedText>
          </View>
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
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  item: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
});
