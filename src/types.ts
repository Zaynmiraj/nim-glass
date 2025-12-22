import { ViewStyle } from 'react-native';

/**
 * Blur intensity presets
 */
export type BlurIntensity = 'light' | 'medium' | 'heavy' | 'ultra' | number;

/**
 * Glass tint color presets
 */
export type GlassTint = 'light' | 'dark' | 'extraLight' | 'chromeMaterial' | 'custom';

/**
 * Props for GlassView component
 */
export interface GlassViewProps {
  /**
   * Blur intensity - preset string or number 1-100
   * @default 'medium'
   */
  blurIntensity?: BlurIntensity;

  /**
   * Tint color preset or custom color
   * @default 'light'
   */
  tint?: GlassTint;

  /**
   * Custom tint color (used when tint='custom')
   * @default 'rgba(255, 255, 255, 0.1)'
   */
  tintColor?: string;

  /**
   * Opacity of the tint overlay (0-1)
   * @default 0.1
   */
  tintOpacity?: number;

  /**
   * Border radius of the glass view
   * @default 16
   */
  borderRadius?: number;

  /**
   * Border width
   * @default 1
   */
  borderWidth?: number;

  /**
   * Border color
   * @default 'rgba(255, 255, 255, 0.2)'
   */
  borderColor?: string;

  /**
   * Enable gradient border effect
   * @default false
   */
  gradientBorder?: boolean;

  /**
   * Gradient border colors (requires gradientBorder=true)
   */
  gradientBorderColors?: string[];

  /**
   * Container style
   */
  style?: ViewStyle;

  /**
   * Children elements
   */
  children?: React.ReactNode;
}

/**
 * Inset shadow offset configuration
 */
export interface InsetShadowOffset {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

/**
 * Props for InsetShadow component
 */
export interface InsetShadowProps {
  /**
   * Shadow color
   * @default 'rgba(0, 0, 0, 0.3)'
   */
  shadowColor?: string;

  /**
   * Shadow offset for each side
   * @default { top: 4, left: 4, right: 0, bottom: 0 }
   */
  shadowOffset?: InsetShadowOffset;

  /**
   * Shadow blur radius
   * @default 8
   */
  shadowBlur?: number;

  /**
   * Shadow spread amount
   * @default 0
   */
  shadowSpread?: number;

  /**
   * Border radius (to match container)
   * @default 16
   */
  borderRadius?: number;

  /**
   * Container style
   */
  style?: ViewStyle;

  /**
   * Children elements
   */
  children?: React.ReactNode;
}

/**
 * GlassCard variant presets
 */
export type GlassCardVariant = 'light' | 'dark' | 'frosted' | 'neon';

/**
 * Props for GlassCard component
 */
export interface GlassCardProps {
  /**
   * Pre-configured variant style
   * @default 'light'
   */
  variant?: GlassCardVariant;

  /**
   * Elevation level (1-5) - affects blur and shadow intensity
   * @default 2
   */
  elevation?: 1 | 2 | 3 | 4 | 5;

  /**
   * Enable inset shadow effect
   * @default true
   */
  showInsetShadow?: boolean;

  /**
   * Custom blur intensity (overrides variant)
   */
  blurIntensity?: BlurIntensity;

  /**
   * Border radius
   * @default 20
   */
  borderRadius?: number;

  /**
   * Padding inside the card
   * @default 16
   */
  padding?: number;

  /**
   * Container style
   */
  style?: ViewStyle;

  /**
   * Children elements
   */
  children?: React.ReactNode;
}

/**
 * Native blur module interface
 */
export interface NativeBlurModule {
  setBlurRadius: (viewTag: number, radius: number) => void;
  setTintColor: (viewTag: number, color: string) => void;
}
