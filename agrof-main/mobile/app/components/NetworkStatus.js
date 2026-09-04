import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { testAllApiUrls, getCurrentApiUrl, resetApiUrl } from '../services/storeApi';

const NetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState('checking');
  const [currentUrl, setCurrentUrl] = useState('');
  const [workingUrls, setWorkingUrls] = useState([]);

  useEffect(() => {
    checkNetworkStatus();
  }, []);

  const checkNetworkStatus = async () => {
    try {
      setNetworkStatus('checking');
      setCurrentUrl(getCurrentApiUrl());
      
      const urls = await testAllApiUrls();
      setWorkingUrls(urls);
      
      if (urls.length > 0) {
        setNetworkStatus('connected');
      } else {
        setNetworkStatus('disconnected');
      }
    } catch (error) {
      console.error('Network status check failed:', error);
      setNetworkStatus('error');
    }
  };

  const handleResetApi = () => {
    resetApiUrl();
    setCurrentUrl(getCurrentApiUrl());
    checkNetworkStatus();
  };

  const showNetworkDetails = () => {
    const details = `
Current API URL: ${currentUrl}
Working URLs: ${workingUrls.length > 0 ? workingUrls.join('\n') : 'None'}
Status: ${networkStatus}
    `.trim();
    
    Alert.alert('Network Details', details, [
      { text: 'OK' },
      { text: 'Test Again', onPress: checkNetworkStatus }
    ]);
  };

  const getStatusColor = () => {
    switch (networkStatus) {
      case 'connected': return '#4CAF50';
      case 'disconnected': return '#F44336';
      case 'checking': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = () => {
    switch (networkStatus) {
      case 'connected': return 'wifi';
      case 'disconnected': return 'wifi-off';
      case 'checking': return 'refresh';
      default: return 'error';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.statusButton, { backgroundColor: getStatusColor() }]}
        onPress={showNetworkDetails}
      >
        <MaterialIcons name={getStatusIcon()} size={16} color="white" />
        <Text style={styles.statusText}>
          {networkStatus.toUpperCase()}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.resetButton}
        onPress={handleResetApi}
      >
        <MaterialIcons name="refresh" size={16} color="#2196F3" />
        <Text style={styles.resetText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#E3F2FD',
  },
  resetText: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default NetworkStatus;
