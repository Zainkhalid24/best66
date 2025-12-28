import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { BackButton } from '@/components/back-button';
import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: palette.surfaceAlt, dark: palette.surfaceAlt }}
      headerImage={
        <IconSymbol
          size={280}
          color={palette.textMuted}
          name="sparkles"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <BackButton />
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <ThemedText type="bodyMuted">
        Dive into the UI layers and see how the layouts, animations, and tabs are composed.
      </ThemedText>
      <Collapsible title="Layouts and navigation">
        <ThemedText>
          Tabs are wired in <ThemedText type="subtitle">app/(tabs)/_layout.tsx</ThemedText> and
          root-level screens live under <ThemedText type="subtitle">app/</ThemedText>.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Multi-platform delivery">
        <ThemedText>
          This project ships to Android, iOS, and web with a single codebase.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Visual assets">
        <ThemedText>
          Use multiple densities for crisp icons and splash art across devices.
        </ThemedText>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Color themes">
        <ThemedText>
          The theme palette adapts to the active scheme while keeping the brand accents intact.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
