/**
 * Crop Verification Component
 * Simple component to verify all 19 crops are loaded and accessible
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

const CropVerificationComponent = () => {
  const [allCrops, setAllCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [cropDetails, setCropDetails] = useState(null);

  useEffect(() => {
    loadAllCrops();
  }, []);

  const loadAllCrops = () => {
    try {
      const crops = ComprehensiveCropDatabase.getAllCrops();
      setAllCrops(crops);
      console.log(`✅ Loaded ${crops.length} crops from database`);
    } catch (error) {
      console.error('❌ Failed to load crops:', error);
      Alert.alert('Error', 'Failed to load crops from database');
    }
  };

  const selectCrop = (crop) => {
    setSelectedCrop(crop);
    setCropDetails(crop);
    console.log(`Selected crop: ${crop.name}`);
  };

  const verifyAllCrops = () => {
    const expectedCrops = [
      'Maize', 'Tomatoes', 'Beans', 'Coffee', 'Banana', 'Onions', 
      'Groundnuts', 'Rice', 'Cotton', 'Sugarcane', 'Pineapple', 
      'Mangoes', 'Avocados', 'Carrots', 'Spinach', 'Millet', 
      'Soybeans', 'Cabbage', 'Oranges'
    ];
    
    const loadedCropNames = allCrops.map(crop => crop.name);
    const missingCrops = expectedCrops.filter(crop => !loadedCropNames.includes(crop));
    
    if (missingCrops.length === 0) {
      Alert.alert(
        '✅ Verification Complete', 
        `All 19 crops are loaded successfully!\n\nTotal crops: ${allCrops.length}\nMissing crops: 0`
      );
    } else {
      Alert.alert(
        '⚠️ Verification Failed', 
        `Missing crops: ${missingCrops.length}\n\nMissing: ${missingCrops.join(', ')}\n\nLoaded: ${allCrops.length}`
      );
    }
  };

  const getCropStats = () => {
    const stats = ComprehensiveCropDatabase.getDatabaseStats();
    Alert.alert(
      '📊 Database Statistics',
      `Total Crops: ${stats.total_crops}\nCategories: ${stats.categories.length}\nHigh ROI Crops: ${stats.high_roi_crops}\nExport Crops: ${stats.export_crops}\nRegions: ${stats.regions_covered}\nMarket Sources: ${stats.market_sources}`
    );
  };

  const renderCropCard = (crop, index) => (
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
      <Text style={styles.cropROI}>ROI: {crop.roi_percentage.min}-{crop.roi_percentage.max}%</Text>
    </TouchableOpacity>
  );

  const renderCropDetails = () => {
    if (!cropDetails) return null;

    return (
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>🌾 {cropDetails.name} Details</Text>
        <Text style={styles.detailsText}>
          <Text style={styles.detailsLabel}>Category:</Text> {cropDetails.category}
        </Text>
        <Text style={styles.detailsText}>
          <Text style={styles.detailsLabel}>Duration:</Text> {cropDetails.duration_days || cropDetails.duration_months}
        </Text>
        <Text style={styles.detailsText}>
          <Text style={styles.detailsLabel}>Planting Seasons:</Text> {cropDetails.planting_seasons?.join(', ')}
        </Text>
        <Text style={styles.detailsText}>
          <Text style={styles.detailsLabel}>Expected Yield:</Text> {cropDetails.expected_yield_bags || cropDetails.expected_yield_tons || cropDetails.expected_yield_kg}
        </Text>
        <Text style={styles.detailsText}>
          <Text style={styles.detailsLabel}>Market Price:</Text> UGX {cropDetails.market_price_min || cropDetails.market_price_per_bag?.min || 'N/A'}
        </Text>
        <Text style={styles.detailsText}>
          <Text style={styles.detailsLabel}>ROI Range:</Text> {cropDetails.roi_percentage.min}-{cropDetails.roi_percentage.max}%
        </Text>
        <Text style={styles.detailsText}>
          <Text style={styles.detailsLabel}>Export Potential:</Text> {cropDetails.export_potential}
        </Text>
        <Text style={styles.detailsText}>
          <Text style={styles.detailsLabel}>Regional Suitability:</Text> {cropDetails.regional_suitability?.join(', ')}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="verified" size={24} color="#4CAF50" />
        <Text style={styles.title}>🌾 Crop Verification (All 19 Crops)</Text>
      </View>

      {/* Status */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Crop Loading Status</Text>
        <Text style={styles.statusText}>
          ✅ Total Crops Loaded: {allCrops.length}/19
        </Text>
        <Text style={styles.statusText}>
          ✅ Database Status: {allCrops.length === 19 ? 'Complete' : 'Incomplete'}
        </Text>
        <Text style={styles.statusText}>
          ✅ All Crops Available: {allCrops.length === 19 ? 'Yes' : 'No'}
        </Text>
      </View>

      {/* Verification Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={verifyAllCrops}
        >
          <MaterialIcons name="check-circle" size={20} color="white" />
          <Text style={styles.buttonText}>Verify All 19 Crops</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={getCropStats}
        >
          <MaterialIcons name="analytics" size={20} color="white" />
          <Text style={styles.buttonText}>Database Statistics</Text>
        </TouchableOpacity>
      </View>

      {/* All Crops Grid */}
      <View style={styles.cropsCard}>
        <Text style={styles.cropsTitle}>All 19 Crops Available</Text>
        <View style={styles.cropsGrid}>
          {allCrops.map((crop, index) => renderCropCard(crop, index))}
        </View>
      </View>

      {/* Selected Crop Details */}
      {renderCropDetails()}

      {/* Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>📊 Summary</Text>
        <Text style={styles.summaryText}>
          • Total Crops: {allCrops.length}/19
        </Text>
        <Text style={styles.summaryText}>
          • Categories: {[...new Set(allCrops.map(c => c.category))].length}
        </Text>
        <Text style={styles.summaryText}>
          • High ROI Crops: {allCrops.filter(c => c.roi_percentage.min >= 300).length}
        </Text>
        <Text style={styles.summaryText}>
          • Export Crops: {allCrops.filter(c => c.export_potential === 'High' || c.export_potential === 'Very High').length}
        </Text>
        <Text style={styles.summaryText}>
          • Status: {allCrops.length === 19 ? '✅ Complete' : '⚠️ Incomplete'}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
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
  cropROI: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  detailsLabel: {
    fontWeight: 'bold',
    color: '#2c5530',
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default CropVerificationComponent;
