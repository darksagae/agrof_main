// AGROF Store API Service
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORE_API_URL, CACHE_DURATION, API_TIMEOUT } from '../config/apiConfig';

// Backend API configuration - Single local address
const API_BASE_URL = STORE_API_URL; // Store backend API
let currentApiUrl = API_BASE_URL;

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
  console.log(`🔍 Testing API URL: ${API_BASE_URL}`);
  const isWorking = await testApiConnection(API_BASE_URL);
  if (isWorking) {
    console.log(`✅ Found working API URL: ${API_BASE_URL}`);
    return API_BASE_URL;
  }
  throw new Error('API connection failed');
};

// Generic API request function with improved error handling
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🌐 API Request: ${url}`);
    console.log(`🔍 Current API_BASE_URL: ${API_BASE_URL}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT); // Use centralized timeout
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.log(`❌ HTTP error! status: ${response.status} for ${url}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ API Response: ${endpoint} - ${data.length || 'N/A'} items`);
    return data;
  } catch (error) {
    console.error(`❌ API request failed for ${endpoint} with ${API_BASE_URL}:`, error);
    console.error(`❌ Error details:`, error.message);
    
    // Check if it's a network error
    if (error.name === 'AbortError' || error.message.includes('Network request failed')) {
      console.log('🔄 Network error detected, using offline fallback...');
      throw new Error('NETWORK_ERROR');
    }
    
    throw error;
  }
};

// Categories API
export const categoriesApi = {
  // Get all categories
  getAll: async (language = 'en') => {
    const cacheKey = `categories_all_${language}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const data = await apiRequest(`/categories?language=${language}`);
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
  getProducts: async (categoryName, language = 'en') => {
    const cacheKey = `category_products_${categoryName}_${language}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const data = await apiRequest(`/categories/${categoryName}/products?language=${language}`);
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
    const { search, category, limit = 500, offset = 0, language = 'en' } = params;
    const cacheKey = `products_all_${JSON.stringify(params)}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (language) queryParams.append('language', language);
      if (category) queryParams.append('category', category);
      if (limit) queryParams.append('limit', limit);
      if (offset) queryParams.append('offset', offset);

      const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const data = await apiRequest(endpoint);
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch all products:', error);
      console.log('🔄 Using offline products fallback...');
      
      // Return offline fallback products
      const offlineProducts = [
        {
          id: 'offline-1',
          name: 'General Fertilizer',
          category_name: 'fertilizers',
          selling_price: 50000,
          description: 'General purpose fertilizer for plant nutrition',
          image_url: null
        },
        {
          id: 'offline-2',
          name: 'Fungicide Treatment',
          category_name: 'fungicides',
          selling_price: 75000,
          description: 'Broad spectrum fungicide for disease control',
          image_url: null
        },
        {
          id: 'offline-3',
          name: 'Organic Pesticide',
          category_name: 'organic_chemicals',
          selling_price: 60000,
          description: 'Organic pest control solution',
          image_url: null
        },
        {
          id: 'offline-4',
          name: 'Herbicide Control',
          category_name: 'herbicides',
          selling_price: 45000,
          description: 'Weed control herbicide',
          image_url: null
        },
        {
          id: 'offline-5',
          name: 'Quality Seeds',
          category_name: 'seeds',
          selling_price: 30000,
          description: 'High-quality crop seeds',
          image_url: null
        },
        {
          id: 'offline-6',
          name: 'Nursery Soil',
          category_name: 'nursery_bed',
          selling_price: 25000,
          description: 'Premium nursery soil mix',
          image_url: null
        }
      ];
      
      console.log(`📦 Offline products loaded: ${offlineProducts.length} products`);
      return offlineProducts;
    }
  },

  // Get single product
  getById: async (id, language = 'en') => {
    const cacheKey = `product_${id}_${language}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const data = await apiRequest(`/products/${id}?language=${language}`);
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
      if (error.message === 'NETWORK_ERROR') {
        console.log('🔄 Cart unavailable due to network error, item not added...');
        return { success: false, message: 'Cart unavailable' };
      }
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
      if (error.message === 'NETWORK_ERROR') {
        console.log('🔄 Cart unavailable due to network error, returning empty cart...');
        return [];
      }
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
      if (error.message === 'NETWORK_ERROR') {
        console.log('🔄 Cart unavailable due to network error, quantity not updated...');
        return { success: false, message: 'Cart unavailable' };
      }
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
      if (error.message === 'NETWORK_ERROR') {
        console.log('🔄 Cart unavailable due to network error, item not removed...');
        return { success: false, message: 'Cart unavailable' };
      }
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
      if (error.message === 'NETWORK_ERROR') {
        console.log('🔄 Cart unavailable due to network error, cart not cleared...');
        return { success: false, message: 'Cart unavailable' };
      }
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
  currentApiUrl = API_BASE_URL;
  console.log(`🔄 API URL reset to: ${currentApiUrl}`);
};

// Clear cached API URL and force reconnection
export const clearApiCache = async () => {
  try {
    await AsyncStorage.removeItem('store_api_url');
    currentApiUrl = API_BASE_URL;
    console.log('🧹 API cache cleared, using:', currentApiUrl);
    console.log('🔄 Forcing API reconnection...');
    
    // Test the connection immediately
    const isWorking = await testApiConnection(API_BASE_URL);
    if (isWorking) {
      console.log('✅ API reconnection successful');
      return { success: true };
    } else {
      console.log('❌ API reconnection failed');
      return { success: false, error: 'Connection failed' };
    }
  } catch (error) {
    console.error('Error clearing API cache:', error);
    return { success: false, error: error.message };
  }
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


// Test API URL and return working status
export const testAllApiUrls = async () => {
  const isWorking = await testApiConnection(API_BASE_URL);
  return isWorking ? [API_BASE_URL] : [];
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
