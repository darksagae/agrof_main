/**
 * Crop Calendar Debug Component
 * Simple test to verify crops are loading correctly
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

const CropCalendarDebug = () => {
  const [allCrops, setAllCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading crops from database...');
      
      const crops = ComprehensiveCropDatabase.getAllCrops();
      setAllCrops(crops);
      
      console.log(`✅ Loaded ${crops.length} crops`);
      console.log('Crop names:', crops.map(c => c.name));
      
      setLoading(false);
    } catch (error) {
      console.error('❌ Error loading crops:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const testDatabase = () => {
    try {
      const stats = ComprehensiveCropDatabase.getDatabaseStats();
      Alert.alert(
        'Database Stats',
        `Total Crops: ${stats.total_crops}\nCategories: ${stats.categories.length}\nHigh ROI: ${stats.high_roi_crops}\nExport: ${stats.export_crops}`
      );
    } catch (error) {
      Alert.alert('Database Error', error.message);
    }
  };

  const renderCropCard = (crop, index) => (
    <TouchableOpacity
      key={crop.name}
      style={styles.cropCard}
      onPress={() => Alert.alert('Selected', crop.name)}
    >
      <Text style={styles.cropNumber}>{index + 1}</Text>
      <Text style={styles.cropName}>{crop.name}</Text>
      <Text style={styles.cropCategory}>{crop.category}</Text>
      <Text style={styles.cropROI}>ROI: {crop.roi_percentage.min}-{crop.roi_percentage.max}%</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialIcons name="agriculture" size={24} color="#4CAF50" />
          <Text style={styles.title}>🌾 Crop Calendar Debug</Text>
        </View>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>Loading crops...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialIcons name="agriculture" size={24} color="#4CAF50" />
          <Text style={styles.title}>🌾 Crop Calendar Debug</Text>
        </View>
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadCrops}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="agriculture" size={24} color="#4CAF50" />
        <Text style={styles.title}>🌾 Crop Calendar Debug</Text>
      </View>

      {/* Status */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Crop Loading Status</Text>
        <Text style={styles.statusText}>
          ✅ Crops Loaded: {allCrops.length}
        </Text>
        <Text style={styles.statusText}>
          ✅ Status: {allCrops.length === 19 ? 'Complete' : 'Incomplete'}
        </Text>
        <Text style={styles.statusText}>
          ✅ Database: {error ? 'Error' : 'Working'}
        </Text>
      </View>

      {/* Test Button */}
      <TouchableOpacity
        style={styles.testButton}
        onPress={testDatabase}
      >
        <MaterialIcons name="analytics" size={20} color="white" />
        <Text style={styles.testButtonText}>Test Database</Text>
      </TouchableOpacity>

      {/* All Crops Grid */}
      <View style={styles.cropsCard}>
        <Text style={styles.cropsTitle}>
          All {allCrops.length} Crops Available
        </Text>
        <View style={styles.cropsGrid}>
          {allCrops.map((crop, index) => renderCropCard(crop, index))}
        </View>
      </View>

      {/* Debug Info */}
      <View style={styles.debugCard}>
        <Text style={styles.debugTitle}>Debug Information</Text>
        <Text style={styles.debugText}>
          Database Path: ../services/comprehensiveCropDatabase
        </Text>
        <Text style={styles.debugText}>
          Import Status: {ComprehensiveCropDatabase ? 'Success' : 'Failed'}
        </Text>
        <Text style={styles.debugText}>
          Crops Array Length: {allCrops.length}
        </Text>
        <Text style={styles.debugText}>
          First Crop: {allCrops[0]?.name || 'None'}
        </Text>
        <Text style={styles.debugText}>
          Last Crop: {allCrops[allCrops.length - 1]?.name || 'None'}
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
  loadingCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorCard: {
    backgroundColor: '#ffebee',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  testButtonText: {
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
  debugCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 12,
  },
  debugText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default CropCalendarDebug;













