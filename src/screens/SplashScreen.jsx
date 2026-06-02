
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { NT } from '../constants/theme';

export function NurseSplash({ onDone }) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => onDone());
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Svg width="120" height="120" viewBox="0 0 100 100">
           <Rect width="100" height="100" rx="20" fill="#0F2219" stroke="#2DA44E" strokeWidth="2" />
           <Path d="M20 50 L35 50 L40 30 L45 70 L50 20 L55 50 L80 50" fill="none" stroke="#34C759" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <Text style={styles.title}>iTouch <Text style={{ color: NT.primary }}>Nurse</Text></Text>
        <Text style={styles.subtitle}>CLINICAL · IoMT</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2B1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 24,
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5E4B',
    letterSpacing: 4,
  },
});
