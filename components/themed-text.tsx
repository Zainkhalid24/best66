import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | 'display'
    | 'title'
    | 'subtitle'
    | 'label'
    | 'body'
    | 'bodyMuted'
    | 'caption'
    | 'link'
    | 'button';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'body',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const mutedColor = useThemeColor({ light: lightColor, dark: darkColor }, 'textMuted');
  const linkColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');

  return (
    <Text
      style={[
        { color },
        type === 'display' ? styles.display : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'label' ? styles.label : undefined,
        type === 'body' ? styles.body : undefined,
        type === 'bodyMuted' ? [styles.body, { color: mutedColor }] : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'link' ? [styles.link, { color: linkColor }] : undefined,
        type === 'button' ? styles.button : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  display: {
    fontSize: 36,
    lineHeight: 40,
    fontFamily: Fonts.heading,
  },
  title: {
    fontSize: 26,
    lineHeight: 30,
    fontFamily: Fonts.heading,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: Fonts.headingAlt,
  },
  label: {
    fontSize: 14,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    fontFamily: Fonts.bodyMedium,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: Fonts.body,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: Fonts.bodyMedium,
  },
  link: {
    fontSize: 16,
    lineHeight: 20,
    textDecorationLine: 'underline',
    fontFamily: Fonts.bodyMedium,
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: Fonts.headingAlt,
  },
});
