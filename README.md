# nim-glass 🔮

A customizable React Native package for **glass/blur effects** and **inset shadows** that actually work on both iOS and Android.

[![npm version](https://badge.fury.io/js/nim-glass.svg)](https://badge.fury.io/js/nim-glass)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Why nim-glass?

Existing blur libraries (`expo-blur`, `@react-native-community/blur`) have well-known issues:
- ❌ Android blur often doesn't work or is slow
- ❌ Limited customization options
- ❌ No inset shadow support
- ❌ Complex setup requirements

**nim-glass solves these problems:**
- ✅ Native Android blur using **RenderEffect** (Android 12+) with fallbacks
- ✅ Native iOS blur using **UIVisualEffectView**
- ✅ **Inset shadow** component (missing from React Native)
- ✅ Highly customizable glass effects
- ✅ Simple CLI for easy installation

---

## Installation

```bash
# npm
npm install nim-glass

# yarn
yarn add nim-glass

# pnpm
pnpm add nim-glass
```

### iOS Setup

```bash
cd ios && pod install
```

### Android Setup

No additional setup required! Auto-linking handles everything for React Native 0.60+.

---

## Quick Start

```tsx
import { GlassView, GlassCard, InsetShadow } from 'nim-glass';

// Simple glass blur effect
<GlassView blurIntensity="medium" tint="light" borderRadius={20}>
  <Text style={{ color: 'white' }}>Blurred content</Text>
</GlassView>

// Pre-styled glass card
<GlassCard variant="dark" elevation={3}>
  <Text style={{ color: 'white' }}>Glass card content</Text>
</GlassCard>

// Inset shadow effect
<InsetShadow shadowColor="rgba(0,0,0,0.5)" shadowBlur={10}>
  <View style={{ padding: 20 }}>
    <Text>Content with inset shadow</Text>
  </View>
</InsetShadow>
```

---

## Components

### GlassView

The core blur/glass effect component.

```tsx
<GlassView
  blurIntensity="medium"    // 'light' | 'medium' | 'heavy' | 'ultra' | number (1-100)
  tint="light"              // 'light' | 'dark' | 'extraLight' | 'chromeMaterial' | 'custom'
  tintColor="rgba(255,255,255,0.2)"  // Custom tint color (when tint='custom')
  tintOpacity={0.1}         // Tint overlay opacity (0-1)
  borderRadius={16}         // Corner radius
  borderWidth={1}           // Border width
  borderColor="rgba(255,255,255,0.2)"  // Border color
>
  {children}
</GlassView>
```

### GlassCard

Pre-styled glass card with variants and elevation levels.

```tsx
<GlassCard
  variant="light"           // 'light' | 'dark' | 'frosted' | 'neon'
  elevation={2}             // 1 | 2 | 3 | 4 | 5 (affects blur/shadow intensity)
  showInsetShadow={true}    // Enable inset shadow effect
  borderRadius={20}         // Corner radius
  padding={16}              // Inner padding
>
  {children}
</GlassCard>
```

#### Variants

| Variant | Description |
|---------|-------------|
| `light` | Light glass with white tint |
| `dark` | Dark glass with black tint |
| `frosted` | Subtle frosted glass effect |
| `neon` | Purple/violet neon glass |

### InsetShadow

Simulates inset shadows (not natively supported by React Native).

```tsx
<InsetShadow
  shadowColor="rgba(0,0,0,0.3)"   // Shadow color
  shadowOffset={{ top: 4, left: 4, right: 0, bottom: 0 }}  // Shadow offset per side
  shadowBlur={8}                   // Blur radius
  shadowSpread={0}                 // Spread amount
  borderRadius={16}                // Match container radius
>
  {children}
</InsetShadow>
```

---

## CLI Commands

```bash
# Initialize nim-glass in your project
npx nim-glass init

# Check installation status
npx nim-glass doctor

# Link native modules (for React Native < 0.60)
npx nim-glass link
```

---

## Platform Support

| Feature | iOS | Android 12+ | Android < 12 |
|---------|-----|-------------|--------------|
| Blur Effect | ✅ | ✅ (RenderEffect) | ✅ (RenderScript) |
| Tint Overlay | ✅ | ✅ | ✅ |
| Inset Shadow | ✅ | ✅ | ✅ |
| Hardware Acceleration | ✅ | ✅ | ⚠️ Software |

---

## TypeScript

Full TypeScript support included:

```tsx
import { 
  GlassView, 
  GlassCard, 
  InsetShadow,
  GlassViewProps,
  GlassCardProps,
  InsetShadowProps,
  BlurIntensity,
  GlassCardVariant
} from 'nim-glass';
```

---

## Examples

### Glassmorphism Card

```tsx
<View style={{ backgroundColor: '#1a1a2e', flex: 1 }}>
  <Image source={backgroundImage} style={StyleSheet.absoluteFill} />
  
  <GlassCard variant="light" elevation={3} style={{ margin: 20 }}>
    <Text style={{ color: 'white', fontSize: 24 }}>
      Premium Glass Card
    </Text>
    <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
      Beautiful blur effect that works everywhere
    </Text>
  </GlassCard>
</View>
```

### Dark Theme Tab Bar

```tsx
<GlassView
  blurIntensity="heavy"
  tint="dark"
  tintColor="rgba(0, 0, 0, 0.5)"
  borderRadius={30}
  style={{ 
    position: 'absolute', 
    bottom: 20, 
    left: 20, 
    right: 20,
    height: 80 
  }}
>
  {/* Tab bar content */}
</GlassView>
```

### Inset Button

```tsx
<InsetShadow
  shadowColor="rgba(0,0,0,0.4)"
  shadowOffset={{ top: 3, left: 3, right: 0, bottom: 0 }}
  shadowBlur={6}
  borderRadius={12}
>
  <TouchableOpacity style={{ padding: 16, alignItems: 'center' }}>
    <Text>Pressed Button Effect</Text>
  </TouchableOpacity>
</InsetShadow>
```

---

## License

MIT © [ZaYn Miraj](https://www.zaynmiraj.com)

---

## Author

**ZaYn Miraj**  
📧 [zayn.miraj@gmail.com](mailto:zayn.miraj@gmail.com)  
🌐 [zaynmiraj.com](https://www.zaynmiraj.com)

---

## Contributing

Contributions are welcome! Please read our contributing guide for details.
