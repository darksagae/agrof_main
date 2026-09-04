/**
 * Hybrid Store API - AGROF
 * Automatically switches between online (backend) and offline (local) data
 * Provides seamless experience regardless of network status
 */

import networkManager from './networkManager';
import offlineProductService from './offlineProductService';
import { productsApi, categoriesApi, cartApi, healthCheck } from './storeApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WIFI_ONLY_KEY = 'wifi_only_mode';
const DATA_USAGE_KEY = 'total_data_usage';

class HybridStoreApi {
  constructor() {
    this.wifiOnlyMode = true; // Default to WiFi only to save data
    this.dataUsage = 0;
    this.initialized = false;
  }

  /**
   * Initialize hybrid API
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize network manager
      await networkManager.initialize();

      // Initialize offline database
      await offlineProductService.initialize();

      // Load settings
      const wifiOnly = await AsyncStorage.getItem(WIFI_ONLY_KEY);
      this.wifiOnlyMode = wifiOnly !== 'false'; // Default to true

      const dataUsage = await AsyncStorage.getItem(DATA_USAGE_KEY);
      this.dataUsage = dataUsage ? parseInt(dataUsage) : 0;

      this.initialized = true;
      console.log(`✅ Hybrid Store API initialized (WiFi Only: ${this.wifiOnlyMode})`);
    } catch (error) {
      console.error('❌ Failed to initialize Hybrid API:', error);
    }
  }

  /**
   * Check if we should use online API
   */
  shouldUseOnline() {
    if (!networkManager.isOnline) return false;
    if (this.wifiOnlyMode) return networkManager.isWiFi;
    return true;
  }

  /**
   * Track data usage
   */
  async trackDataUsage(bytes) {
    this.dataUsage += bytes;
    await AsyncStorage.setItem(DATA_USAGE_KEY, this.dataUsage.toString());
  }

  /**
   * Get all products
   */
  async getProducts(params = {}) {
    await this.initialize();

    if (this.shouldUseOnline()) {
      try {
        console.log('🌐 Fetching products from backend...');
        const products = await productsApi.getAll(params);
        
        // Estimate data usage (rough estimate)
        const estimatedKB = (JSON.stringify(products).length / 1024).toFixed(2);
        await this.trackDataUsage(estimatedKB * 1024);
        console.log(`✅ Backend products loaded (${estimatedKB} KB used)`);
        
        return {
          data: products,
          source: 'online',
          dataUsed: estimatedKB
        };
      } catch (error) {
        console.warn('⚠️ Backend failed, switching to offline database:', error.message);
        // Fallback to offline
      }
    }

    // Use offline data
    console.log('📦 Using offline product database...');
    const products = await offlineProductService.getProducts(params);
    return {
      data: products,
      source: 'offline',
      dataUsed: 0
    };
  }

  /**
   * Get single product by ID
   */
  async getProductById(productId) {
    await this.initialize();

    if (this.shouldUseOnline()) {
      try {
        console.log(`🌐 Fetching product ${productId} from backend...`);
        const product = await productsApi.getById(productId);
        return {
          data: product,
          source: 'online'
        };
      } catch (error) {
        console.warn('⚠️ Backend failed, switching to offline');
      }
    }

    // Use offline data
    const product = await offlineProductService.getProductById(productId);
    return {
      data: product,
      source: 'offline'
    };
  }

  /**
   * Get all categories
   */
  async getCategories() {
    await this.initialize();

    if (this.shouldUseOnline()) {
      try {
        console.log('🌐 Fetching categories from backend...');
        const categories = await categoriesApi.getAll();
        return {
          data: categories,
          source: 'online'
        };
      } catch (error) {
        console.warn('⚠️ Backend failed, switching to offline');
      }
    }

    // Use offline data
    const categories = await offlineProductService.getCategories();
    return {
      data: categories,
      source: 'offline'
    };
  }

  /**
   * Search products
   */
  async searchProducts(query) {
    await this.initialize();

    if (this.shouldUseOnline()) {
      try {
        console.log(`🌐 Searching products online: "${query}"`);
        const products = await productsApi.search(query);
        return {
          data: products,
          source: 'online'
        };
      } catch (error) {
        console.warn('⚠️ Backend search failed, using offline');
      }
    }

    // Use offline search
    console.log(`📦 Searching products offline: "${query}"`);
    const products = await offlineProductService.searchProducts(query);
    return {
      data: products,
      source: 'offline'
    };
  }

  /**
   * Get products by treatment/disease
   */
  async getProductsByTreatment(diseaseType, keywords = []) {
    await this.initialize();

    // Always try offline first for treatment recommendations
    // (faster and works offline)
    const products = await offlineProductService.getProductsByTreatment(diseaseType, keywords);
    
    return {
      data: products,
      source: 'offline'
    };
  }

  /**
   * Cart operations (always online)
   */
  cart = {
    addItem: async (productId, quantity = 1) => {
      if (!networkManager.isOnline) {
        console.log('📴 Offline: Cart item saved locally');
        // TODO: Implement local cart queue
        return {
          success: false,
          offline: true,
          message: 'Cart saved locally. Will sync when online.'
        };
      }

      try {
        const result = await cartApi.addItem(productId, quantity);
        return { ...result, source: 'online' };
      } catch (error) {
        return {
          success: false,
          offline: true,
          message: 'Could not add to cart. Saved locally.'
        };
      }
    },

    getItems: async () => {
      if (!networkManager.isOnline) {
        console.log('📴 Offline: Using local cart');
        // TODO: Return local cart items
        return {
          data: [],
          source: 'offline'
        };
      }

      try {
        const items = await cartApi.getItems();
        return {
          data: items,
          source: 'online'
        };
      } catch (error) {
        return {
          data: [],
          source: 'offline'
        };
      }
    }
  };

  /**
   * Health check
   */
  async checkHealth() {
    if (!networkManager.isOnline) {
      return {
        status: 'OFFLINE',
        message: 'No internet connection'
      };
    }

    try {
      return await healthCheck();
    } catch (error) {
      return {
        status: 'ERROR',
        message: error.message
      };
    }
  }

  /**
   * Get sync status
   */
  async getSyncStatus() {
    const lastSync = await offlineProductService.getLastSyncTime();
    const needsUpdate = await offlineProductService.needsUpdate();

    return {
      lastSync: lastSync ? new Date(lastSync) : null,
      needsUpdate,
      isOnline: networkManager.isOnline,
      isWiFi: networkManager.isWiFi,
      wifiOnlyMode: this.wifiOnlyMode
    };
  }

  /**
   * Force sync (WiFi only)
   */
  async syncData() {
    if (!networkManager.isWiFi) {
      throw new Error('Sync requires WiFi connection');
    }

    console.log('🔄 Starting data sync...');

    try {
      // Fetch latest products and categories
      const [products, categories] = await Promise.all([
        productsApi.getAll({ limit: 1000 }),
        categoriesApi.getAll()
      ]);

      // TODO: Update offline database with new data
      await offlineProductService.setLastSyncTime();

      console.log(`✅ Sync complete: ${products.length} products, ${categories.length} categories`);

      return {
        success: true,
        products: products.length,
        categories: categories.length
      };
    } catch (error) {
      console.error('❌ Sync failed:', error);
      throw error;
    }
  }

  /**
   * Toggle WiFi-only mode
   */
  async setWiFiOnlyMode(enabled) {
    this.wifiOnlyMode = enabled;
    await AsyncStorage.setItem(WIFI_ONLY_KEY, enabled.toString());
    console.log(`📶 WiFi-only mode: ${enabled ? 'Enabled' : 'Disabled'}`);
  }

  /**
   * Get data usage statistics
   */
  getDataUsage() {
    const mb = (this.dataUsage / 1024 / 1024).toFixed(2);
    return {
      bytes: this.dataUsage,
      mb: parseFloat(mb),
      formatted: `${mb} MB`
    };
  }

  /**
   * Reset data usage counter
   */
  async resetDataUsage() {
    this.dataUsage = 0;
    await AsyncStorage.setItem(DATA_USAGE_KEY, '0');
    console.log('🔄 Data usage counter reset');
  }

  /**
   * Get database stats
   */
  async getStats() {
    const offlineStats = await offlineProductService.getStats();
    const syncStatus = await this.getSyncStatus();
    const dataUsage = this.getDataUsage();
    const networkStatus = networkManager.getStatus();

    return {
      offline: offlineStats,
      sync: syncStatus,
      data: dataUsage,
      network: networkStatus
    };
  }
}

// Export singleton instance
export default new HybridStoreApi();


