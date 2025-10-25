/**
 * Crop Database Test Component
 * Simple test to verify the comprehensive crop database is working
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

const CropDatabaseTest = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    testDatabase();
  }, []);

  const testDatabase = async () => {
    try {
      setLoading(true);
      console.log('🔄 Testing comprehensive crop database...');
      
      // Test database methods
      const allCrops = ComprehensiveCropDatabase.getAllCrops();
      const stats = ComprehensiveCropDatabase.getDatabaseStats();
      const categories = ComprehensiveCropDatabase.getCategories();
      const highROI = ComprehensiveCropDatabase.getHighROICrops();
      
      setCrops(allCrops);
      
      console.log('✅ Database test results:');
      console.log(`- Total crops: ${allCrops.length}`);
      console.log(`- Categories: ${categories.length}`);
      console.log(`- High ROI crops: ${highROI.length}`);
      console.log('Crop names:', allCrops.map(c => c.name));
      
      setLoading(false);
    } catch (error) {
      console.error('❌ Database test failed:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const showCropDetails = (crop) => {
    Alert.alert(
      crop.name,
      `Category: ${crop.category}\nROI: ${crop.roi_percentage.min}-${crop.roi_percentage.max}%\nDuration: ${crop.duration_days || crop.duration_months || 'N/A'} days\nMarket Price: ${crop.market_price_min ? crop.market_price_min + '-' + crop.market_price_max + ' UGX/kg' : 'N/A'}`
    );
  };

  const renderCropCard = (crop, index) => (
    <TouchableOpacity
      key={crop.name}
      style={styles.cropCard}
      onPress={() => showCropDetails(crop)}
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
          <Text style={styles.title}>🌾 Crop Database Test</Text>
        </View>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>Testing database...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialIcons name="agriculture" size={24} color="#4CAF50" />
          <Text style={styles.title}>🌾 Crop Database Test</Text>
        </View>
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={testDatabase}>
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
        <Text style={styles.title}>🌾 Crop Database Test</Text>
      </View>

      {/* Database Stats */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Database Statistics</Text>
        <Text style={styles.statsText}>
          ✅ Total Crops: {crops.length}
        </Text>
        <Text style={styles.statsText}>
          ✅ Status: {crops.length === 19 ? 'Complete' : 'Incomplete'}
        </Text>
        <Text style={styles.statsText}>
          ✅ Database: Working
        </Text>
      </View>

      {/* Test Button */}
      <TouchableOpacity
        style={styles.testButton}
        onPress={testDatabase}
      >
        <MaterialIcons name="refresh" size={20} color="white" />
        <Text style={styles.testButtonText}>Test Database Again</Text>
      </TouchableOpacity>

      {/* All Crops Grid */}
      <View style={styles.cropsCard}>
        <Text style={styles.cropsTitle}>
          All {crops.length} Crops from Database
        </Text>
        <View style={styles.cropsGrid}>
          {crops.map((crop, index) => renderCropCard(crop, index))}
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
          Crops Array Length: {crops.length}
        </Text>
        <Text style={styles.debugText}>
          First Crop: {crops[0]?.name || 'None'}
        </Text>
        <Text style={styles.debugText}>
          Last Crop: {crops[crops.length - 1]?.name || 'None'}
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
  statsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 8,
  },
  statsText: {
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

export default CropDatabaseTest;
