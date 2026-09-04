import React, { useState, useEffect } from 'react';
import { Image, View, ActivityIndicator, StyleSheet } from 'react-native';
import storeImageService from '../services/storeImageService';
import imageCacheService from '../services/imageCacheService';

const OptimizedImage = ({ 
  product, 
  style, 
  fallbackStyle,
  showLoadingIndicator = true,
  resizeMode = 'cover',
  ...props 
}) => {
  const [imageSource, setImageSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadImage();
  }, [product]);

  const loadImage = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const source = storeImageService.getOptimizedImageSource(product);
      
      // If we have a URI, try to get cached version
      if (source && source.uri) {
        const cachedUri = await imageCacheService.getCachedImage(source.uri);
        setImageSource({ uri: cachedUri });
      } else if (source) {
        setImageSource(source);
      } else {
        setImageSource(null);
      }
      
      setLoading(false);
    } catch (err) {
      console.warn('Image loading error:', err);
      setError(true);
      setLoading(false);
    }
  };

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setError(true);
    setLoading(false);
  };

  if (loading && showLoadingIndicator) {
    return (
      <View style={[style, styles.loadingContainer]}>
        <ActivityIndicator size="small" color="#4CAF50" />
      </View>
    );
  }

  if (error || !imageSource) {
    // NO FALLBACK - Hide image when real product image is not available
    // This prevents showing misleading generic category images
    return null;
  }

  return (
    <Image
      source={imageSource}
      style={style}
      resizeMode={resizeMode}
      onLoad={handleImageLoad}
      onError={handleImageError}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default OptimizedImage;