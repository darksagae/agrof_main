/**
 * Quick Crop Test Component
 * Standalone component to quickly test all 19 crops
 * Can be easily imported and used anywhere
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ComprehensiveCropDatabase from '../services/comprehensiveCropDatabase';

const QuickCropTest = () => {
  const [allCrops, setAllCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showCropDetails, setShowCropDetails] = useState(false);

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
      Alert.alert('Error', 'Failed to load crops from database');
    }
  };

  const selectCrop = (crop) => {
    setSelectedCrop(crop);
    setShowCropDetails(true);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="agriculture" size={24} color="#4CAF50" />
        <Text style={styles.title}>🌾 Quick Crop Test (All 19 Crops)</Text>
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
        <ScrollView style={styles.cropsScrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.cropsGrid}>
            {allCrops.map((crop, index) => renderCropCard(crop, index))}
          </View>
        </ScrollView>
      </View>

      {/* Crop Details Modal */}
      <Modal
        visible={showCropDetails}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🌾 {selectedCrop?.name} Details</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCropDetails(false)}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {selectedCrop && (
              <ScrollView style={styles.detailsContent}>
                <Text style={styles.detailsText}>
                  <Text style={styles.detailsLabel}>Category:</Text> {selectedCrop.category}
                </Text>
                <Text style={styles.detailsText}>
                  <Text style={styles.detailsLabel}>Duration:</Text> {selectedCrop.duration_days || selectedCrop.duration_months}
                </Text>
                <Text style={styles.detailsText}>
                  <Text style={styles.detailsLabel}>Planting Seasons:</Text> {selectedCrop.planting_seasons?.join(', ')}
                </Text>
                <Text style={styles.detailsText}>
                  <Text style={styles.detailsLabel}>Expected Yield:</Text> {selectedCrop.expected_yield_bags || selectedCrop.expected_yield_tons || selectedCrop.expected_yield_kg}
                </Text>
                <Text style={styles.detailsText}>
                  <Text style={styles.detailsLabel}>Market Price:</Text> UGX {selectedCrop.market_price_min || selectedCrop.market_price_per_bag?.min || 'N/A'}
                </Text>
                <Text style={styles.detailsText}>
                  <Text style={styles.detailsLabel}>ROI Range:</Text> {selectedCrop.roi_percentage.min}-{selectedCrop.roi_percentage.max}%
                </Text>
                <Text style={styles.detailsText}>
                  <Text style={styles.detailsLabel}>Export Potential:</Text> {selectedCrop.export_potential}
                </Text>
                <Text style={styles.detailsText}>
                  <Text style={styles.detailsLabel}>Regional Suitability:</Text> {selectedCrop.regional_suitability?.join(', ')}
                </Text>
                <Text style={styles.detailsText}>
                  <Text style={styles.detailsLabel}>Soil Requirements:</Text> {selectedCrop.soil_requirements}
                </Text>
                <Text style={styles.detailsText}>
                  <Text style={styles.detailsLabel}>Water Requirements:</Text> {selectedCrop.water_requirements}
                </Text>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
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
    flex: 1,
  },
  cropsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 12,
  },
  cropsScrollView: {
    flex: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5530',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  detailsContent: {
    padding: 16,
  },
  detailsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailsLabel: {
    fontWeight: 'bold',
    color: '#2c5530',
  },
});

export default QuickCropTest;
