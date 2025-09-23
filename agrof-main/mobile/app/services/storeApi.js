// AGROF Store API Service
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend API configuration
const API_BASE_URL = 'http://192.168.1.14:3001/api'; // Use your computer's IP address for mobile access
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

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
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
  getCacheStats
};
