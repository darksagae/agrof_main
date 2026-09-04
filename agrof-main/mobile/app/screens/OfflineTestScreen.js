/**
 * Offline Test Screen - Quick Demo
 * Tests offline functionality without modifying existing code
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Import our new services
import networkManager from '../services/networkManager';
import offlineProductService from '../services/offlineProductService';
import hybridStoreApi from '../services/hybridStoreApi';
import offlineChatbotService from '../services/offlineChatbotService';
import offlineCartService from '../services/offlineCartService';

const OfflineTestScreen = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize on mount
    initializeServices();
  }, []);

  const initializeServices = async () => {
    setLoading(true);
    const testResults = {};

    try {
      // Test 1: Network Manager
      await networkManager.initialize();
      const networkStatus = networkManager.getStatus();
      testResults.network = {
        status: '✅ Working',
        details: `${networkStatus.isOnline ? '🟢 Online' : '🔴 Offline'} - ${networkStatus.connectionType}`
      };
    } catch (error) {
      testResults.network = { status: '❌ Failed', details: error.message };
    }

    try {
      // Test 2: Offline Products
      const productStats = await offlineProductService.getStats();
      testResults.products = {
        status: '✅ Working',
        details: `${productStats.totalProducts} products available offline`
      };
    } catch (error) {
      testResults.products = { status: '❌ Failed', details: error.message };
    }

    try {
      // Test 3: Offline Chatbot
      const chatStats = offlineChatbotService.getStats();
      testResults.chatbot = {
        status: '✅ Working',
        details: `${chatStats.totalEntries} Q&As available offline`
      };
    } catch (error) {
      testResults.chatbot = { status: '❌ Failed', details: error.message };
    }

    try {
      // Test 4: Offline Cart
      const cartStats = await offlineCartService.getStats();
      testResults.cart = {
        status: '✅ Working',
        details: `${cartStats.cartItems} items in cart`
      };
    } catch (error) {
      testResults.cart = { status: '❌ Failed', details: error.message };
    }

    setResults(testResults);
    setLoading(false);
  };

  const testOfflineProducts = async () => {
    try {
      const products = await offlineProductService.getProducts({ limit: 5 });
      Alert.alert(
        'Offline Products Test',
        `✅ Found ${products.length} products!\n\nFirst product: ${products[0]?.name || 'N/A'}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const testOfflineChatbot = async () => {
    try {
      const response = await offlineChatbotService.sendMessage('yellow leaves tomato');
      Alert.alert(
        'Offline Chatbot Test',
        `✅ Response:\n\n${response.message.substring(0, 200)}...`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const testHybridAPI = async () => {
    try {
      const result = await hybridStoreApi.getProducts({ limit: 3 });
      Alert.alert(
        'Hybrid API Test',
        `✅ Source: ${result.source}\n✅ Products: ${result.data.length}\n✅ Data used: ${result.dataUsed || 0} KB`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const testOfflineCart = async () => {
    try {
      // Add a test product
      await offlineCartService.addItem({
        id: 'test_123',
        name: 'Test Product',
        selling_price: 50000,
        category_name: 'test'
      }, 1);

      const summary = await offlineCartService.getSummary();
      Alert.alert(
        'Offline Cart Test',
        `✅ Cart working!\n\nItems: ${summary.itemCount}\nTotal: ${summary.totalFormatted}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="science" size={48} color="#22C55E" />
        <Text style={styles.title}>Offline System Test</Text>
        <Text style={styles.subtitle}>Test your offline-first features</Text>
      </View>

      {loading ? (
        <Text style={styles.loading}>Initializing services...</Text>
      ) : (
        <>
          {/* Service Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Status</Text>
            {Object.entries(results).map(([key, value]) => (
              <View key={key} style={styles.statusCard}>
                <Text style={styles.statusTitle}>{key.toUpperCase()}</Text>
                <Text style={styles.statusValue}>{value.status}</Text>
                <Text style={styles.statusDetails}>{value.details}</Text>
              </View>
            ))}
          </View>

          {/* Test Buttons */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Tests</Text>

            <TouchableOpacity style={styles.button} onPress={testOfflineProducts}>
              <MaterialIcons name="shopping-bag" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Test Offline Products</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={testOfflineChatbot}>
              <MaterialIcons name="chat" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Test Offline Chatbot</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={testHybridAPI}>
              <MaterialIcons name="swap-horiz" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Test Hybrid API</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={testOfflineCart}>
              <MaterialIcons name="shopping-cart" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Test Offline Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.refreshButton]} 
              onPress={initializeServices}
            >
              <MaterialIcons name="refresh" size={24} color="#FFFFFF" />
              <Text style={styles.buttonText}>Refresh Tests</Text>
            </TouchableOpacity>
          </View>

          {/* Instructions */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📱 How to Test:</Text>
            <Text style={styles.infoText}>
              1. ✅ Services initialized automatically{'\n'}
              2. 🔘 Tap test buttons to verify features{'\n'}
              3. ✈️ Turn on Airplane Mode to test offline{'\n'}
              4. 📶 Turn on WiFi only to test WiFi mode{'\n'}
              5. 📱 Turn on mobile data to test data-saver mode
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  loading: {
    textAlign: 'center',
    padding: 24,
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statusDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  button: {
    backgroundColor: '#22C55E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  refreshButton: {
    backgroundColor: '#3B82F6',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
});

export default OfflineTestScreen;



