/**
 * Comprehensive Crop Test Component
 * Test component for all 19 crops with extensive Uganda agricultural data
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import EnhancedMarketDataService from '../services/enhancedMarketDataService';
import ComprehensiveCropDatabase from '../services/comprehensiveCropDatabase';

const ComprehensiveCropTestComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState(null);
  const [allCrops, setAllCrops] = useState([]);
  const [testResults, setTestResults] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('Central');
  const [selectedDistrict, setSelectedDistrict] = useState('Kampala');

  const regions = ['Central', 'Eastern', 'Northern', 'Western', 'Southwestern'];
  const districts = {
    'Central': ['Kampala', 'Wakiso', 'Mukono', 'Luweero'],
    'Eastern': ['Jinja', 'Mbale', 'Soroti', 'Tororo'],
    'Northern': ['Gulu', 'Lira', 'Arua', 'Kitgum'],
    'Western': ['Mbarara', 'Fort Portal', 'Hoima', 'Masaka'],
    'Southwestern': ['Kabale', 'Kisoro', 'Rukungiri']
  };

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      setIsLoading(true);
      
      // Initialize enhanced market data service
      const result = await EnhancedMarketDataService.initialize();
      setServiceStatus(result);
      
      // Load all crops
      const crops = ComprehensiveCropDatabase.getAllCrops();
      setAllCrops(crops);
      
      console.log('✅ Services initialized with', crops.length, 'crops');
    } catch (error) {
      console.error('❌ Failed to initialize services:', error);
      Alert.alert('Error', 'Failed to initialize comprehensive crop services');
    } finally {
      setIsLoading(false);
    }
  };

  const runComprehensiveTest = async () => {
    try {
      setIsLoading(true);
      
      const testCases = [
        { crop: 'maize', region: 'Central', district: 'Kampala' },
        { crop: 'tomatoes', region: 'Eastern', district: 'Jinja' },
        { crop: 'beans', region: 'Northern', district: 'Gulu' },
        { crop: 'coffee', region: 'Western', district: 'Mbarara' },
        { crop: 'banana', region: 'Southwestern', district: 'Kabale' }
      ];

      const results = [];
      
      for (const testCase of testCases) {
        console.log(`🧪 Testing ${testCase.crop} in ${testCase.district}...`);
        
        const result = await EnhancedMarketDataService.getEnhancedPrice(
          testCase.crop,
          testCase.region,
          testCase.district
        );
        
        results.push({
          ...testCase,
          result: result
        });
      }

      setTestResults(results);
      console.log('✅ Comprehensive test completed:', results);
      
    } catch (error) {
      console.error('❌ Comprehensive test failed:', error);
      Alert.alert('Error', 'Comprehensive test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const testSelectedCrop = async () => {
    if (!selectedCrop) {
      Alert.alert('Error', 'Please select a crop first');
      return;
    }

    try {
      setIsLoading(true);
      
      const result = await EnhancedMarketDataService.getComprehensiveBudget(
        selectedCrop,
        2.5, // acres
        selectedRegion,
        selectedDistrict
      );
      
      console.log('💰 Budget test result:', result);
      Alert.alert(
        'Budget Test', 
        `${selectedCrop.toUpperCase()} budget for 2.5 acres: UGX ${result.totalInvestment.toLocaleString()}\nAccuracy: ${(result.accuracy * 100).toFixed(1)}%`
      );
      
    } catch (error) {
      console.error('❌ Budget test failed:', error);
      Alert.alert('Error', 'Budget test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getDatabaseStats = () => {
    const stats = ComprehensiveCropDatabase.getDatabaseStats();
    console.log('📊 Database statistics:', stats);
    Alert.alert(
      'Database Statistics', 
      `Total Crops: ${stats.total_crops}\nCategories: ${stats.categories.length}\nHigh ROI Crops: ${stats.high_roi_crops}\nExport Crops: ${stats.export_crops}`
    );
  };

  const getServiceStatus = () => {
    const status = EnhancedMarketDataService.getServiceStatus();
    console.log('📊 Service status:', status);
    Alert.alert(
      'Service Status', 
      `Initialized: ${status.initialized ? 'Yes' : 'No'}\nCrops Loaded: ${status.cropsLoaded}\nCache Size: ${status.marketDataCache}\nLast Update: ${status.lastUpdate ? 'Recent' : 'Never'}`
    );
  };

  const renderCropCard = (crop, index) => (
    <TouchableOpacity
      key={crop.name}
      style={[
        styles.cropCard,
        selectedCrop === crop.name.toLowerCase() && styles.selectedCropCard
      ]}
      onPress={() => setSelectedCrop(crop.name.toLowerCase())}
    >
      <Text style={styles.cropNumber}>{index + 1}</Text>
      <Text style={styles.cropName}>{crop.name}</Text>
      <Text style={styles.cropCategory}>{crop.category}</Text>
      <Text style={styles.cropROI}>ROI: {crop.roi_percentage.min}-{crop.roi_percentage.max}%</Text>
      <Text style={styles.cropExport}>Export: {crop.export_potential}</Text>
    </TouchableOpacity>
  );

  const renderTestResults = () => {
    if (!testResults) return null;

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>🧪 Comprehensive Test Results</Text>
        {testResults.map((test, index) => (
          <View key={index} style={styles.resultCard}>
            <Text style={styles.resultCrop}>{test.crop.toUpperCase()}</Text>
            <Text style={styles.resultLocation}>{test.district}, {test.region}</Text>
            <Text style={styles.resultPrice}>
              UGX {test.result.finalPrice.toLocaleString()}
            </Text>
            <Text style={styles.resultAccuracy}>
              Accuracy: {(test.result.accuracy * 100).toFixed(1)}%
            </Text>
            <Text style={styles.resultConfidence}>
              Confidence: {test.result.confidence}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="agriculture" size={24} color="#4CAF50" />
        <Text style={styles.title}>🌾 Comprehensive Crop Test (19 Crops)</Text>
      </View>

      {/* Service Status */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Service Status</Text>
        {serviceStatus ? (
          <View style={styles.statusContent}>
            <Text style={styles.statusText}>
              ✅ Crops Loaded: {serviceStatus.crops_loaded}/19
            </Text>
            <Text style={styles.statusText}>
              ✅ Market Sources: {serviceStatus.market_sources}
            </Text>
            <Text style={styles.statusText}>
              ✅ Service Status: {serviceStatus.success ? 'Active' : 'Inactive'}
            </Text>
            <Text style={styles.statusText}>
              ✅ All 19 Crops Available: {allCrops.length === 19 ? 'Yes' : 'No'}
            </Text>
          </View>
        ) : (
          <Text style={styles.statusText}>⏳ Initializing services...</Text>
        )}
      </View>

      {/* Crop Selection */}
      <View style={styles.selectionCard}>
        <Text style={styles.selectionTitle}>
          Select Crop for Testing ({allCrops.length} Crops Available)
        </Text>
        <ScrollView style={styles.cropScrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.cropGrid}>
            {allCrops.map((crop, index) => renderCropCard(crop, index))}
          </View>
        </ScrollView>
        {selectedCrop && (
          <Text style={styles.selectedCropText}>
            Selected: {selectedCrop.toUpperCase()}
          </Text>
        )}
      </View>

      {/* Region Selection */}
      <View style={styles.selectionCard}>
        <Text style={styles.selectionTitle}>Select Region & District</Text>
        <View style={styles.regionContainer}>
          <View style={styles.regionSelector}>
            <Text style={styles.regionLabel}>Region:</Text>
            <TouchableOpacity
              style={styles.regionButton}
              onPress={() => {
                const regionIndex = regions.indexOf(selectedRegion);
                const nextIndex = (regionIndex + 1) % regions.length;
                setSelectedRegion(regions[nextIndex]);
                setSelectedDistrict(districts[regions[nextIndex]][0]);
              }}
            >
              <Text style={styles.regionButtonText}>{selectedRegion}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.districtSelector}>
            <Text style={styles.districtLabel}>District:</Text>
            <TouchableOpacity
              style={styles.districtButton}
              onPress={() => {
                const districtList = districts[selectedRegion];
                const districtIndex = districtList.indexOf(selectedDistrict);
                const nextIndex = (districtIndex + 1) % districtList.length;
                setSelectedDistrict(districtList[nextIndex]);
              }}
            >
              <Text style={styles.districtButtonText}>{selectedDistrict}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Test Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.testButton, styles.primaryButton]}
          onPress={runComprehensiveTest}
          disabled={isLoading}
        >
          <MaterialIcons name="science" size={20} color="white" />
          <Text style={styles.buttonText}>Run Comprehensive Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, styles.secondaryButton]}
          onPress={testSelectedCrop}
          disabled={isLoading || !selectedCrop}
        >
          <MaterialIcons name="account-balance" size={20} color="white" />
          <Text style={styles.buttonText}>Test Selected Crop Budget</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, styles.tertiaryButton]}
          onPress={getDatabaseStats}
          disabled={isLoading}
        >
          <MaterialIcons name="storage" size={20} color="white" />
          <Text style={styles.buttonText}>Database Statistics</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, styles.quaternaryButton]}
          onPress={getServiceStatus}
          disabled={isLoading}
        >
          <MaterialIcons name="info" size={20} color="white" />
          <Text style={styles.buttonText}>Service Status</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <MaterialIcons name="hourglass-empty" size={24} color="#4CAF50" />
          <Text style={styles.loadingText}>Running comprehensive tests...</Text>
        </View>
      )}

      {/* Test Results */}
      {renderTestResults()}

      {/* Crop Categories */}
      <View style={styles.categoriesCard}>
        <Text style={styles.categoriesTitle}>📊 Crop Categories</Text>
        <Text style={styles.categoriesText}>
          • Cereals: Maize, Rice, Millet
        </Text>
        <Text style={styles.categoriesText}>
          • Vegetables: Tomatoes, Beans, Onions, Cabbage, Carrots, Spinach
        </Text>
        <Text style={styles.categoriesText}>
          • Fruits: Banana, Pineapple, Mangoes, Avocados, Oranges
        </Text>
        <Text style={styles.categoriesText}>
          • Cash Crops: Coffee, Cotton, Sugarcane, Groundnuts, Soybeans
        </Text>
      </View>

      {/* Implementation Status */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>🎯 Enhanced Batch 1 Implementation</Text>
        <Text style={styles.statusText}>
          ✅ All 19 crops with comprehensive data
        </Text>
        <Text style={styles.statusText}>
          ✅ Government data integration
        </Text>
        <Text style={styles.statusText}>
          ✅ Market research from multiple sources
        </Text>
        <Text style={styles.statusText}>
          ✅ Regional suitability mapping
        </Text>
        <Text style={styles.statusText}>
          ✅ Seasonal intelligence for all crops
        </Text>
        <Text style={styles.statusText}>
          ✅ ROI calculations and export potential
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
  statusContent: {
    marginTop: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  selectionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 12,
  },
  cropScrollView: {
    maxHeight: 300,
    marginBottom: 12,
  },
  cropGrid: {
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
  selectedCropCard: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
    borderWidth: 2,
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
  cropExport: {
    fontSize: 12,
    color: '#2196F3',
    marginTop: 2,
    textAlign: 'center',
  },
  selectedCropText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  regionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  regionSelector: {
    flex: 1,
    marginRight: 8,
  },
  regionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  regionButton: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  regionButtonText: {
    fontSize: 14,
    color: '#2c5530',
    textAlign: 'center',
  },
  districtSelector: {
    flex: 1,
    marginLeft: 8,
  },
  districtLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  districtButton: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  districtButtonText: {
    fontSize: 14,
    color: '#2c5530',
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#2196F3',
  },
  tertiaryButton: {
    backgroundColor: '#FF9800',
  },
  quaternaryButton: {
    backgroundColor: '#9C27B0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#4CAF50',
    marginLeft: 8,
  },
  resultsContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  resultCrop: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
  },
  resultLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  resultPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 8,
  },
  resultAccuracy: {
    fontSize: 14,
    color: '#2196F3',
    marginTop: 4,
  },
  resultConfidence: {
    fontSize: 14,
    color: '#FF9800',
    marginTop: 4,
  },
  categoriesCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 12,
  },
  categoriesText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default ComprehensiveCropTestComponent;
