import { Image } from 'react-native';

// Simple in-memory image cache
const imageCache = new Map();
const MAX_CACHE_SIZE = 50;

// Preload and cache images
export const preloadImage = (source) => {
  const cacheKey = typeof source === 'string' ? source : JSON.stringify(source);
  
  if (imageCache.has(cacheKey)) {
    return Promise.resolve(imageCache.get(cacheKey));
  }

  return new Promise((resolve, reject) => {
    Image.prefetch(source)
      .then(() => {
        // Cache the source
        if (imageCache.size >= MAX_CACHE_SIZE) {
          // Remove oldest entry
          const firstKey = imageCache.keys().next().value;
          imageCache.delete(firstKey);
        }
        imageCache.set(cacheKey, source);
        resolve(source);
      })
      .catch(reject);
  });
};

// Batch preload images
export const preloadImages = (sources) => {
  const promises = sources.map(source => preloadImage(source));
  return Promise.allSettled(promises);
};

// Get cached image
export const getCachedImage = (source) => {
  const cacheKey = typeof source === 'string' ? source : JSON.stringify(source);
  return imageCache.get(cacheKey);
};

// Clear cache
export const clearImageCache = () => {
  imageCache.clear();
};

// Get cache stats
export const getImageCacheStats = () => {
  return {
    size: imageCache.size,
    maxSize: MAX_CACHE_SIZE,
    keys: Array.from(imageCache.keys()),
  };
};
