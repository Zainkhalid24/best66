import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { clearAppData } from '@/data/best6-store';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LogoutScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();
  const { signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    setBusy(true);
    try {
      await clearAppData();
      await signOut();
      router.replace('/login');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackButton />
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.divider }]}>
          <ThemedText type="title">{t('logout')}</ThemedText>
          <ThemedText type="bodyMuted">{t('logoutIntro')}</ThemedText>
        </View>
        <Pressable
          onPress={handleLogout}
          disabled={busy}
          style={[styles.primaryButton, { backgroundColor: palette.danger }]}>
          <ThemedText type="button" style={{ color: palette.buttonText }}>
            {busy ? t('logoutBusy') : t('logout')}
          </ThemedText>
        </Pressable>
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
    gap: 6,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
});


