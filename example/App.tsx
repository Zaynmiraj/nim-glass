/**
 * nim-glass Example App
 * 
 * Demonstrates all the glass effect components
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { GlassView, GlassCard, InsetShadow } from 'nim-glass';

const BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800';

export default function App() {
  return (
    <ImageBackground
      source={{ uri: BACKGROUND_IMAGE }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <Text style={styles.header}>nim-glass</Text>
          <Text style={styles.subtitle}>Glass Effects & Inset Shadows</Text>

          {/* GlassView Demo */}
          <Text style={styles.sectionTitle}>GlassView</Text>
          
          <GlassView 
            blurIntensity="light" 
            tint="light"
            borderRadius={16}
            style={styles.demoCard}
          >
            <Text style={styles.cardTitle}>Light Blur</Text>
            <Text style={styles.cardText}>blurIntensity="light"</Text>
          </GlassView>

          <GlassView 
            blurIntensity="medium" 
            tint="light"
            borderRadius={16}
            style={styles.demoCard}
          >
            <Text style={styles.cardTitle}>Medium Blur</Text>
            <Text style={styles.cardText}>blurIntensity="medium"</Text>
          </GlassView>

          <GlassView 
            blurIntensity="heavy" 
            tint="dark"
            borderRadius={16}
            style={styles.demoCard}
          >
            <Text style={styles.cardTitle}>Heavy + Dark Tint</Text>
            <Text style={styles.cardText}>blurIntensity="heavy" tint="dark"</Text>
          </GlassView>

          {/* GlassCard Demo */}
          <Text style={styles.sectionTitle}>GlassCard</Text>

          <GlassCard variant="light" elevation={2} style={styles.demoCard}>
            <Text style={styles.cardTitle}>Light Variant</Text>
            <Text style={styles.cardText}>variant="light" elevation={2}</Text>
          </GlassCard>

          <GlassCard variant="dark" elevation={3} style={styles.demoCard}>
            <Text style={styles.cardTitleDark}>Dark Variant</Text>
            <Text style={styles.cardTextDark}>variant="dark" elevation={3}</Text>
          </GlassCard>

          <GlassCard variant="frosted" elevation={4} style={styles.demoCard}>
            <Text style={styles.cardTitle}>Frosted Variant</Text>
            <Text style={styles.cardText}>variant="frosted" elevation={4}</Text>
          </GlassCard>

          <GlassCard variant="neon" elevation={5} style={styles.demoCard}>
            <Text style={styles.cardTitleNeon}>Neon Variant</Text>
            <Text style={styles.cardTextNeon}>variant="neon" elevation={5}</Text>
          </GlassCard>

          {/* InsetShadow Demo */}
          <Text style={styles.sectionTitle}>InsetShadow</Text>

          <InsetShadow
            shadowColor="rgba(0, 0, 0, 0.5)"
            shadowBlur={10}
            shadowOffset={{ top: 5, left: 5, right: 0, bottom: 0 }}
            borderRadius={16}
            style={styles.insetDemo}
          >
            <View style={styles.insetContent}>
              <Text style={styles.insetTitle}>Inset Shadow</Text>
              <Text style={styles.insetText}>Creates a pressed/inset effect</Text>
            </View>
          </InsetShadow>

          <InsetShadow
            shadowColor="rgba(255, 255, 255, 0.3)"
            shadowBlur={8}
            shadowOffset={{ top: 4, left: 4, right: 4, bottom: 4 }}
            borderRadius={20}
            style={styles.insetDemo}
          >
            <View style={styles.insetContentLight}>
              <Text style={styles.insetTitleLight}>All Sides Shadow</Text>
              <Text style={styles.insetTextLight}>Inset from all directions</Text>
            </View>
          </InsetShadow>

          {/* Combined Demo */}
          <Text style={styles.sectionTitle}>Combined</Text>

          <GlassCard variant="dark" elevation={4}>
            <InsetShadow
              shadowColor="rgba(0
, 0, 0, 0.4)"
              shadowBlur={6}
              shadowOffset={{ top: 3, left: 3, right: 0, bottom: 0 }}
              borderRadius={16}
            >
              <View style={styles.combinedContent}>
                <Text style={styles.cardTitleDark}>GlassCard + InsetShadow</Text>
                <Text style={styles.cardTextDark}>
                  Combining glass blur with inset shadow
                </Text>
              </View>
            </InsetShadow>
          </GlassCard>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 30,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  demoCard: {
    marginBottom: 16,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  cardTitleDark: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  cardTextDark: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  cardTitleNeon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e0b0ff',
    marginBottom: 4,
  },
  cardTextNeon: {
    fontSize: 14,
    color: 'rgba(224, 176, 255, 0.8)',
  },
  insetDemo: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  insetContent: {
    padding: 20,
    backgroundColor: 'rgba(240, 240, 240, 0.95)',
    borderRadius: 16,
  },
  insetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  insetText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  insetContentLight: {
    padding: 20,
    backgroundColor: 'rgba(50, 50, 80, 0.95)',
    borderRadius: 20,
  },
  insetTitleLight: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  insetTextLight: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  combinedContent: {
    padding: 16,
  },
  bottomSpacing: {
    height: 50,
  },
});
