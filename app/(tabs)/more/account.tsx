import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/context/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';

export default function AccountScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();
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
      setEmailError(t('accountValidEmailError'));
      return;
    }
    const { error: updateError } = await supabase.auth.updateUser({ email: email.trim() });
    if (updateError) {
      setEmailError(updateError.message);
      return;
    }
    setEmailNotice(t('accountEmailUpdateRequested'));
  };

  const handleChangePassword = async () => {
    setError('');
    setNotice('');
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError(t('accountFillAllFields'));
      return;
    }
    if (newPassword.length < 6) {
      setError(t('accountPasswordMin'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('accountPasswordMismatch'));
      return;
    }
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setNotice(t('accountPasswordUpdated'));
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackButton />
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.divider }]}>
          <ThemedText type="title">{t('account')}</ThemedText>
          <ThemedText type="bodyMuted">{t('accountIntro')}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('accountEmailLabel')}</ThemedText>
          <ThemedText type="bodyMuted">{email}</ThemedText>
        </View>
        <View style={[styles.item, { borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('accountPasswordLabel')}</ThemedText>
          <ThemedText type="bodyMuted">{t('accountLastUpdated')}</ThemedText>
        </View>
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('accountChangeEmail')}</ThemedText>
          <View style={styles.field}>
            <ThemedText type="label" style={{ color: palette.textMuted }}>
              {t('accountEmailLabel')}
            </ThemedText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder={t('accountEmailPlaceholder')}
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
            <ThemedText type="button">{t('accountUpdateEmail')}</ThemedText>
          </Pressable>
        </View>
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.divider }]}>
          <ThemedText type="subtitle">{t('accountChangePassword')}</ThemedText>
          <View style={styles.field}>
            <ThemedText type="label" style={{ color: palette.textMuted }}>
              {t('accountCurrentPassword')}
            </ThemedText>
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder={t('accountCurrentPasswordPlaceholder')}
              placeholderTextColor={palette.textMuted}
              style={[styles.input, { borderColor: palette.divider, color: palette.text }]}
            />
          </View>
          <View style={styles.field}>
            <ThemedText type="label" style={{ color: palette.textMuted }}>
              {t('accountNewPassword')}
            </ThemedText>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder={t('accountNewPasswordPlaceholder')}
              placeholderTextColor={palette.textMuted}
              style={[styles.input, { borderColor: palette.divider, color: palette.text }]}
            />
          </View>
          <View style={styles.field}>
            <ThemedText type="label" style={{ color: palette.textMuted }}>
              {t('accountConfirmNewPassword')}
            </ThemedText>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder={t('accountConfirmPasswordPlaceholder')}
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
            <ThemedText type="button" style={{ color: palette.buttonText }}>
              {t('accountUpdatePassword')}
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
    paddingBottom: 120,
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


