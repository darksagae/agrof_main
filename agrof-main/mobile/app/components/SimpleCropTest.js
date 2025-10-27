/**
 * Simple Crop Test Component
 * Basic component to verify all 19 crops are loaded and visible
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ComprehensiveCropDatabase from '../services/comprehensiveCropDatabase';

const SimpleCropTest = () => {
  const [allCrops, setAllCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = () => {
    try {
      const crops = ComprehensiveCropDatabase.getAllCrops();
      setAllCrops(crops);
      console.log(`✅ Loaded ${crops.length} crops`);
    } catch (error) {
      console.error('❌ Failed to load crops:', error);
      Alert.alert('Error', 'Failed to load crops');
    }
  };

  const selectCrop = (crop) => {
    setSelectedCrop(crop);
    Alert.alert(
      'Crop Selected', 
      `${crop.name}\nCategory: ${crop.category}\nROI: ${crop.roi_percentage.min}-${crop.roi_percentage.max}%`
    );
  };

  const verifyAllCrops = () => {
    const expectedCount = 19;
    const actualCount = allCrops.length;
    
    if (actualCount === expectedCount) {
      Alert.alert(
        '✅ Success!', 
        `All ${expectedCount} crops are loaded!\n\nYou can see all crops in the grid below.`
      );
    } else {
      Alert.alert(
        '⚠️ Issue Found', 
        `Expected: ${expectedCount} crops\nActual: ${actualCount} crops\n\nSome crops may be missing.`
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="agriculture" size={24} color="#4CAF50" />
        <Text style={styles.title}>🌾 Simple Crop Test (All 19 Crops)</Text>
      </View>

      {/* Status */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Crop Loading Status</Text>
        <Text style={styles.statusText}>
          ✅ Crops Loaded: {allCrops.length}/19
        </Text>
        <Text style={styles.statusText}>
          ✅ Status: {allCrops.length === 19 ? 'Complete' : 'Incomplete'}
        </Text>
      </View>

      {/* Verify Button */}
      <TouchableOpacity
        style={styles.verifyButton}
        onPress={verifyAllCrops}
      >
        <MaterialIcons name="check-circle" size={20} color="white" />
        <Text style={styles.verifyButtonText}>Verify All 19 Crops</Text>
      </TouchableOpacity>

      {/* All Crops Grid */}
      <View style={styles.cropsCard}>
        <Text style={styles.cropsTitle}>
          All {allCrops.length} Crops Available (Scroll to see all)
        </Text>
        <View style={styles.cropsGrid}>
          {allCrops.map((crop, index) => (
            <TouchableOpacity
              key={crop.name}
              style={[
                styles.cropCard,
                selectedCrop?.name === crop.name && styles.selectedCropCard
              ]}
              onPress={() => selectCrop(crop)}
            >
              <Text style={styles.cropNumber}>{index + 1}</Text>
              <Text style={styles.cropName}>{crop.name}</Text>
              <Text style={styles.cropCategory}>{crop.category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Selected Crop Info */}
      {selectedCrop && (
        <View style={styles.selectedCard}>
          <Text style={styles.selectedTitle}>Selected: {selectedCrop.name}</Text>
          <Text style={styles.selectedText}>Category: {selectedCrop.category}</Text>
          <Text style={styles.selectedText}>ROI: {selectedCrop.roi_percentage.min}-{selectedCrop.roi_percentage.max}%</Text>
          <Text style={styles.selectedText}>Export: {selectedCrop.export_potential}</Text>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>📋 Instructions</Text>
        <Text style={styles.instructionsText}>
          • Scroll down to see all crops
        </Text>
        <Text style={styles.instructionsText}>
          • Tap any crop to select it
        </Text>
        <Text style={styles.instructionsText}>
          • Tap "Verify All 19 Crops" to check completeness
        </Text>
        <Text style={styles.instructionsText}>
          • You should see 19 crops total
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5530',
    marginLeft: 8,
    flex: 1,
  },
  statusCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cropsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  cropsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 12,
  },
  cropsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cropCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    width: '48%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  selectedCropCard: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  cropNumber: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cropName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c5530',
    textAlign: 'center',
  },
  cropCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  selectedCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  selectedText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  instructionsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default SimpleCropTest;






