import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Image } from 'expo-image';
import { withLayoutContext } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';
import { useLanguage } from '@/context/language-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <MaterialTabs
      screenOptions={{
        tabBarPosition: 'bottom',
        swipeEnabled: true,
        animationEnabled: true,
        tabBarShowIcon: true,
        tabBarActiveTintColor: palette.tabIconSelected,
        tabBarInactiveTintColor: palette.tabIconDefault,
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: palette.tabBar,
          borderTopColor: palette.tabBarBorder,
          borderTopWidth: 1,
          height: 68 + insets.bottom,
          paddingBottom: Math.max(8, insets.bottom),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          letterSpacing: 0.4,
          fontFamily: Fonts.bodyMedium,
          textTransform: 'none',
        },
        tabBarIndicatorStyle: {
          backgroundColor: palette.tint,
          height: 3,
          borderRadius: 999,
        },
      }}>
      <MaterialTabs.Screen
        name="index"
        options={{
          title: t('play'),
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/play-tab-icon.png')}
              style={{ width: 36, height: 36, opacity: focused ? 1 : 0.6 }}
              contentFit="contain"
            />
          ),
        }}
      />
      <MaterialTabs.Screen
        name="leaderboard"
        options={{
          title: t('leaderboard'),
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="trophy.fill" color={color} />,
        }}
      />
      <MaterialTabs.Screen
        name="leagues"
        options={{
          title: t('leagues'),
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="person.3.fill" color={color} />,
        }}
      />
      <MaterialTabs.Screen
        name="more"
        options={{
          title: t('more'),
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="ellipsis.circle.fill" color={color} />,
        }}
      />
    </MaterialTabs>
  );
}
