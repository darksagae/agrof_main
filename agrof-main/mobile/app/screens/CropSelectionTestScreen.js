import React from 'react';
import { View, StyleSheet } from 'react-native';
import CropSelectionTest from '../components/CropSelectionTest';

const CropSelectionTestScreen = () => {
  return (
    <View style={styles.container}>
      <CropSelectionTest />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default CropSelectionTestScreen;













