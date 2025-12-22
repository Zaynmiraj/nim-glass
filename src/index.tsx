/**
 * nim-glass
 * 
 * React Native glass/blur effects and inset shadows
 * that actually work on Android and iOS.
 * 
 * @packageDocumentation
 */

// Components
export { GlassView } from './GlassView';
export { InsetShadow } from './InsetShadow';
export { GlassCard } from './GlassCard';

// Types
export type {
  GlassViewProps,
  InsetShadowProps,
  InsetShadowOffset,
  GlassCardProps,
  BlurIntensity,
  GlassTint,
  GlassCardVariant,
  NativeBlurModule,
} from './types';

// Default export for convenience
import { GlassView } from './GlassView';
export default GlassView;
