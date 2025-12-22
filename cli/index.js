#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const program = new Command();

// Package info
const packageJson = require('../package.json');

program
  .name('nim-glass')
  .description('CLI for nim-glass React Native blur/glass effects')
  .version(packageJson.version);

/**
 * Init command - Initialize nim-glass in a React Native project
 */
program
  .command('init')
  .description('Initialize nim-glass in your React Native project')
  .option('--skip-install', 'Skip npm installation')
  .action(async (options) => {
    console.log('\n🔮 Initializing nim-glass...\n');
    
    // Check if in a React Native project
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.error('❌ Error: package.json not found. Are you in a React Native project?');
      process.exit(1);
    }
    
    const projectPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const hasReactNative = projectPackageJson.dependencies?.['react-native'] || 
                           projectPackageJson.devDependencies?.['react-native'];
    
    if (!hasReactNative) {
      console.error('❌ Error: react-native not found in dependencies.');
      process.exit(1);
    }
    
    console.log('✓ React Native project detected');
    
    // Install the package if not skipped
    if (!options.skipInstall) {
      console.log('\n📦 Installing nim-glass...');
      try {
        execSync('npm install nim-glass', { stdio: 'inherit' });
        console.log('✓ Package installed');
      } catch (error) {
        console.log('⚠ Could not auto-install. Please run: npm install nim-glass');
      }
    }
    
    // Check for iOS
    const iosPath = path.join(process.cwd(), 'ios');
    if (fs.existsSync(iosPath)) {
      console.log('\n📱 iOS detected - Running pod install...');
      try {
        execSync('cd ios && pod install', { stdio: 'inherit' });
        console.log('✓ CocoaPods installed');
      } catch (error) {
        console.log('⚠ Could not run pod install. Please run: cd ios && pod install');
      }
    }
    
    console.log('\n✨ nim-glass initialized successfully!\n');
    console.log('Usage example:');
    console.log('─────────────────────────────────────');
    console.log(`
import { GlassView, GlassCard, InsetShadow } from 'nim-glass';

// Simple glass effect
<GlassView blurIntensity="medium" tint="light">
  <Text>Blur content</Text>
</GlassView>

// Pre-styled glass card
<GlassCard variant="dark" elevation={3}>
  <Text>Card content</Text>
</GlassCard>

// Inset shadow effect
<InsetShadow shadowColor="rgba(0,0,0,0.3)" shadowBlur={8}>
  <View>Content with inset shadow</View>
</InsetShadow>
`);
    console.log('─────────────────────────────────────\n');
  });

/**
 * Doctor command - Check installation status
 */
program
  .command('doctor')
  .description('Check nim-glass installation status')
  .action(() => {
    console.log('\n🔍 Checking nim-glass installation...\n');
    
    let allGood = true;
    
    // Check package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const projectPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const hasNimGlass = projectPackageJson.dependencies?.['nim-glass'];
      
      if (hasNimGlass) {
        console.log(`✓ nim-glass installed (${hasNimGlass})`);
      } else {
        console.log('✗ nim-glass not found in dependencies');
        allGood = false;
      }
    } else {
      console.log('✗ Not in a React Native project');
      allGood = false;
    }
    
    // Check iOS
    const iosPath = path.join(process.cwd(), 'ios');
    const podfilePath = path.join(iosPath, 'Podfile');
    if (fs.existsSync(iosPath)) {
      console.log('✓ iOS project detected');
      
      const podfileLockPath = path.join(iosPath, 'Podfile.lock');
      if (fs.existsSync(podfileLockPath)) {
        const podfileLock = fs.readFileSync(podfileLockPath, 'utf8');
        if (podfileLock.includes('NimGlass')) {
          console.log('✓ iOS native module installed');
        } else {
          console.log('⚠ iOS native module may not be installed. Run: cd ios && pod install');
        }
      }
    } else {
      console.log('ℹ No iOS project found');
    }
    
    // Check Android
    const androidPath = path.join(process.cwd(), 'android');
    if (fs.existsSync(androidPath)) {
      console.log('✓ Android project detected');
      console.log('✓ Android native module (auto-linked via RN 0.60+)');
    } else {
      console.log('ℹ No Android project found');
    }
    
    console.log('\n' + (allGood ? '✨ All checks passed!' : '⚠ Some issues detected') + '\n');
  });

/**
 * Link command (for RN < 0.60)
 */
program
  .command('link')
  .description('Link native modules (for React Native < 0.60)')
  .action(() => {
    console.log('\n🔗 Linking nim-glass native modules...\n');
    console.log('ℹ React Native 0.60+ uses auto-linking. This command is for older versions.\n');
    
    try {
      execSync('react-native link nim-glass', { stdio: 'inherit' });
      console.log('\n✓ Native modules linked successfully');
    } catch (error) {
      console.log('\n⚠ Could not link. If using RN 0.60+, linking is automatic.');
    }
  });

program.parse();
