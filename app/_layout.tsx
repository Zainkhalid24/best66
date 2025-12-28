import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { Caveat_700Bold } from '@expo-google-fonts/caveat';
import 'react-native-reanimated';

import { Best6Logo } from '@/components/best6-logo';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { LanguageProvider } from '@/context/language-context';
import { bootstrapSync } from '@/data/supabase-sync';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    Caveat_700Bold,
  });
  const [splashDone, setSplashDone] = useState(false);
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const palette = useMemo(() => Colors[colorScheme ?? 'light'], [colorScheme]);

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }
    SplashScreen.hideAsync().catch(() => undefined);
    Animated.timing(splashOpacity, {
      toValue: 0,
      duration: 420,
      useNativeDriver: true,
    }).start(() => setSplashDone(true));
  }, [fontsLoaded, splashOpacity]);

  useEffect(() => {
    bootstrapSync().catch(() => undefined);
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthGate>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack>
          </AuthGate>
          {!splashDone && (
            <Animated.View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFillObject,
                styles.splash,
                { backgroundColor: palette.background, opacity: splashOpacity },
              ]}>
              <View style={styles.splashInner}>
                <Best6Logo size={92} />
                <ThemedText type="title" style={styles.splashTitle}>
                  Best6
                </ThemedText>
                <ThemedText type="bodyMuted">Predict. Play. Rise.</ThemedText>
              </View>
            </Animated.View>
          )}
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    const inAuthGroup = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return <>{children}</>;
}

const styles = StyleSheet.create({
  splash: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashInner: {
    alignItems: 'center',
    gap: 12,
  },
  splashTitle: {
    marginTop: 6,
  },
});
