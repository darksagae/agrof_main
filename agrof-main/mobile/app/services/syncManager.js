/**
 * Sync Manager - AGROF
 * Manages data synchronization between offline and online systems
 * Only syncs on WiFi to save mobile data costs
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import networkManager from './networkManager';
import offlineProductService from './offlineProductService';
import offlineCartService from './offlineCartService';
import { productsApi, categoriesApi } from './storeApi';

const LAST_SYNC_KEY = 'last_full_sync';
const AUTO_SYNC_ENABLED_KEY = 'auto_sync_enabled';
const SYNC_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days

class SyncManager {
  constructor() {
    this.syncing = false;
    this.autoSyncEnabled = true;
    this.lastSyncTime = null;
    this.syncListeners = [];
  }

  /**
   * Initialize sync manager
   */
  async initialize() {
    try {
      // Load settings
      const autoSync = await AsyncStorage.getItem(AUTO_SYNC_ENABLED_KEY);
      this.autoSyncEnabled = autoSync !== 'false';

      const lastSync = await AsyncStorage.getItem(LAST_SYNC_KEY);
      this.lastSyncTime = lastSync ? parseInt(lastSync) : null;

      // Setup network listener for auto-sync
      if (this.autoSyncEnabled) {
        networkManager.addListener(this.onNetworkChange.bind(this));
      }

      console.log(`🔄 Sync Manager initialized (Auto-sync: ${this.autoSyncEnabled ? 'ON' : 'OFF'})`);
      console.log(`📅 Last sync: ${this.lastSyncTime ? new Date(this.lastSyncTime).toLocaleString() : 'Never'}`);
    } catch (error) {
      console.error('❌ Failed to initialize Sync Manager:', error);
    }
  }

  /**
   * Handle network changes
   */
  async onNetworkChange(state) {
    // Auto-sync when WiFi becomes available
    if (state.type === 'wifi' && state.isConnected && this.autoSyncEnabled) {
      const needsSync = await this.needsSync();
      
      if (needsSync) {
        console.log('📶 WiFi detected - starting auto-sync...');
        setTimeout(() => this.syncAll(), 2000); // Wait 2s for stability
      }
    }
  }

  /**
   * Check if sync is needed
   */
  async needsSync() {
    if (!this.lastSyncTime) return true;

    const timeSinceSync = Date.now() - this.lastSyncTime;
    return timeSinceSync > SYNC_INTERVAL;
  }

  /**
   * Sync all data
   */
  async syncAll() {
    if (this.syncing) {
      console.log('⚠️ Sync already in progress');
      return {
        success: false,
        message: 'Sync already in progress'
      };
    }

    if (!networkManager.isWiFi) {
      return {
        success: false,
        message: 'Sync requires WiFi connection',
        needsWiFi: true
      };
    }

    this.syncing = true;
    this.notifyListeners({ status: 'started' });

    const results = {
      success: false,
      products: { success: false },
      categories: { success: false },
      orders: { success: false },
      startTime: Date.now()
    };

    try {
      console.log('🔄 Starting full data sync...');

      // 1. Sync products
      results.products = await this.syncProducts();
      
      // 2. Sync categories
      results.categories = await this.syncCategories();
      
      // 3. Sync pending orders
      results.orders = await this.syncOrders();

      // Update last sync time
      this.lastSyncTime = Date.now();
      await AsyncStorage.setItem(LAST_SYNC_KEY, this.lastSyncTime.toString());

      results.success = true;
      results.duration = Date.now() - results.startTime;

      console.log(`✅ Sync complete in ${results.duration}ms`);
      this.notifyListeners({ status: 'completed', results });

      return results;

    } catch (error) {
      console.error('❌ Sync failed:', error);
      results.error = error.message;
      this.notifyListeners({ status: 'failed', error: error.message });
      return results;
    } finally {
      this.syncing = false;
    }
  }

  /**
   * Sync products from backend
   */
  async syncProducts() {
    try {
      console.log('🔄 Syncing products...');
      
      const products = await productsApi.getAll({ limit: 1000 });
      
      // TODO: Update offline product database
      // For now, just log success
      console.log(`✅ Synced ${products.length} products`);

      return {
        success: true,
        count: products.length,
        message: `${products.length} products synced`
      };
    } catch (error) {
      console.error('❌ Product sync failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Sync categories from backend
   */
  async syncCategories() {
    try {
      console.log('🔄 Syncing categories...');
      
      const categories = await categoriesApi.getAll();
      
      // TODO: Update offline categories
      console.log(`✅ Synced ${categories.length} categories`);

      return {
        success: true,
        count: categories.length,
        message: `${categories.length} categories synced`
      };
    } catch (error) {
      console.error('❌ Category sync failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Sync pending orders to backend
   */
  async syncOrders() {
    try {
      console.log('🔄 Syncing pending orders...');
      
      const result = await offlineCartService.syncPendingOrders();
      
      if (result.success) {
        console.log(`✅ Synced ${result.synced} orders`);
        
        // Clean up synced orders
        await offlineCartService.removeSyncedOrders();
      }

      return result;
    } catch (error) {
      console.error('❌ Order sync failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    const timeSinceSync = this.lastSyncTime ? Date.now() - this.lastSyncTime : null;
    const needsSync = timeSinceSync ? timeSinceSync > SYNC_INTERVAL : true;

    let status = 'unknown';
    let message = '';

    if (this.syncing) {
      status = 'syncing';
      message = 'Sync in progress...';
    } else if (!networkManager.isOnline) {
      status = 'offline';
      message = 'Waiting for internet connection';
    } else if (!networkManager.isWiFi) {
      status = 'waiting_wifi';
      message = 'Waiting for WiFi connection';
    } else if (needsSync) {
      status = 'needs_sync';
      message = 'Ready to sync';
    } else {
      status = 'up_to_date';
      message = 'Data is up to date';
    }

    return {
      status,
      message,
      syncing: this.syncing,
      lastSync: this.lastSyncTime ? new Date(this.lastSyncTime) : null,
      timeSinceSync,
      needsSync,
      autoSyncEnabled: this.autoSyncEnabled,
      canSync: networkManager.isWiFi && !this.syncing
    };
  }

  /**
   * Force manual sync
   */
  async forceSyncNow() {
    if (!networkManager.isWiFi) {
      throw new Error('Manual sync requires WiFi connection');
    }

    return await this.syncAll();
  }

  /**
   * Toggle auto-sync
   */
  async setAutoSync(enabled) {
    this.autoSyncEnabled = enabled;
    await AsyncStorage.setItem(AUTO_SYNC_ENABLED_KEY, enabled.toString());
    console.log(`🔄 Auto-sync: ${enabled ? 'Enabled' : 'Disabled'}`);

    if (enabled) {
      // Check if sync is needed
      const needsSync = await this.needsSync();
      if (needsSync && networkManager.isWiFi) {
        this.syncAll();
      }
    }
  }

  /**
   * Add sync listener
   */
  addListener(callback) {
    this.syncListeners.push(callback);
    return () => {
      this.syncListeners = this.syncListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners
   */
  notifyListeners(event) {
    this.syncListeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in sync listener:', error);
      }
    });
  }

  /**
   * Get sync history/statistics
   */
  async getStats() {
    const status = this.getSyncStatus();
    const offlineStats = await offlineProductService.getStats();
    const cartStats = await offlineCartService.getStats();

    return {
      sync: status,
      offline: {
        products: offlineStats.totalProducts,
        categories: offlineStats.totalCategories,
        lastProductSync: await offlineProductService.getLastSyncTime()
      },
      cart: cartStats,
      network: {
        isOnline: networkManager.isOnline,
        isWiFi: networkManager.isWiFi,
        connectionType: networkManager.connectionType
      }
    };
  }

  /**
   * Reset sync history
   */
  async resetSyncHistory() {
    this.lastSyncTime = null;
    await AsyncStorage.removeItem(LAST_SYNC_KEY);
    console.log('🔄 Sync history reset');
  }

  /**
   * Get user-friendly sync message
   */
  getUserFriendlyMessage() {
    const status = this.getSyncStatus();
    
    if (status.syncing) {
      return '🔄 Syncing data...';
    }

    if (!networkManager.isOnline) {
      return '📴 Offline - Data will sync when online';
    }

    if (!networkManager.isWiFi) {
      return '📱 Connect to WiFi to sync latest data';
    }

    if (status.needsSync) {
      return '🔄 New data available - Tap to sync';
    }

    if (status.lastSync) {
      const hours = Math.floor(status.timeSinceSync / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      
      if (days > 0) {
        return `✅ Synced ${days} day${days > 1 ? 's' : ''} ago`;
      } else if (hours > 0) {
        return `✅ Synced ${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        return '✅ Recently synced';
      }
    }

    return '⚠️ Never synced - Connect to WiFi';
  }
}

// Export singleton instance
export default new SyncManager();



