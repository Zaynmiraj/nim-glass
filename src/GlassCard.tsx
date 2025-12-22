import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { GlassCardProps, GlassCardVariant, BlurIntensity } from './types';
import { GlassView } from './GlassView';
import { InsetShadow } from './InsetShadow';

/**
 * Variant configurations
 */
const variantConfigs: Record<
  GlassCardVariant,
  {
    tint: 'light' | 'dark' | 'extraLight' | 'chromeMaterial' | 'custom';
    tintColor: string;
    borderColor: string;
    shadowColor: string;
  }
> = {
  light: {
    tint: 'custom',
    tintColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
  },
  dark: {
    tint: 'custom',
    tintColor: 'rgba(0, 0, 0, 0.4)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  frosted: {
    tint: 'custom',
    tintColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
  },
  neon: {
    tint: 'custom',
    tintColor: 'rgba(120, 0, 255, 0.2)',
    borderColor: 'rgba(180, 100, 255, 0.4)',
    shadowColor: 'rgba(120, 0, 255, 0.3)',
  },
};

/**
 * Elevation configurations
 */
const elevationConfigs: Record<
  1 | 2 | 3 | 4 | 5,
  { blur: BlurIntensity; shadowBlur: number; shadowOffset: number }
> = {
  1: { blur: 'light', shadowBlur: 4, shadowOffset: 2 },
  2: { blur: 'medium', shadowBlur: 8, shadowOffset: 4 },
  3: { blur: 'medium', shadowBlur: 12, shadowOffset: 6 },
  4: { blur: 'heavy', shadowBlur: 16, shadowOffset: 8 },
  5: { blur: 'ultra', shadowBlur: 24, shadowOffset: 12 },
};

/**
 * GlassCard - A pre-styled glass card component
 * 
 * Combines GlassView and InsetShadow for a complete glass card effect.
 * Choose from preset variants or customize individual properties.
 * 
 * @example
 * ```tsx
 * <GlassCard variant="dark" elevation={3}>
 *   <Text style={{ color: 'white' }}>Glass Card Content</Text>
 * </GlassCard>
 * ```
 * 
 * @example
 * ```tsx
 * <GlassCard
 *   variant="neon"
 *   elevation={4}
 *   borderRadius={24}
 *   showInsetShadow={true}
 * >
 *   <Text>Neon Glass Effect</Text>
 * </GlassCard>
 * ```
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'light',
  elevation = 2,
  showInsetShadow = true,
  blurIntensity,
  borderRadius = 20,
  padding = 16,
  style,
  children,
}) => {
  const variantConfig = variantConfigs[variant];
  const elevationConfig = elevationConfigs[elevation];
  
  // Resolve blur intensity (prop override or elevation default)
  const resolvedBlurIntensity = blurIntensity ?? elevationConfig.blur;
  
  // Build content with optional inset shadow
  const renderContent = () => {
    const contentStyle: ViewStyle = {
      padding,
    };
    
    if (showInsetShadow) {
      return (
        <InsetShadow
          shadowColor={variantConfig.shadowColor}
          shadowBlur={elevationConfig.shadowBlur}
          shadowOffset={{
            top: elevationConfig.shadowOffset,
            left: elevationConfig.shadowOffset,
            right: 0,
            bottom: 0,
          }}
          borderRadius={borderRadius}
        >
          <View style={contentStyle}>{children}</View>
        </InsetShadow>
      );
    }
    
    return <View style={contentStyle}>{children}</View>;
  };

  return (
    <GlassView
      blurIntensity={resolvedBlurIntensity}
      tint="custom"
      tintColor={variantConfig.tintColor}
      tintOpacity={0.15}
      borderRadius={borderRadius}
      borderColor={variantConfig.borderColor}
      borderWidth={1}
      style={StyleSheet.flatten([styles.card, style])}
    >
      {renderContent()}
    </GlassView>
  );
};

const styles = StyleSheet.create({
  card: {
    // Base card shadow (outer)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default GlassCard;
