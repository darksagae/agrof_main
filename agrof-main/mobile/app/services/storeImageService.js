/**
 * Store Image Service
 * Handles proper image fetching from assets/store/category/product/image structure
 */

import { STORE_BASE_URL } from '../config/apiConfig';

class StoreImageService {
  constructor() {
    this.baseUrl = STORE_BASE_URL;
    this.imageCache = new Map();
    this.fallbackImages = {
      'fertilizers': require('../assets/fertilizers.png'),
      'fungicides': require('../assets/fungicides.png'),
      'herbicides': require('../assets/herbicides.png'),
      'nursery_bed': require('../assets/nurserybed.png'),
      'organic_chemicals': require('../assets/organic_chemicals.png'),
      'seeds': require('../assets/seeds.png'),
    };
  }

  /**
   * Get product image with proper fallback system
   * @param {Object} product - Product object
   * @returns {Object} Image source object
   */
  getProductImage(product) {
    if (!product) {
      return this.getFallbackImage('fertilizers');
    }

    console.log('🖼️ Getting image for product:', product.name);
    console.log('🖼️ Product category:', product.category_name);

    // Try multiple image sources in order of preference
    const imageSources = this.getImageSources(product);
    
    for (const source of imageSources) {
      if (source) {
        console.log('✅ Using image source:', source);
        return source;
      }
    }

    // Final fallback
    console.log('🔄 Using fallback image for category:', product.category_name);
    return this.getFallbackImage(product.category_name);
  }

  /**
   * Get all possible image sources for a product
   * @param {Object} product - Product object
   * @returns {Array} Array of image sources
   */
  getImageSources(product) {
    const sources = [];

    // 1. Direct HTTP URL if available
    if (product.image_url && product.image_url.startsWith('http')) {
      sources.push({ uri: product.image_url });
    }

    // 2. Full image URL if available
    if (product.full_image_url && product.full_image_url.startsWith('http')) {
      sources.push({ uri: product.full_image_url });
    }

    // 3. Backend API image URL
    if (product.image_url && !product.image_url.startsWith('http')) {
      sources.push({ uri: `${this.baseUrl}${product.image_url}` });
    }

    // 4. Constructed store image URLs with different extensions (only if no database URL)
    if (!product.image_url && product.category_name && product.name) {
      const category = product.category_name.toUpperCase();
      const productName = this.sanitizeProductName(product.name);
      
      // Try different file extensions
      const extensions = ['jpg', 'jpeg', 'png'];
      for (const ext of extensions) {
        sources.push({ 
          uri: `${this.baseUrl}/api/images/${category}/${productName}.${ext}` 
        });
      }
    }

    // 5. Local assets path (for development) - removed dynamic require
    // Note: Dynamic require() doesn't work in React Native
    // Local assets should be imported statically at the top of files

    return sources;
  }

  /**
   * Sanitize product name for file system compatibility
   * @param {string} name - Product name
   * @returns {string} Sanitized name
   */
  sanitizeProductName(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
  }

  /**
   * Get fallback image for category
   * @param {string} categoryName - Category name
   * @returns {Object} Fallback image source
   */
  getFallbackImage(categoryName) {
    const category = categoryName?.toLowerCase();
    return this.fallbackImages[category] || this.fallbackImages['fertilizers'];
  }

  /**
   * Get category image with backend API fetching
   * @param {string} categoryName - Category name
   * @returns {Object} Category image source
   */
  getCategoryImage(categoryName) {
    console.log('🖼️ Getting category image for:', categoryName);
    
    // Use static assets directly for category images (no backend API needed)
    console.log('🔄 Using static category image for:', categoryName);
    return this.getFallbackImage(categoryName);
  }

  /**
   * Get all possible category image sources
   * @param {string} categoryName - Category name
   * @returns {Array} Array of image sources
   */
  getCategoryImageSources(categoryName) {
    const sources = [];
    const category = categoryName?.toLowerCase();

    // 1. Try backend API category image endpoint
    if (category) {
      const extensions = ['jpg', 'jpeg', 'png'];
      for (const ext of extensions) {
        sources.push({
          uri: `${this.baseUrl}/api/images/categories/${category}.${ext}`
        });
      }
    }

    // 2. Try constructed store category image path
    if (category) {
      const extensions = ['jpg', 'jpeg', 'png'];
      for (const ext of extensions) {
        sources.push({
          uri: `${this.baseUrl}/api/images/${category.toUpperCase()}/category.${ext}`
        });
      }
    }

    return sources;
  }

  /**
   * Preload images for better performance
   * @param {Array} products - Array of products
   */
  async preloadImages(products) {
    const imagePromises = products.map(product => {
      const imageSource = this.getProductImage(product);
      if (imageSource.uri) {
        return this.preloadImage(imageSource.uri);
      }
      return Promise.resolve();
    });

    await Promise.allSettled(imagePromises);
  }

  /**
   * Preload single image (React Native compatible)
   * @param {string} imageUrl - Image URL
   * @returns {Promise} Preload promise
   */
  preloadImage(imageUrl) {
    // For React Native, we'll use Image.prefetch from react-native
    // This should be called from components that import Image from react-native
    return Promise.resolve(imageUrl);
  }

  /**
   * Check if image exists
   * @param {string} imageUrl - Image URL
   * @returns {Promise<boolean>} Whether image exists
   */
  async checkImageExists(imageUrl) {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.log('❌ Image check failed:', imageUrl, error.message);
      return false;
    }
  }

  /**
   * Get optimized image URL with compression
   * @param {string} originalUrl - Original image URL
   * @param {Object} options - Optimization options
   * @returns {string} Optimized URL
   */
  getOptimizedImageUrl(originalUrl, options = {}) {
    const { width = 300, height = 300, quality = 80 } = options;
    
    if (originalUrl.includes(this.baseUrl)) {
      return `${originalUrl}?w=${width}&h=${height}&q=${quality}`;
    }
    
    return originalUrl;
  }
}

// Export singleton instance
export default new StoreImageService();
