import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Best6Logo } from '@/components/best6-logo';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { saveProfileName } from '@/data/best6-store';
import { syncProfile } from '@/data/supabase-sync';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SignupScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Fill in all fields.');
      return;
    }
    await saveProfileName(name.trim());
    try {
      await signUp(email.trim(), password);
      await syncProfile();
    } catch (err: any) {
      setError(err?.message ?? 'Sign up failed.');
    }
  };

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: palette.surface }]}>
          <View style={[styles.halo, { backgroundColor: palette.surfaceAlt }]} />
          <Best6Logo size={72} />
          <ThemedText type="title" style={styles.title}>
            Join Best6
          </ThemedText>
          <ThemedText type="bodyMuted">Create an account to enter competitions.</ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <ThemedText type="label" style={{ color: palette.textMuted }}>
              Name
            </ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={palette.textMuted}
              style={[styles.input, { borderColor: palette.divider, color: palette.text }]}
            />
          </View>
          <View style={styles.field}>
            <ThemedText type="label" style={{ color: palette.textMuted }}>
              Email
            </ThemedText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              placeholderTextColor={palette.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, { borderColor: palette.divider, color: palette.text }]}
            />
          </View>
          <View style={styles.field}>
            <ThemedText type="label" style={{ color: palette.textMuted }}>
              Password
            </ThemedText>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor={palette.textMuted}
              secureTextEntry
              style={[styles.input, { borderColor: palette.divider, color: palette.text }]}
            />
          </View>

          <Pressable
            onPress={handleSignup}
            style={[styles.primaryButton, { backgroundColor: palette.tint }]}>
            <ThemedText type="button" style={{ color: palette.surface }}>
              Create account
            </ThemedText>
          </Pressable>
          {error ? (
            <ThemedText type="caption" style={{ color: palette.danger }}>
              {error}
            </ThemedText>
          ) : null}

          <ThemedText type="caption" style={{ color: palette.textMuted, textAlign: 'center' }}>
            By continuing, you agree to the Best6 terms and privacy policy.
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <ThemedText type="bodyMuted">Already have an account?</ThemedText>
          <Link href="/login">
            <ThemedText type="link">Sign in</ThemedText>
          </Link>
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
    gap: 20,
  },
  hero: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    gap: 10,
    overflow: 'hidden',
  },
  halo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    top: -80,
    right: -80,
    opacity: 0.8,
  },
  title: {
    marginTop: 6,
  },
  form: {
    gap: 14,
  },
  field: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 6,
  },
  footer: {
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
});
