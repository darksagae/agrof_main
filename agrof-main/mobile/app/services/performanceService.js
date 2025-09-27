import AsyncStorage from '@react-native-async-storage/async-storage';

class PerformanceService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.maxCacheSize = 100; // Maximum number of cached items
  }

  // Cache management
  setCache(key, data, timeout = this.cacheTimeout) {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      timeout
    });
  }

  getCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.timeout) {
      return cached.data;
    }
    
    // Remove expired cache
    if (cached) {
      this.cache.delete(key);
    }
    
    return null;
  }

  clearCache() {
    this.cache.clear();
  }

  // Image optimization
  optimizeImage(uri, maxWidth = 800, maxHeight = 600, quality = 0.8) {
    return {
      uri,
      width: maxWidth,
      height: maxHeight,
      quality
    };
  }

  // Data compression
  compressData(data) {
    try {
      const compressed = JSON.stringify(data);
      return compressed;
    } catch (error) {
      console.error('Error compressing data:', error);
      return data;
    }
  }

  // Lazy loading helper
  createLazyLoader(loadFunction, dependencies = []) {
    let isLoading = false;
    let cachedResult = null;

    return async (...args) => {
      if (cachedResult && !isLoading) {
        return cachedResult;
      }

      if (isLoading) {
        return null;
      }

      isLoading = true;
      try {
        const result = await loadFunction(...args);
        cachedResult = result;
        return result;
      } catch (error) {
        console.error('Error in lazy loader:', error);
        return null;
      } finally {
        isLoading = false;
      }
    };
  }

  // Memory management
  cleanupMemory() {
    // Clear old cache entries
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > value.timeout) {
        this.cache.delete(key);
      }
    }

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  }

  // Performance monitoring
  startPerformanceTimer(label) {
    const startTime = Date.now();
    return {
      end: () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        console.log(`Performance [${label}]: ${duration}ms`);
        return duration;
      }
    };
  }

  // Batch operations
  batchOperations(operations, batchSize = 5) {
    const batches = [];
    for (let i = 0; i < operations.length; i += batchSize) {
      batches.push(operations.slice(i, i + batchSize));
    }

    return batches.map(async (batch) => {
      return Promise.all(batch.map(operation => operation()));
    });
  }

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Resource preloading
  async preloadResources(resources) {
    const preloadPromises = resources.map(async (resource) => {
      try {
        if (resource.type === 'image') {
          // Preload image
          const image = new Image();
          image.src = resource.url;
          return new Promise((resolve, reject) => {
            image.onload = () => resolve(resource);
            image.onerror = () => reject(resource);
          });
        } else if (resource.type === 'data') {
          // Preload data
          return await resource.loadFunction();
        }
      } catch (error) {
        console.error(`Error preloading resource ${resource.url}:`, error);
        return null;
      }
    });

    const results = await Promise.allSettled(preloadPromises);
    return results.filter(result => result.status === 'fulfilled');
  }

  // Network optimization
  optimizeNetworkRequest(url, options = {}) {
    const optimizedOptions = {
      ...options,
      timeout: 10000, // 10 second timeout
      headers: {
        'Cache-Control': 'max-age=300', // 5 minute cache
        ...options.headers
      }
    };

    return { url, options: optimizedOptions };
  }

  // Storage optimization
  async optimizeStorage() {
    try {
      // Get all keys
      const keys = await AsyncStorage.getAllKeys();
      
      // Remove old data
      const oldDataKeys = keys.filter(key => 
        key.includes('_old_') || key.includes('_temp_')
      );
      
      if (oldDataKeys.length > 0) {
        await AsyncStorage.multiRemove(oldDataKeys);
      }

      // Compress large data
      const largeDataKeys = keys.filter(key => 
        key.includes('sensorData') || key.includes('weatherData')
      );

      for (const key of largeDataKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data && data.length > 10000) { // If data is larger than 10KB
          const compressed = this.compressData(JSON.parse(data));
          await AsyncStorage.setItem(key, compressed);
        }
      }

      return true;
    } catch (error) {
      console.error('Error optimizing storage:', error);
      return false;
    }
  }

  // Performance metrics
  getPerformanceMetrics() {
    return {
      cacheSize: this.cache.size,
      maxCacheSize: this.maxCacheSize,
      memoryUsage: this.getMemoryUsage(),
      timestamp: Date.now()
    };
  }

  getMemoryUsage() {
    if (global.performance && global.performance.memory) {
      return {
        used: global.performance.memory.usedJSHeapSize,
        total: global.performance.memory.totalJSHeapSize,
        limit: global.performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  // Cleanup on app background
  onAppBackground() {
    this.cleanupMemory();
    this.optimizeStorage();
  }

  // Initialize performance monitoring
  initialize() {
    // Set up periodic cleanup
    setInterval(() => {
      this.cleanupMemory();
    }, 60000); // Every minute

    // Set up storage optimization
    setInterval(() => {
      this.optimizeStorage();
    }, 300000); // Every 5 minutes

    console.log('Performance Service initialized');
    return true;
  }
}

export default new PerformanceService();
