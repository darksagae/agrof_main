/**
 * Crop Test App
 * Standalone app to test all 19 crops
 * Run this file to see all crops
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import QuickCropTest from './components/QuickCropTest';

export default function CropTestApp() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <QuickCropTest />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});



