/**
 * Crop Test Screen
 * Screen to test all 19 crops with comprehensive data
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import SimpleCropTest from '../components/SimpleCropTest';

const CropTestScreen = () => {
  return (
    <View style={styles.container}>
      <SimpleCropTest />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default CropTestScreen;




