import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';

type Best6LogoProps = {
  size?: number;
};

export function Best6Logo({ size = 64 }: Best6LogoProps) {
  const theme = useColorScheme() ?? 'light';
  const palette = Colors[theme];

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: palette.surfaceAlt,
          borderColor: palette.divider,
        },
      ]}>
      <View style={[styles.dot, { backgroundColor: palette.tint }]} />
      <ThemedText type="subtitle" style={{ color: palette.text }}>
        B6
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    top: 10,
    right: 12,
  },
});


