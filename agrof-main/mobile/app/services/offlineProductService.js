/**
 * Offline Product Service - AGROF
 * Provides product data without backend connection
 * Uses bundled JSON data for 100% offline functionality
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import productsData from '../data/offline/products.json';
import categoriesData from '../data/offline/categories.json';

const OFFLINE_CACHE_KEY = 'offline_products_cache';
const LAST_SYNC_KEY = 'last_sync_timestamp';

class OfflineProductService {
  constructor() {
    this.products = [];
    this.categories = [];
    this.initialized = false;
  }

  /**
   * Initialize offline database
   * Load products and categories from bundled JSON
   */
  async initialize() {
    if (this.initialized) return;

    try {
      console.log('🔧 Initializing offline product database...');
      
      // Load bundled data
      this.products = productsData || [];
      this.categories = categoriesData || [];

      // Cache in AsyncStorage for faster subsequent loads
      await AsyncStorage.setItem(
        OFFLINE_CACHE_KEY,
        JSON.stringify({
          products: this.products,
          categories: this.categories,
          timestamp: Date.now()
        })
      );

      this.initialized = true;
      console.log(`✅ Offline database initialized: ${this.products.length} products, ${this.categories.length} categories`);
      
      return {
        success: true,
        products: this.products.length,
        categories: this.categories.length
      };
    } catch (error) {
      console.error('❌ Failed to initialize offline database:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all products with optional filtering
   */
  async getProducts(params = {}) {
    await this.initialize();

    const { search, category, limit = 500, offset = 0 } = params;
    let filteredProducts = [...this.products];

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(
        p => p.category_name === category || p.category_id === category
      );
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        p => 
          p.name.toLowerCase().includes(searchLower) ||
          (p.description && p.description.toLowerCase().includes(searchLower)) ||
          (p.features && p.features.toLowerCase().includes(searchLower))
      );
    }

    // Apply pagination
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    console.log(`📦 Offline products: ${paginatedProducts.length} / ${filteredProducts.length} total`);
    
    return paginatedProducts;
  }

  /**
   * Get single product by ID
   */
  async getProductById(productId) {
    await this.initialize();

    const product = this.products.find(p => p.id === productId || p.id === parseInt(productId));
    
    if (product) {
      console.log(`✅ Found offline product: ${product.name}`);
      return product;
    }

    console.warn(`⚠️ Product ${productId} not found in offline database`);
    return null;
  }

  /**
   * Get all categories
   */
  async getCategories() {
    await this.initialize();

    console.log(`📁 Offline categories: ${this.categories.length}`);
    return this.categories;
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId) {
    await this.initialize();

    const products = this.products.filter(
      p => p.category_id === categoryId || p.category_name === categoryId
    );

    console.log(`📦 Category "${categoryId}": ${products.length} products`);
    return products;
  }

  /**
   * Search products (offline full-text search)
   */
  async searchProducts(query) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    await this.initialize();

    const searchLower = query.toLowerCase();
    const results = this.products.filter(p => {
      const nameMatch = p.name.toLowerCase().includes(searchLower);
      const descMatch = p.description && p.description.toLowerCase().includes(searchLower);
      const featuresMatch = p.features && p.features.toLowerCase().includes(searchLower);
      const categoryMatch = p.category_name && p.category_name.toLowerCase().includes(searchLower);

      return nameMatch || descMatch || featuresMatch || categoryMatch;
    });

    console.log(`🔍 Offline search "${query}": ${results.length} results`);
    return results;
  }

  /**
   * Get products by disease/treatment type
   * Used for product recommendations after disease detection
   */
  async getProductsByTreatment(diseaseType, keywords = []) {
    await this.initialize();

    // Map disease types to categories
    const categoryMap = {
      'fungal': 'fungicides',
      'bacterial': 'fungicides',
      'viral': 'organic_chemicals',
      'pest': 'herbicides',
      'nutrient': 'fertilizers',
      'weed': 'herbicides'
    };

    const targetCategory = categoryMap[diseaseType?.toLowerCase()] || 'fungicides';
    
    let products = this.products.filter(p => p.category_name === targetCategory);

    // Further filter by keywords if provided
    if (keywords && keywords.length > 0) {
      products = products.filter(p => {
        const searchText = `${p.name} ${p.description} ${p.features}`.toLowerCase();
        return keywords.some(keyword => 
          searchText.includes(keyword.toLowerCase())
        );
      });
    }

    console.log(`💊 Treatment products for "${diseaseType}": ${products.length} found`);
    return products.slice(0, 10); // Return top 10
  }

  /**
   * Get last sync timestamp
   */
  async getLastSyncTime() {
    try {
      const timestamp = await AsyncStorage.getItem(LAST_SYNC_KEY);
      return timestamp ? parseInt(timestamp) : null;
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  }

  /**
   * Update last sync timestamp
   */
  async setLastSyncTime(timestamp = Date.now()) {
    try {
      await AsyncStorage.setItem(LAST_SYNC_KEY, timestamp.toString());
      console.log('✅ Last sync time updated');
    } catch (error) {
      console.error('Error setting last sync time:', error);
    }
  }

  /**
   * Check if database needs updating
   * @returns {boolean}
   */
  async needsUpdate() {
    const lastSync = await this.getLastSyncTime();
    if (!lastSync) return true;

    const SYNC_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days
    const timeSinceSync = Date.now() - lastSync;

    return timeSinceSync > SYNC_INTERVAL;
  }

  /**
   * Get database stats
   */
  async getStats() {
    await this.initialize();

    return {
      totalProducts: this.products.length,
      totalCategories: this.categories.length,
      lastSync: await this.getLastSyncTime(),
      categories: this.categories.map(c => ({
        name: c.name,
        displayName: c.display_name,
        productCount: this.products.filter(p => p.category_id === c.id).length
      }))
    };
  }

  /**
   * Clear offline cache
   */
  async clearCache() {
    try {
      await AsyncStorage.removeItem(OFFLINE_CACHE_KEY);
      await AsyncStorage.removeItem(LAST_SYNC_KEY);
      this.products = [];
      this.categories = [];
      this.initialized = false;
      console.log('🗑️ Offline cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

// Export singleton instance
export default new OfflineProductService();



