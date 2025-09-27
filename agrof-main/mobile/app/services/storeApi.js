// AGROF Store API Service
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend API configuration with fallback options
const API_BASE_URLS = [
  'http://192.168.0.100:3001/api', // Current local IP (highest priority)
  'http://localhost:3001/api',     // Localhost fallback (port 3001)
  'http://127.0.0.1:3001/api',    // Alternative localhost (port 3001)
  'http://10.0.2.2:3001/api',      // Android emulator fallback
  'http://192.168.1.14:3001/api',  // Previous network IP (port 3001)
  'http://192.168.0.105:3001/api' // Previous network IP (port 3001)
];

let currentApiUrl = API_BASE_URLS[0]; // Start with primary
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Generate a simple session ID for cart management
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create session ID
const getSessionId = async () => {
  try {
    let sessionId = await AsyncStorage.getItem('store_session_id');
    if (!sessionId) {
      sessionId = generateSessionId();
      await AsyncStorage.setItem('store_session_id', sessionId);
    }
    return sessionId;
  } catch (error) {
    console.error('Error getting session ID:', error);
    return generateSessionId();
  }
};

// Cache management
const cache = new Map();

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Test API connectivity
const testApiConnection = async (baseUrl) => {
  try {
    console.log(`🔍 Testing API connection to: ${baseUrl}/health`);
    // Test store backend with health endpoint
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      timeout: 5000, // 5 second timeout
    });
    const isOk = response.ok;
    console.log(`📊 API test result for ${baseUrl}: ${isOk ? 'SUCCESS' : 'FAILED'} (status: ${response.status})`);
    return isOk;
  } catch (error) {
    console.log(`❌ API test error for ${baseUrl}:`, error.message);
    return false;
  }
};

// Find working API URL
const findWorkingApiUrl = async () => {
  for (const url of API_BASE_URLS) {
    console.log(`🔍 Testing API URL: ${url}`);
    const isWorking = await testApiConnection(url);
    if (isWorking) {
      console.log(`✅ Found working API URL: ${url}`);
      return url;
    }
  }
  throw new Error('No working API URL found');
};

// Generic API request function with automatic failover
const apiRequest = async (endpoint, options = {}) => {
  let lastError;
  
  for (let i = 0; i < API_BASE_URLS.length; i++) {
    try {
      const url = `${currentApiUrl}${endpoint}`;
      console.log(`🌐 API Request: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        timeout: 5000, // 5 second timeout
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API Response: ${endpoint} - ${data.length || 'N/A'} items`);
      return data;
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint} with ${currentApiUrl}:`, error);
      lastError = error;
      
      // Try to find a working URL
      try {
        const workingUrl = await findWorkingApiUrl();
        currentApiUrl = workingUrl;
        console.log(`🔄 Switched to working API URL: ${currentApiUrl}`);
        continue; // Retry with new URL
      } catch (fallbackError) {
        console.error('❌ No working API URL found, trying next URL...');
        if (i < API_BASE_URLS.length - 1) {
          currentApiUrl = API_BASE_URLS[i + 1];
          continue;
        }
      }
    }
  }
  
  throw lastError || new Error('All API URLs failed');
};

// Categories API
export const categoriesApi = {
  // Get all categories
  getAll: async () => {
    const cacheKey = 'categories_all';
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const data = await apiRequest('/categories');
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      // Return fallback categories if API fails
      return [
        { id: 1, name: 'fertilizers', display_name: 'Fertilizers', description: 'Agricultural fertilizers' },
        { id: 2, name: 'fungicides', display_name: 'Fungicides', description: 'Plant protection' },
        { id: 3, name: 'herbicides', display_name: 'Herbicides', description: 'Weed control' },
        { id: 4, name: 'nursery_bed', display_name: 'Nursery Bed', description: 'Seedlings and plantlets' },
        { id: 5, name: 'organic_chemicals', display_name: 'Organic Chemicals', description: 'Organic solutions' },
        { id: 6, name: 'seeds', display_name: 'Seeds', description: 'High-quality seeds' }
      ];
    }
  },

  // Get products by category
  getProducts: async (categoryName) => {
    const cacheKey = `category_products_${categoryName}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const data = await apiRequest(`/categories/${categoryName}/products`);
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Failed to fetch products for category ${categoryName}:`, error);
      return [];
    }
  }
};

// Products API
export const productsApi = {
  // Get all products
  getAll: async (params = {}) => {
    const { search, category, limit = 500, offset = 0 } = params;
    const cacheKey = `products_all_${JSON.stringify(params)}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (category) queryParams.append('category', category);
      if (limit) queryParams.append('limit', limit);
      if (offset) queryParams.append('offset', offset);

      const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const data = await apiRequest(endpoint);
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch all products:', error);
      return [];
    }
  },

  // Get single product
  getById: async (id) => {
    const cacheKey = `product_${id}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const data = await apiRequest(`/products/${id}`);
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      return null;
    }
  },

  // Search products
  search: async (query, category = null) => {
    const cacheKey = `search_${query}_${category || 'all'}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const queryParams = new URLSearchParams({ q: query });
      if (category) queryParams.append('category', category);

      const data = await apiRequest(`/search?${queryParams.toString()}`);
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Failed to search products with query "${query}":`, error);
      return [];
    }
  }
};

// Cart API
export const cartApi = {
  // Add item to cart
  addItem: async (productId, quantity = 1) => {
    try {
      const sessionId = await getSessionId();
      const data = await apiRequest('/cart/add', {
        method: 'POST',
        body: JSON.stringify({
          sessionId,
          productId,
          quantity
        })
      });
      return data;
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    }
  },

  // Get cart items
  getItems: async () => {
    try {
      const sessionId = await getSessionId();
      const data = await apiRequest(`/cart/${sessionId}`);
      return data;
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      return [];
    }
  },

  // Update item quantity
  updateQuantity: async (itemId, quantity) => {
    try {
      const sessionId = await getSessionId();
      const data = await apiRequest(`/cart/${sessionId}/item/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      });
      return data;
    } catch (error) {
      console.error('Failed to update cart item quantity:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeItem: async (itemId) => {
    try {
      const sessionId = await getSessionId();
      const data = await apiRequest(`/cart/${sessionId}/item/${itemId}`, {
        method: 'DELETE'
      });
      return data;
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      throw error;
    }
  },

  // Clear entire cart
  clear: async () => {
    try {
      const sessionId = await getSessionId();
      const data = await apiRequest(`/cart/${sessionId}`, {
        method: 'DELETE'
      });
      return data;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const data = await apiRequest('/health');
    return data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'ERROR', message: 'Backend not available' };
  }
};

// Clear cache
export const clearCache = () => {
  cache.clear();
  console.log('🗑️ API cache cleared');
};

// Reset API URL to primary
export const resetApiUrl = () => {
  currentApiUrl = API_BASE_URLS[0];
  console.log(`🔄 API URL reset to: ${currentApiUrl}`);
};

// Force API URL to specific URL
export const setApiUrl = (url) => {
  currentApiUrl = url;
  console.log(`🔧 API URL manually set to: ${currentApiUrl}`);
};

// Get current API URL
export const getCurrentApiUrl = () => {
  return currentApiUrl;
};

// Test all API URLs and return working ones
export const testAllApiUrls = async () => {
  const workingUrls = [];
  for (const url of API_BASE_URLS) {
    const isWorking = await testApiConnection(url);
    if (isWorking) {
      workingUrls.push(url);
    }
  }
  return workingUrls;
};

// Get cache stats
export const getCacheStats = () => {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
};

export default {
  categoriesApi,
  productsApi,
  cartApi,
  healthCheck,
  clearCache,
  getCacheStats,
  resetApiUrl,
  setApiUrl,
  getCurrentApiUrl,
  testAllApiUrls
};
