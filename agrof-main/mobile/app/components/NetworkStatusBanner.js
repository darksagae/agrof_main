/**
 * Network Status Banner - AGROF
 * Shows current network status and offline/online mode
 * Helps users understand data usage and available features
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import networkManager from '../services/networkManager';
import syncManager from '../services/syncManager';

const NetworkStatusBanner = ({ onPress }) => {
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: true,
    isWiFi: false,
    connectionType: 'unknown'
  });
  const [syncStatus, setSyncStatus] = useState({
    status: 'unknown',
    message: ''
  });
  const [slideAnim] = useState(new Animated.Value(-100));
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Initialize
    initializeStatus();

    // Listen for network changes
    const unsubscribe = networkManager.addListener(handleNetworkChange);

    // Listen for sync changes
    const syncUnsubscribe = syncManager.addListener(handleSyncChange);

    // Animate banner in
    if (showBanner) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    }

    return () => {
      unsubscribe();
      syncUnsubscribe();
    };
  }, []);

  const initializeStatus = async () => {
    await networkManager.initialize();
    await syncManager.initialize();
    
    setNetworkStatus(networkManager.getStatus());
    setSyncStatus(syncManager.getSyncStatus());
  };

  const handleNetworkChange = (state) => {
    setNetworkStatus({
      isOnline: state.isConnected,
      isWiFi: state.type === 'wifi',
      connectionType: state.type
    });
  };

  const handleSyncChange = (event) => {
    setSyncStatus(syncManager.getSyncStatus());
  };

  const getBannerColor = () => {
    if (!networkStatus.isOnline) return '#EF4444'; // Red - Offline
    if (networkStatus.isWiFi) return '#10B981'; // Green - WiFi
    return '#F59E0B'; // Orange - Mobile Data
  };

  const getIcon = () => {
    if (!networkStatus.isOnline) return 'wifi-off';
    if (networkStatus.isWiFi) return 'wifi';
    return 'signal-cellular-alt';
  };

  const getMessage = () => {
    if (!networkStatus.isOnline) {
      return 'Offline - Using cached data';
    }
    if (networkStatus.isWiFi) {
      if (syncStatus.needsSync) {
        return '📶 WiFi Connected - Tap to sync';
      }
      return '📶 WiFi - All features available';
    }
    return '📱 Mobile Data - Limited features to save data';
  };

  const handleBannerPress = () => {
    if (onPress) {
      onPress(networkStatus, syncStatus);
    }
  };

  const handleDismiss = () => {
    Animated.spring(slideAnim, {
      toValue: -100,
      useNativeDriver: true
    }).start(() => setShowBanner(false));
  };

  if (!showBanner) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          backgroundColor: getBannerColor(),
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.content}
        onPress={handleBannerPress}
        activeOpacity={0.8}
      >
        <MaterialIcons name={getIcon()} size={20} color="#FFFFFF" />
        <Text style={styles.message}>{getMessage()}</Text>
        {syncStatus.needsSync && networkStatus.isWiFi && (
          <MaterialIcons name="sync" size={18} color="#FFFFFF" style={styles.syncIcon} />
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.dismissButton}
        onPress={handleDismiss}
      >
        <MaterialIcons name="close" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  syncIcon: {
    marginLeft: 8,
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default NetworkStatusBanner;



