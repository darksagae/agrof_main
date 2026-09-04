/**
 * Image Cache Service - AGROF
 * Downloads and caches product images for offline use
 * Uses expo-file-system to store images permanently
 */

import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_DIRECTORY = `${FileSystem.documentDirectory}image_cache/`;
const CACHE_INDEX_KEY = 'image_cache_index';
const MAX_CACHE_SIZE_MB = 200; // 200 MB limit

class ImageCacheService {
  constructor() {
    this.cacheIndex = {};
    this.initialized = false;
    this.downloadQueue = [];
    this.isDownloading = false;
  }

  /**
   * Initialize cache directory and load cache index
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Create cache directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(CACHE_DIRECTORY);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(CACHE_DIRECTORY, { intermediates: true });
        console.log('📁 Created image cache directory');
      }

      // Load cache index from AsyncStorage
      const indexJson = await AsyncStorage.getItem(CACHE_INDEX_KEY);
      if (indexJson) {
        this.cacheIndex = JSON.parse(indexJson);
        console.log(`📦 Loaded cache index: ${Object.keys(this.cacheIndex).length} images cached`);
      }

      this.initialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize image cache:', error);
    }
  }

  /**
   * Get cached image URI or download if not cached
   */
  async getCachedImage(imageUrl) {
    await this.initialize();

    if (!imageUrl || !imageUrl.startsWith('http')) {
      return imageUrl; // Return as-is if not a URL
    }

    // Generate cache key from URL
    const cacheKey = this.generateCacheKey(imageUrl);
    const cachedPath = `${CACHE_DIRECTORY}${cacheKey}`;

    // Check if already cached
    if (this.cacheIndex[imageUrl]) {
      const fileInfo = await FileSystem.getInfoAsync(cachedPath);
      if (fileInfo.exists) {
        console.log('✅ Using cached image:', cacheKey);
        return cachedPath;
      } else {
        // Remove from index if file doesn't exist
        delete this.cacheIndex[imageUrl];
        await this.saveCacheIndex();
      }
    }

    // Add to download queue if not cached
    this.addToDownloadQueue(imageUrl, cachedPath);
    
    // Return original URL while downloading
    return imageUrl;
  }

  /**
   * Generate a safe filename from URL
   */
  generateCacheKey(url) {
    // Extract path after /api/images/
    const match = url.match(/\/api\/images\/(.+)$/);
    if (match) {
      // Replace special characters with underscores
      return match[1].replace(/[^a-zA-Z0-9._-]/g, '_');
    }
    
    // Fallback: use hash
    return this.simpleHash(url) + '.jpg';
  }

  /**
   * Simple hash function for URLs
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Add image to download queue
   */
  addToDownloadQueue(imageUrl, cachedPath) {
    // Check if already in queue
    if (this.downloadQueue.some(item => item.url === imageUrl)) {
      return;
    }

    this.downloadQueue.push({ url: imageUrl, path: cachedPath });
    
    // Start processing queue if not already downloading
    if (!this.isDownloading) {
      this.processDownloadQueue();
    }
  }

  /**
   * Process download queue (download images one by one)
   */
  async processDownloadQueue() {
    if (this.isDownloading || this.downloadQueue.length === 0) {
      return;
    }

    this.isDownloading = true;

    while (this.downloadQueue.length > 0) {
      const item = this.downloadQueue.shift();
      
      try {
        await this.downloadImage(item.url, item.path);
      } catch (error) {
        console.warn(`⚠️ Failed to cache image: ${item.url}`, error.message);
      }
    }

    this.isDownloading = false;
  }

  /**
   * Download and cache a single image
   */
  async downloadImage(imageUrl, cachedPath) {
    try {
      console.log('⬇️ Downloading image:', imageUrl);

      // Download the image
      const downloadResult = await FileSystem.downloadAsync(imageUrl, cachedPath);

      if (downloadResult.status === 200) {
        // Add to cache index
        this.cacheIndex[imageUrl] = {
          path: cachedPath,
          cachedAt: Date.now(),
          size: downloadResult.headers['content-length'] || 0
        };

        await this.saveCacheIndex();
        console.log('✅ Image cached successfully');

        // Check cache size and cleanup if needed
        await this.checkCacheSizeAndCleanup();
      }
    } catch (error) {
      console.warn('⚠️ Failed to download image:', error.message);
      throw error;
    }
  }

  /**
   * Save cache index to AsyncStorage
   */
  async saveCacheIndex() {
    try {
      await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(this.cacheIndex));
    } catch (error) {
      console.error('❌ Failed to save cache index:', error);
    }
  }

  /**
   * Check total cache size and cleanup old images if needed
   */
  async checkCacheSizeAndCleanup() {
    try {
      const totalSize = Object.values(this.cacheIndex).reduce(
        (sum, item) => sum + (parseInt(item.size) || 0), 
        0
      );

      const totalSizeMB = totalSize / (1024 * 1024);

      if (totalSizeMB > MAX_CACHE_SIZE_MB) {
        console.log(`🧹 Cache size (${totalSizeMB.toFixed(2)} MB) exceeds limit, cleaning up...`);
        await this.cleanupOldImages();
      }
    } catch (error) {
      console.error('❌ Failed to check cache size:', error);
    }
  }

  /**
   * Remove oldest images to free up space
   */
  async cleanupOldImages() {
    try {
      // Sort by cached time (oldest first)
      const sortedEntries = Object.entries(this.cacheIndex).sort(
        (a, b) => a[1].cachedAt - b[1].cachedAt
      );

      // Remove oldest 20%
      const toRemove = Math.ceil(sortedEntries.length * 0.2);
      
      for (let i = 0; i < toRemove; i++) {
        const [url, data] = sortedEntries[i];
        
        try {
          await FileSystem.deleteAsync(data.path, { idempotent: true });
          delete this.cacheIndex[url];
          console.log('🗑️ Removed old cached image:', url);
        } catch (error) {
          console.warn('⚠️ Failed to delete cached image:', error);
        }
      }

      await this.saveCacheIndex();
      console.log(`✅ Cleaned up ${toRemove} old images`);
    } catch (error) {
      console.error('❌ Failed to cleanup old images:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats() {
    await this.initialize();

    const imageCount = Object.keys(this.cacheIndex).length;
    const totalSize = Object.values(this.cacheIndex).reduce(
      (sum, item) => sum + (parseInt(item.size) || 0),
      0
    );
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

    return {
      imageCount,
      totalSizeMB,
      maxSizeMB: MAX_CACHE_SIZE_MB,
      cacheDirectory: CACHE_DIRECTORY
    };
  }

  /**
   * Clear entire cache
   */
  async clearCache() {
    try {
      await FileSystem.deleteAsync(CACHE_DIRECTORY, { idempotent: true });
      await FileSystem.makeDirectoryAsync(CACHE_DIRECTORY, { intermediates: true });
      
      this.cacheIndex = {};
      await AsyncStorage.removeItem(CACHE_INDEX_KEY);
      
      console.log('✅ Image cache cleared');
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
    }
  }

  /**
   * Preload images for products
   * Use this to cache images in the background when online
   */
  async preloadProductImages(products, maxImages = 500) {
    await this.initialize();

    console.log(`📦 Preloading images for ${Math.min(products.length, maxImages)} products...`);

    let count = 0;
    for (const product of products) {
      if (count >= maxImages) break;

      if (product.image_url && product.image_url.startsWith('http')) {
        await this.getCachedImage(product.image_url);
        count++;
      }
    }

    console.log(`✅ Preloading initiated for ${count} images (will download in background)`);
  }
}

// Export singleton instance
export default new ImageCacheService();


