import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Best6Logo } from '@/components/best6-logo';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/context/language-context';
import { loadProfileName } from '@/data/best6-store';
import { supabase } from '@/lib/supabase';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();
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
      const metadataName =
        (data.user?.user_metadata?.full_name as string | undefined) ??
        (data.user?.user_metadata?.name as string | undefined);
      if (metadataName && !profileName) {
        setProfileName(metadataName);
      }
    });
  }, [profileName]);

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackButton />
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.divider }]}>
          <Best6Logo size={64} />
          <ThemedText type="title">{t('profileTitle')}</ThemedText>
          <ThemedText type="bodyMuted">{t('profileIntro')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('profileNameLabel')}</ThemedText>
          <ThemedText type="bodyMuted">{profileName || t('profileNotSet')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('profileEmailLabel')}</ThemedText>
          <ThemedText type="bodyMuted">{email || t('profileNotAvailable')}</ThemedText>
        </View>
        <View style={[styles.statRow, { borderColor: palette.divider }]}>
          <View style={styles.stat}>
            <ThemedText type="subtitle">24</ThemedText>
            <ThemedText type="caption" style={{ color: palette.textMuted }}>
              {t('profileRoundsPlayed')}
            </ThemedText>
          </View>
          <View style={styles.stat}>
            <ThemedText type="subtitle">128</ThemedText>
            <ThemedText type="caption" style={{ color: palette.textMuted }}>
              {t('profileTotalPoints')}
            </ThemedText>
          </View>
          <View style={styles.stat}>
            <ThemedText type="subtitle">6</ThemedText>
            <ThemedText type="caption" style={{ color: palette.textMuted }}>
              {t('profileLeagues')}
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
    paddingBottom: 120,
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


