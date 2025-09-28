import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, Alert, ActivityIndicator 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { testAllApiUrls, getCurrentApiUrl, resetApiUrl, setApiUrl } from '../services/storeApi';

const NetworkConfigScreen = ({ onBack }) => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [workingUrls, setWorkingUrls] = useState([]);
  const [testing, setTesting] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  useEffect(() => {
    loadNetworkInfo();
  }, []);

  const loadNetworkInfo = async () => {
    setCurrentUrl(getCurrentApiUrl());
    setTesting(true);
    try {
      const urls = await testAllApiUrls();
      setWorkingUrls(urls);
    } catch (error) {
      console.error('Failed to test URLs:', error);
    } finally {
      setTesting(false);
    }
  };

  const testCustomUrl = async () => {
    if (!customUrl.trim()) {
      Alert.alert('Error', 'Please enter a URL to test');
      return;
    }

    setTesting(true);
    try {
      const response = await fetch(`${customUrl}/health`, {
        method: 'GET',
        timeout: 5000,
      });
      
      if (response.ok) {
        Alert.alert('Success', 'Custom URL is working!', [
          { text: 'OK', onPress: () => setCustomUrl('') }
        ]);
      } else {
        Alert.alert('Error', `URL responded with status: ${response.status}`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to connect: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  const resetToPrimary = () => {
    resetApiUrl();
    setCurrentUrl(getCurrentApiUrl());
    Alert.alert('Success', 'API URL reset to primary');
  };

  const setToWorkingUrl = (url) => {
    setApiUrl(url);
    setCurrentUrl(getCurrentApiUrl());
    Alert.alert('Success', `API URL set to: ${url}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Network Configuration</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Current Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current API URL</Text>
          <View style={styles.urlContainer}>
            <Text style={styles.urlText}>{currentUrl}</Text>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={loadNetworkInfo}
              disabled={testing}
            >
              <MaterialIcons 
                name="refresh" 
                size={20} 
                color={testing ? "#ccc" : "#2196F3"} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Working URLs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Working URLs ({workingUrls.length})
          </Text>
          {testing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#2196F3" />
              <Text style={styles.loadingText}>Testing URLs...</Text>
            </View>
          ) : workingUrls.length > 0 ? (
            workingUrls.map((url, index) => (
              <View key={index} style={styles.urlItem}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.workingUrlText}>{url}</Text>
                <TouchableOpacity 
                  style={styles.setButton}
                  onPress={() => setToWorkingUrl(url)}
                >
                  <Text style={styles.setButtonText}>Use</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noUrlsText}>No working URLs found</Text>
          )}
        </View>

        {/* Custom URL Test */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Custom URL</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="http://192.168.0.105:3002/api"
              value={customUrl}
              onChangeText={setCustomUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity 
              style={styles.testButton}
              onPress={testCustomUrl}
              disabled={testing}
            >
              <MaterialIcons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={resetToPrimary}
          >
            <MaterialIcons name="restore" size={20} color="white" />
            <Text style={styles.actionButtonText}>Reset to Primary URL</Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Troubleshooting Tips:</Text>
          <Text style={styles.helpText}>
            • Make sure your backend server is running{'\n'}
            • Check if you're on the same network as the server{'\n'}
            • Try different IP addresses if the primary fails{'\n'}
            • Use localhost if running on the same machine
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#2c5530',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 10,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  urlText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
  refreshButton: {
    padding: 5,
    marginLeft: 10,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  urlItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f0f8f0',
    borderRadius: 6,
    marginBottom: 5,
  },
  workingUrlText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#2e7d32',
    fontFamily: 'monospace',
    flex: 1,
  },
  setButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  setButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noUrlsText: {
    fontSize: 14,
    color: '#f44336',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: 'white',
  },
  testButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  actionButton: {
    backgroundColor: '#2c5530',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  helpSection: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default NetworkConfigScreen;
