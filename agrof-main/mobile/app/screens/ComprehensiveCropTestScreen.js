/**
 * Comprehensive Crop Test Screen
 * Screen to test all 19 crops with market data and budget calculations
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import ComprehensiveCropTestComponent from '../components/ComprehensiveCropTestComponent';

const ComprehensiveCropTestScreen = () => {
  return (
    <View style={styles.container}>
      <ComprehensiveCropTestComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default ComprehensiveCropTestScreen;




