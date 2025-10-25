/**
 * Crop Test Navigation Component
 * Simple navigation to access crop test screens
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SimpleCropTest from './SimpleCropTest';
import ComprehensiveCropTestComponent from './ComprehensiveCropTestComponent';
import CropVerificationComponent from './CropVerificationComponent';

const CropTestNavigation = () => {
  const [activeTest, setActiveTest] = useState(null);

  const openTest = (testType) => {
    setActiveTest(testType);
  };

  const closeTest = () => {
    setActiveTest(null);
  };

  const renderTestScreen = () => {
    switch (activeTest) {
      case 'simple':
        return <SimpleCropTest />;
      case 'comprehensive':
        return <ComprehensiveCropTestComponent />;
      case 'verification':
        return <CropVerificationComponent />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="agriculture" size={24} color="#4CAF50" />
        <Text style={styles.title}>🌾 Crop Test Navigation</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.testButton, styles.simpleButton]}
          onPress={() => openTest('simple')}
        >
          <MaterialIcons name="list" size={24} color="white" />
          <Text style={styles.buttonText}>Simple Crop Test</Text>
          <Text style={styles.buttonSubtext}>View all 19 crops</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, styles.comprehensiveButton]}
          onPress={() => openTest('comprehensive')}
        >
          <MaterialIcons name="analytics" size={24} color="white" />
          <Text style={styles.buttonText}>Comprehensive Test</Text>
          <Text style={styles.buttonSubtext}>Market data & budgets</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, styles.verificationButton]}
          onPress={() => openTest('verification')}
        >
          <MaterialIcons name="verified" size={24} color="white" />
          <Text style={styles.buttonText}>Crop Verification</Text>
          <Text style={styles.buttonSubtext}>Verify all crops loaded</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📋 Available Tests</Text>
        <Text style={styles.infoText}>
          • Simple Crop Test: Basic view of all 19 crops
        </Text>
        <Text style={styles.infoText}>
          • Comprehensive Test: Full market data and budget calculations
        </Text>
        <Text style={styles.infoText}>
          • Crop Verification: Verify all crops are loaded correctly
        </Text>
      </View>

      {/* Modal for test screens */}
      <Modal
        visible={activeTest !== null}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeTest}
            >
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {activeTest === 'simple' && 'Simple Crop Test'}
              {activeTest === 'comprehensive' && 'Comprehensive Crop Test'}
              {activeTest === 'verification' && 'Crop Verification'}
            </Text>
          </View>
          {renderTestScreen()}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c5530',
    marginLeft: 8,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  simpleButton: {
    backgroundColor: '#4CAF50',
  },
  comprehensiveButton: {
    backgroundColor: '#2196F3',
  },
  verificationButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1,
  },
  buttonSubtext: {
    color: 'white',
    fontSize: 14,
    marginLeft: 12,
    opacity: 0.8,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 8,
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5530',
    flex: 1,
  },
});

export default CropTestNavigation;




