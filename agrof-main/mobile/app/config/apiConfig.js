/**
 * AGROF API Configuration
 * Centralized configuration for all API endpoints
 * Uses single consistent address: 192.168.0.107
 */

// Base IP address for all services
const BASE_IP = '192.168.0.107';

// API Configuration
export const API_CONFIG = {
  // Store Backend API
  STORE: {
    BASE_URL: `http://${BASE_IP}:3001`,
    API_URL: `http://${BASE_IP}:3001/api`,
    ENDPOINTS: {
      PRODUCTS: '/products',
      CATEGORIES: '/categories',
      CART: '/cart',
      SEARCH: '/search',
      HEALTH: '/health',
      IMAGES: '/images'
    }
  },
  
  // AI Backend API
  AI: {
    BASE_URL: `http://${BASE_IP}:5000`,
    API_URL: `http://${BASE_IP}:5000/api`,
    ENDPOINTS: {
      ANALYZE_DISEASE: '/ai-analyze-disease',
      HEALTH: '/health'
    }
  }
};

// Timeout Configuration
export const TIMEOUT_CONFIG = {
  API_REQUEST: 5000, // 5 seconds
  AI_ANALYSIS: 10000, // 10 seconds for AI analysis
  IMAGE_LOAD: 3000 // 3 seconds for image loading
};

// Cache Configuration
export const CACHE_CONFIG = {
  DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_SIZE: 100 // Maximum number of cached items
};

// Network Configuration
export const NETWORK_CONFIG = {
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  OFFLINE_FALLBACK: true
};

// Export individual configurations for easy access
export const STORE_API_URL = API_CONFIG.STORE.API_URL;
export const AI_API_URL = API_CONFIG.AI.API_URL;
export const STORE_BASE_URL = API_CONFIG.STORE.BASE_URL;
export const AI_BASE_URL = API_CONFIG.AI.BASE_URL;

// Export timeout values
export const API_TIMEOUT = TIMEOUT_CONFIG.API_REQUEST;
export const AI_TIMEOUT = TIMEOUT_CONFIG.AI_ANALYSIS;
export const IMAGE_TIMEOUT = TIMEOUT_CONFIG.IMAGE_LOAD;

// Export cache duration
export const CACHE_DURATION = CACHE_CONFIG.DURATION;

// Export network settings
export const RETRY_ATTEMPTS = NETWORK_CONFIG.RETRY_ATTEMPTS;
export const RETRY_DELAY = NETWORK_CONFIG.RETRY_DELAY;
export const OFFLINE_FALLBACK = NETWORK_CONFIG.OFFLINE_FALLBACK;

// Helper function to get full API URL
export const getApiUrl = (service, endpoint) => {
  const config = API_CONFIG[service.toUpperCase()];
  if (!config) {
    throw new Error(`Unknown service: ${service}`);
  }
  return `${config.API_URL}${endpoint}`;
};

// Helper function to get store API URL
export const getStoreApiUrl = (endpoint) => {
  return getApiUrl('STORE', endpoint);
};

// Helper function to get AI API URL
export const getAiApiUrl = (endpoint) => {
  return getApiUrl('AI', endpoint);
};

// Helper function to get image URL
export const getImageUrl = (imagePath) => {
  return `${API_CONFIG.STORE.BASE_URL}${imagePath}`;
};

// Export default configuration
export default {
  API_CONFIG,
  TIMEOUT_CONFIG,
  CACHE_CONFIG,
  NETWORK_CONFIG,
  getApiUrl,
  getStoreApiUrl,
  getAiApiUrl,
  getImageUrl
};
