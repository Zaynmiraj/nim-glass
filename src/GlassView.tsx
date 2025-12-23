import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  requireNativeComponent,
  UIManager,
  ViewProps,
} from 'react-native';
import { GlassViewProps, BlurIntensity } from './types';

// Native component for blur (when available)
const NATIVE_COMPONENT_NAME = 'NimGlassBlurView';

// Check if native component is available
const isNativeBlurAvailable = 
  UIManager.getViewManagerConfig?.(NATIVE_COMPONENT_NAME) != null;

// Native blur view props
interface NativeBlurViewProps extends ViewProps {
  blurRadius: number;
  tintColor: string;
  tintOpacity: number;
  cornerRadius: number;
  downsampleFactor: number;
  showInsetShadow: boolean;
  insetShadowBlur: number;
}

// Native blur view component
const NativeBlurView = isNativeBlurAvailable
  ? requireNativeComponent<NativeBlurViewProps>(NATIVE_COMPONENT_NAME)
  : null;

/**
 * Convert blur intensity preset to numeric value
 */
const getBlurRadius = (intensity: BlurIntensity): number => {
  if (typeof intensity === 'number') {
    return Math.max(1, Math.min(100, intensity));
  }
  
  switch (intensity) {
    case 'light':
      return 10;
    case 'medium':
      return 25;
    case 'heavy':
      return 50;
    case 'ultra':
      return 80;
    default:
      return 25;
  }
};

/**
 * Get tint color from preset
 */
const getTintColor = (tint: string, customColor?: string): string => {
  switch (tint) {
    case 'light':
      return 'rgba(255, 255, 255, 0.2)';
    case 'dark':
      return 'rgba(0, 0, 0, 0.3)';
    case 'extraLight':
      return 'rgba(255, 255, 255, 0.4)';
    case 'chromeMaterial':
      return 'rgba(200, 200, 200, 0.25)';
    case 'custom':
      return customColor || 'rgba(255, 255, 255, 0.1)';
    default:
      return 'rgba(255, 255, 255, 0.2)';
  }
};

/**
 * GlassView - A customizable blur/glass effect component
 * 
 * Works on both iOS and Android with native blur implementations.
 * On Android, captures background content and applies real Gaussian blur.
 * 
 * @example
 * ```tsx
 * <GlassView blurIntensity="medium" tint="light" borderRadius={20}>
 *   <Text>Content on glass</Text>
 * </GlassView>
 * ```
 * 
 * @example
 * ```tsx
 * <GlassView 
 *   blurIntensity={50}
 *   tint="dark"
 *   downsampleFactor={2}
 *   showInsetShadow={true}
 * >
 *   <Text>High quality blur with inset shadow</Text>
 * </GlassView>
 * ```
 */
export const GlassView: React.FC<GlassViewProps> = ({
  blurIntensity = 'medium',
  tint = 'light',
  tintColor,
  tintOpacity = 0.15,
  borderRadius = 16,
  borderWidth = 1,
  borderColor = 'rgba(255, 255, 255, 0.2)',
  gradientBorder = false,
  downsampleFactor = 4,
  showInsetShadow = false,
  insetShadowBlur = 12,
  style,
  children,
}) => {
  const blurRadius = getBlurRadius(blurIntensity);
  const resolvedTintColor = getTintColor(tint, tintColor);
  
  // Container styles
  const containerStyle = StyleSheet.flatten([
    styles.container,
    {
      borderRadius,
      borderWidth: gradientBorder ? 0 : borderWidth,
      borderColor: gradientBorder ? 'transparent' : borderColor,
      overflow: 'hidden' as const,
    },
    style,
  ]);

  // Native blur available - use native component
  if (NativeBlurView && isNativeBlurAvailable) {
    return (
      <View style={containerStyle}>
        <NativeBlurView
          style={StyleSheet.absoluteFill}
          blurRadius={blurRadius}
          tintColor={resolvedTintColor}
          tintOpacity={tintOpacity}
          cornerRadius={borderRadius}
          downsampleFactor={downsampleFactor}
          showInsetShadow={showInsetShadow}
          insetShadowBlur={insetShadowBlur}
        />
        {/* Content */}
        <View style={styles.content}>{children}</View>
        {/* Border highlight */}
        <View
          style={[
            styles.borderHighlight,
            {
              borderRadius,
              borderWidth,
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
          ]}
          pointerEvents="none"
        />
      </View>
    );
  }

  // Fallback: Semi-transparent overlay simulation
  return (
    <View style={containerStyle}>
      {/* Background blur simulation */}
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.fallbackBlur,
          {
            backgroundColor: resolvedTintColor,
            opacity: 0.7 + (blurRadius / 100) * 0.3,
          },
        ]}
      />
      {/* Tint overlay */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: resolvedTintColor,
            opacity: tintOpacity,
          },
        ]}
      />
      {/* Inset shadow simulation */}
      {showInsetShadow && (
        <>
          <View style={[styles.insetTop, { height: insetShadowBlur }]} />
          <View style={[styles.insetLeft, { width: insetShadowBlur }]} />
        </>
      )}
      {/* Content */}
      <View style={styles.content}>{children}</View>
      {/* Border highlight */}
      <View
        style={[
          styles.borderHighlight,
          {
            borderRadius,
            borderWidth,
            borderColor: 'rgba(255, 255, 255, 0.15)',
          },
        ]}
        pointerEvents="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  fallbackBlur: {
    // Fallback styling when native blur unavailable
  },
  borderHighlight: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  insetTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  insetLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default GlassView;
