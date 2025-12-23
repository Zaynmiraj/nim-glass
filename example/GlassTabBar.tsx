/**
 * Premium Glass Tab Bar - nim-glass Example
 * 
 * Copy this to your project for a beautiful glassmorphism tab bar
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { GlassView } from 'nim-glass';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  Home,
  User,
  LayoutDashboard,
  Bookmark,
  FolderKanban,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Icon mapping for routes
const ICONS: Record<string, any> = {
  index: Home,
  home: Home,
  profile: User,
  projects: LayoutDashboard,
  carts: Bookmark,
  portfolio: FolderKanban,
};

// Theme colors
const THEME = {
  primary: '#81CC2A',
  primaryLight: 'rgba(129, 204, 42, 0.15)',
  textDark: '#1a1a1a',
  textMuted: '#666666',
  white: '#ffffff',
  glassBg: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.5)',
};

export function GlassTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {/* Outer glass layer - ULTRA DEEP blur */}
      <GlassView
        blurIntensity={100}
        tint="light"
        tintColor="rgba(255, 255, 255, 0.75)"
        tintOpacity={0.3}
        borderRadius={24}
        borderWidth={1}
        borderColor={THEME.glassBorder}
        style={styles.glassOuter}
      >
        {/* Inner content layer */}
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            // Get icon component
            const Icon = ICONS[route.name.toLowerCase()] || Home;

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabItem}
                activeOpacity={0.7}
              >
                {isFocused ? (
                  <View style={styles.activeTab}>
                    <View style={styles.activeIconBg}>
                      <Icon
                        size={22}
                        color={THEME.primary}
                        strokeWidth={2.5}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={styles.inactiveTab}>
                    <Icon
                      size={20}
                      color={THEME.textMuted}
                      strokeWidth={1.5}
                    />
                    <Text style={styles.tabLabel}>
                      {typeof label === 'string'
                        ? label.charAt(0).toUpperCase() + label.slice(1)
                        : route.name}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </GlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  glassOuter: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    // Outer shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  activeTab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconBg: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: THEME.white,
    alignItems: 'center',
    justifyContent: 'center',
    // Primary color glow
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    // Subtle border
    borderWidth: 1.5,
    borderColor: THEME.primary,
  },
  inactiveTab: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    opacity: 0.9,
  },
  tabLabel: {
    color: THEME.textMuted,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
    letterSpacing: 0.2,
  },
});

export default GlassTabBar;
