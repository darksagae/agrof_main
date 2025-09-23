// Centralized product data management for better performance
import { Image } from 'react-native';

// Image preloading utility
export const preloadImages = (imageSources) => {
  const preloadPromises = imageSources.map(source => {
    return new Promise((resolve, reject) => {
      Image.prefetch(source).then(resolve).catch(reject);
    });
  });
  
  return Promise.allSettled(preloadPromises);
};

// Product data cache
const productCache = new Map();

// Generic product data structure
export const createProductData = (products, category) => {
  const cacheKey = `${category}_products`;
  
  if (productCache.has(cacheKey)) {
    return productCache.get(cacheKey);
  }

  const processedProducts = products.map(product => ({
    ...product,
    category,
    // Add any common processing here
    displayPrice: product.price || 'Contact for pricing',
    isAvailable: product.availability !== 'Out of stock',
  }));

  productCache.set(cacheKey, processedProducts);
  return processedProducts;
};

// Image source resolver
export const getImageSource = (imageName, fallbackImage, imageMap = {}) => {
  if (imageMap[imageName]) {
    return imageMap[imageName];
  }
  return fallbackImage;
};

// Performance optimized product filtering
export const filterProducts = (products, filters = {}) => {
  if (!filters || Object.keys(filters).length === 0) {
    return products;
  }

  return products.filter(product => {
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    if (filters.priceRange) {
      const price = parseFloat(product.price?.replace(/[^\d.]/g, '') || 0);
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        return false;
      }
    }
    if (filters.availability && product.isAvailable !== filters.availability) {
      return false;
    }
    return true;
  });
};

// Batch processing for large product lists
export const processProductsInBatches = (products, batchSize = 10, processor) => {
  const batches = [];
  for (let i = 0; i < products.length; i += batchSize) {
    batches.push(products.slice(i, i + batchSize));
  }
  
  return batches.map(batch => batch.map(processor));
};

// Clear cache when needed
export const clearProductCache = () => {
  productCache.clear();
};

// Get cache statistics
export const getCacheStats = () => {
  return {
    size: productCache.size,
    keys: Array.from(productCache.keys()),
  };
};
