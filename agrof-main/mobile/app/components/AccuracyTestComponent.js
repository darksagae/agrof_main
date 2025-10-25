/**
 * Accuracy Test Component
 * Test component for batch 1 implementation
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
import EnhancedAccuracyService from '../services/enhancedAccuracyService';

const AccuracyTestComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [serviceStatus, setServiceStatus] = useState(null);

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      setIsLoading(true);
      const result = await EnhancedAccuracyService.initialize();
      setServiceStatus(result);
      console.log('✅ Services initialized:', result);
    } catch (error) {
      console.error('❌ Failed to initialize services:', error);
      Alert.alert('Error', 'Failed to initialize accuracy services');
    } finally {
      setIsLoading(false);
    }
  };

  const runAccuracyTest = async () => {
    try {
      setIsLoading(true);
      
      // Test different crops and regions
      const testCases = [
        { crop: 'maize', region: 'Central', district: 'Kampala' },
        { crop: 'tomatoes', region: 'Eastern', district: 'Jinja' },
        { crop: 'beans', region: 'Northern', district: 'Gulu' },
        { crop: 'coffee', region: 'Western', district: 'Mbarara' }
      ];

      const results = [];
      
      for (const testCase of testCases) {
        console.log(`🧪 Testing ${testCase.crop} in ${testCase.district}...`);
        
        const result = await EnhancedAccuracyService.calculateEnhancedPrice(
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
      console.log('✅ Accuracy test completed:', results);
      
    } catch (error) {
      console.error('❌ Accuracy test failed:', error);
      Alert.alert('Error', 'Accuracy test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const runBudgetTest = async () => {
    try {
      setIsLoading(true);
      
      const budgetResult = await EnhancedAccuracyService.getEnhancedBudget(
        'maize',
        2.5, // acres
        'Central',
        'Kampala'
      );
      
      console.log('💰 Budget test result:', budgetResult);
      Alert.alert('Budget Test', `Maize budget for 2.5 acres: UGX ${budgetResult.totalInvestment.toLocaleString()}`);
      
    } catch (error) {
      console.error('❌ Budget test failed:', error);
      Alert.alert('Error', 'Budget test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getAccuracyDashboard = () => {
    const dashboard = EnhancedAccuracyService.getAccuracyDashboard();
    console.log('📊 Accuracy dashboard:', dashboard);
    Alert.alert('Accuracy Dashboard', `Overall Accuracy: ${(dashboard.overallAccuracy * 100).toFixed(1)}%`);
  };

  const renderTestResults = () => {
    if (!testResults) return null;

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>🧪 Test Results</Text>
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
        <MaterialIcons name="analytics" size={24} color="#4CAF50" />
        <Text style={styles.title}>🎯 Accuracy Test Dashboard</Text>
      </View>

      {/* Service Status */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Service Status</Text>
        {serviceStatus ? (
          <View style={styles.statusContent}>
            <Text style={styles.statusText}>
              ✅ Market Service: {serviceStatus.services?.market?.status || 'Unknown'}
            </Text>
            <Text style={styles.statusText}>
              ✅ Regional Service: {serviceStatus.services?.regional || 'Unknown'}
            </Text>
            <Text style={styles.statusText}>
              ✅ Seasonal Service: {serviceStatus.services?.seasonal || 'Unknown'}
            </Text>
          </View>
        ) : (
          <Text style={styles.statusText}>⏳ Initializing services...</Text>
        )}
      </View>

      {/* Test Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.testButton, styles.primaryButton]}
          onPress={runAccuracyTest}
          disabled={isLoading}
        >
          <MaterialIcons name="science" size={20} color="white" />
          <Text style={styles.buttonText}>Run Accuracy Test</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, styles.secondaryButton]}
          onPress={runBudgetTest}
          disabled={isLoading}
        >
          <MaterialIcons name="account-balance" size={20} color="white" />
          <Text style={styles.buttonText}>Test Budget Calculation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, styles.tertiaryButton]}
          onPress={getAccuracyDashboard}
          disabled={isLoading}
        >
          <MaterialIcons name="dashboard" size={20} color="white" />
          <Text style={styles.buttonText}>View Accuracy Dashboard</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <MaterialIcons name="hourglass-empty" size={24} color="#4CAF50" />
          <Text style={styles.loadingText}>Running tests...</Text>
        </View>
      )}

      {/* Test Results */}
      {renderTestResults()}

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>📋 Batch 1 Implementation</Text>
        <Text style={styles.instructionsText}>
          • Real-time market data integration ✅
        </Text>
        <Text style={styles.instructionsText}>
          • Regional price variations ✅
        </Text>
        <Text style={styles.instructionsText}>
          • Seasonal adjustments ✅
        </Text>
        <Text style={styles.instructionsText}>
          • Enhanced accuracy calculations ✅
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c5530',
    marginLeft: 8,
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

export default AccuracyTestComponent;



