import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';

export default function AccountScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('you@email.com');
  const [emailNotice, setEmailNotice] = useState('');
  const [emailError, setEmailError] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setEmail(data.user.email);
      }
    });
  }, []);

  const handleChangeEmail = async () => {
    setEmailError('');
    setEmailNotice('');
    if (!email.trim() || !email.includes('@')) {
      setEmailError('Enter a valid email address.');
      return;
    }
    const { error: updateError } = await supabase.auth.updateUser({ email: email.trim() });
    if (updateError) {
      setEmailError(updateError.message);
      return;
    }
    setEmailNotice('Email update requested. Check your inbox to confirm.');
  };

  const handleChangePassword = async () => {
    setError('');
    setNotice('');
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('Fill in all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setNotice('Password updated.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackButton />
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.divider }]}>
          <ThemedText type="title">Account</ThemedText>
          <ThemedText type="bodyMuted">Update your email and password securely.</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Email</ThemedText>
          <ThemedText type="bodyMuted">{email}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Password</ThemedText>
          <ThemedText type="bodyMuted">Last updated 2 weeks ago</ThemedText>
        </View>
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Change email</ThemedText>
          <View style={styles.field}>
            <ThemedText type="label" style={{ color: palette.textMuted }}>
              Email
            </ThemedText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@email.com"
              placeholderTextColor={palette.textMuted}
              style={[styles.input, { borderColor: palette.divider, color: palette.text }]}
            />
          </View>
          {emailError ? (
            <ThemedText type="caption" style={{ color: palette.danger }}>
              {emailError}
            </ThemedText>
          ) : null}
          {emailNotice ? (
            <ThemedText type="caption" style={{ color: palette.textMuted }}>
              {emailNotice}
            </ThemedText>
          ) : null}
          <Pressable
            onPress={handleChangeEmail}
            style={[styles.primaryButton, { backgroundColor: palette.surfaceAlt }]}>
            <ThemedText type="button">Update email</ThemedText>
          </Pressable>
        </View>
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.divider }]}>
          <ThemedText type="subtitle">Change password</ThemedText>
          <View style={styles.field}>
            <ThemedText type="label" style={{ color: palette.textMuted }}>
              Current password
            </ThemedText>
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="Current password"
              placeholderTextColor={palette.textMuted}
              style={[styles.input, { borderColor: palette.divider, color: palette.text }]}
            />
          </View>
          <View style={styles.field}>
            <ThemedText type="label" style={{ color: palette.textMuted }}>
              New password
            </ThemedText>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="New password"
              placeholderTextColor={palette.textMuted}
              style={[styles.input, { borderColor: palette.divider, color: palette.text }]}
            />
          </View>
          <View style={styles.field}>
            <ThemedText type="label" style={{ color: palette.textMuted }}>
              Confirm new password
            </ThemedText>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Confirm new password"
              placeholderTextColor={palette.textMuted}
              style={[styles.input, { borderColor: palette.divider, color: palette.text }]}
            />
          </View>
          {error ? (
            <ThemedText type="caption" style={{ color: palette.danger }}>
              {error}
            </ThemedText>
          ) : null}
          {notice ? (
            <ThemedText type="caption" style={{ color: palette.textMuted }}>
              {notice}
            </ThemedText>
          ) : null}
          <Pressable
            onPress={handleChangePassword}
            style={[styles.primaryButton, { backgroundColor: palette.tint }]}>
            <ThemedText type="button" style={{ color: palette.surface }}>
              Update password
            </ThemedText>
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
  field: {
    gap: 8,
    marginTop: 8,
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
    marginTop: 8,
  },
});
