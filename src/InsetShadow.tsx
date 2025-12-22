import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { InsetShadowProps, InsetShadowOffset } from './types';

/**
 * Default shadow offset
 */
const defaultOffset: InsetShadowOffset = {
  top: 4,
  left: 4,
  right: 0,
  bottom: 0,
};

/**
 * InsetShadow - A component that renders inset shadows
 * 
 * React Native doesn't support inset shadows natively.
 * This component simulates inset shadows using multiple overlapping views
 * with gradients to create a convincing effect.
 * 
 * @example
 * ```tsx
 * <InsetShadow
 *   shadowColor="rgba(0, 0, 0, 0.5)"
 *   shadowBlur={10}
 *   shadowOffset={{ top: 5, left: 5 }}
 *   borderRadius={16}
 * >
 *   <View style={{ padding: 20 }}>
 *     <Text>Content with inset shadow</Text>
 *   </View>
 * </InsetShadow>
 * ```
 */
export const InsetShadow: React.FC<InsetShadowProps> = ({
  shadowColor = 'rgba(0, 0, 0, 0.3)',
  shadowOffset = defaultOffset,
  shadowBlur = 8,
  shadowSpread = 0,
  borderRadius = 16,
  style,
  children,
}) => {
  const offset = { ...defaultOffset, ...shadowOffset };
  
  // Calculate shadow layer styles
  const createShadowLayer = (
    side: 'top' | 'left' | 'right' | 'bottom',
    size: number
  ) => {
    if (size <= 0) return null;
    
    const blur = shadowBlur + shadowSpread;
    const baseStyle = {
      position: 'absolute' as const,
      backgroundColor: 'transparent',
    };
    
    switch (side) {
      case 'top':
        return {
          ...baseStyle,
          top: 0,
          left: 0,
          right: 0,
          height: size + blur,
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
          // Shadow gradient simulation
          shadowColor,
          shadowOffset: { width: 0, height: size },
          shadowOpacity: 0.5,
          shadowRadius: blur,
          elevation: size,
        };
      case 'bottom':
        return {
          ...baseStyle,
          bottom: 0,
          left: 0,
          right: 0,
          height: size + blur,
          borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
          shadowColor,
          shadowOffset: { width: 0, height: -size },
          shadowOpacity: 0.5,
          shadowRadius: blur,
          elevation: size,
        };
      case 'left':
        return {
          ...baseStyle,
          top: 0,
          left: 0,
          bottom: 0,
          width: size + blur,
          borderTopLeftRadius: borderRadius,
          borderBottomLeftRadius: borderRadius,
          shadowColor,
          shadowOffset: { width: size, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: blur,
          elevation: size,
        };
      case 'right':
        return {
          ...baseStyle,
          top: 0,
          right: 0,
          bottom: 0,
          width: size + blur,
          borderTopRightRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
          shadowColor,
          shadowOffset: { width: -size, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: blur,
          elevation: size,
        };
    }
  };

  // Create overlay gradients for inset effect
  const renderInsetOverlay = () => {
    const layers: React.ReactNode[] = [];
    
    // Top shadow
    if (offset.top && offset.top > 0) {
      layers.push(
        <View
          key="inset-top"
          style={[
            styles.insetLayer,
            {
              top: 0,
              left: 0,
              right: 0,
              height: offset.top + shadowBlur,
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
            },
          ]}
          pointerEvents="none"
        >
          <View
            style={[
              styles.gradientOverlay,
              {
                backgroundColor: shadowColor,
                opacity: 0.6,
                transform: [{ scaleY: 1.5 }],
              },
            ]}
          />
        </View>
      );
    }
    
    // Left shadow
    if (offset.left && offset.left > 0) {
      layers.push(
        <View
          key="inset-left"
          style={[
            styles.insetLayer,
            {
              top: 0,
              left: 0,
              bottom: 0,
              width: offset.left + shadowBlur,
              borderTopLeftRadius: borderRadius,
              borderBottomLeftRadius: borderRadius,
            },
          ]}
          pointerEvents="none"
        >
          <View
            style={[
              styles.gradientOverlay,
              {
                backgroundColor: shadowColor,
                opacity: 0.6,
                transform: [{ scaleX: 1.5 }],
              },
            ]}
          />
        </View>
      );
    }
    
    // Bottom shadow
    if (offset.bottom && offset.bottom > 0) {
      layers.push(
        <View
          key="inset-bottom"
          style={[
            styles.insetLayer,
            {
              bottom: 0,
              left: 0,
              right: 0,
              height: offset.bottom + shadowBlur,
              borderBottomLeftRadius: borderRadius,
              borderBottomRightRadius: borderRadius,
            },
          ]}
          pointerEvents="none"
        >
          <View
            style={[
              styles.gradientOverlay,
              {
                backgroundColor: shadowColor,
                opacity: 0.6,
                transform: [{ scaleY: 1.5 }],
              },
            ]}
          />
        </View>
      );
    }
    
    // Right shadow
    if (offset.right && offset.right > 0) {
      layers.push(
        <View
          key="inset-right"
          style={[
            styles.insetLayer,
            {
              top: 0,
              right: 0,
              bottom: 0,
              width: offset.right + shadowBlur,
              borderTopRightRadius: borderRadius,
              borderBottomRightRadius: borderRadius,
            },
          ]}
          pointerEvents="none"
        >
          <View
            style={[
              styles.gradientOverlay,
              {
                backgroundColor: shadowColor,
                opacity: 0.6,
                transform: [{ scaleX: 1.5 }],
              },
            ]}
          />
        </View>
      );
    }
    
    return layers;
  };

  return (
    <View style={[styles.container, { borderRadius }, style]}>
      {children}
      {renderInsetOverlay()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  insetLayer: {
    position: 'absolute',
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default InsetShadow;
