/**
 * Network Manager - AGROF
 * Handles network detection and offline/online mode switching
 */

import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

class NetworkManager {
  constructor() {
    this.isOnline = true;
    this.connectionType = 'unknown';
    this.isWiFi = false;
    this.listeners = [];
    this.initialized = false;
  }

  /**
   * Initialize network monitoring
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Get initial network state
      const state = await NetInfo.fetch();
      this.updateNetworkState(state);

      // Subscribe to network changes
      NetInfo.addEventListener(state => {
        this.updateNetworkState(state);
        this.notifyListeners(state);
      });

      this.initialized = true;
      console.log(`🌐 Network Manager initialized: ${this.isOnline ? 'Online' : 'Offline'} (${this.connectionType})`);
    } catch (error) {
      console.error('❌ Failed to initialize Network Manager:', error);
      // Assume online if detection fails
      this.isOnline = true;
    }
  }

  /**
   * Update internal network state
   */
  updateNetworkState(state) {
    const wasOnline = this.isOnline;
    
    this.isOnline = state.isConnected && state.isInternetReachable !== false;
    this.connectionType = state.type;
    this.isWiFi = state.type === 'wifi';

    // Log network changes
    if (wasOnline !== this.isOnline) {
      console.log(`📡 Network status changed: ${this.isOnline ? 'ONLINE' : 'OFFLINE'}`);
      
      if (this.isOnline) {
        console.log(`✅ Back online with ${this.connectionType}`);
      } else {
        console.log(`⚠️ Gone offline - using cached data`);
      }
    }
  }

  /**
   * Check if device is online
   */
  async checkOnline() {
    try {
      const state = await NetInfo.fetch();
      return state.isConnected && state.isInternetReachable !== false;
    } catch (error) {
      console.error('Error checking network status:', error);
      return this.isOnline; // Return last known state
    }
  }

  /**
   * Check if device is on WiFi
   */
  async checkWiFi() {
    try {
      const state = await NetInfo.fetch();
      return state.type === 'wifi' && state.isConnected;
    } catch (error) {
      console.error('Error checking WiFi status:', error);
      return this.isWiFi;
    }
  }

  /**
   * Get current network status
   */
  getStatus() {
    return {
      isOnline: this.isOnline,
      connectionType: this.connectionType,
      isWiFi: this.isWiFi
    };
  }

  /**
   * Subscribe to network changes
   */
  addListener(callback) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners of network change
   */
  notifyListeners(state) {
    this.listeners.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('Error in network listener:', error);
      }
    });
  }

  /**
   * Show alert when data usage will occur
   * @param {string} action - Description of the action
   * @param {number} estimatedKB - Estimated data usage in KB
   */
  async confirmDataUsage(action, estimatedKB = 0) {
    // If on WiFi, no need to confirm
    if (this.isWiFi) {
      return true;
    }

    // If offline, can't use data anyway
    if (!this.isOnline) {
      Alert.alert(
        '📴 Offline Mode',
        'You are currently offline. Connect to WiFi or enable mobile data to continue.',
        [{ text: 'OK' }]
      );
      return false;
    }

    // Show confirmation for mobile data usage
    return new Promise((resolve) => {
      Alert.alert(
        '📱 Mobile Data Warning',
        `This action will use ${estimatedKB > 0 ? `approximately ${estimatedKB} KB` : 'mobile data'}.\n\n${action}\n\nWould you like to continue?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(false)
          },
          {
            text: 'Continue',
            onPress: () => resolve(true)
          }
        ]
      );
    });
  }

  /**
   * Wait for WiFi connection
   * @param {number} timeout - Maximum wait time in ms
   */
  async waitForWiFi(timeout = 30000) {
    if (this.isWiFi) return true;

    console.log('⏳ Waiting for WiFi connection...');

    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        unsubscribe();
        resolve(false);
      }, timeout);

      const unsubscribe = this.addListener((state) => {
        if (state.type === 'wifi' && state.isConnected) {
          clearTimeout(timeoutId);
          unsubscribe();
          console.log('✅ WiFi connected!');
          resolve(true);
        }
      });
    });
  }

  /**
   * Get network type icon
   */
  getNetworkIcon() {
    if (!this.isOnline) return '📴';
    if (this.isWiFi) return '📶';
    if (this.connectionType === 'cellular') return '📱';
    return '🌐';
  }

  /**
   * Get network status message
   */
  getStatusMessage() {
    if (!this.isOnline) {
      return 'Offline - Using cached data';
    }
    if (this.isWiFi) {
      return 'Online via WiFi';
    }
    if (this.connectionType === 'cellular') {
      return 'Online via Mobile Data';
    }
    return 'Online';
  }

  /**
   * Check if should use data (WiFi only mode)
   */
  shouldUseData(wifiOnly = true) {
    if (!this.isOnline) return false;
    if (!wifiOnly) return true;
    return this.isWiFi;
  }
}

// Export singleton instance
export default new NetworkManager();



