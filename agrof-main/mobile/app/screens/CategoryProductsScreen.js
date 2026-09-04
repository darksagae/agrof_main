import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { productsApi } from '../services/storeApi';
import hybridStoreApi from '../services/hybridStoreApi';
import networkManager from '../services/networkManager';
import imageCacheService from '../services/imageCacheService';
import storeImageService from '../services/storeImageService';
import OptimizedImage from '../components/OptimizedImage';
import ProductDetailScreen from './ProductDetailScreen';

const CategoryProductsScreen = ({ categoryName, categoryDisplayName, onBack }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);

  // Load products for this category
  useEffect(() => {
    loadCategoryProducts();
  }, [categoryName]);

  // Preload images when products are loaded and online
  useEffect(() => {
    if (products.length > 0) {
      const networkStatus = networkManager.getStatus();
      if (networkStatus.isOnline) {
        console.log(`📸 Caching images for ${products.length} ${categoryName} products...`);
        imageCacheService.preloadProductImages(products, 200)
          .then(() => console.log('✅ Category images cached'))
          .catch(err => console.warn('⚠️ Image cache error:', err.message));
      }
    }
  }, [products, categoryName]);

  const loadCategoryProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use hybrid API for offline support
      console.log(`🔄 Loading ${categoryName} products with hybrid API...`);
      const result = await hybridStoreApi.getProducts({ category: categoryName, limit: 500 });
      
      console.log(`📦 ${categoryName} products loaded from ${result.source}: ${result.data.length} items`);
      console.log(`💾 Data used: ${result.dataUsed || 0} KB`);
      
      setProducts(result.data);
    } catch (err) {
      console.error(`Failed to load ${categoryName} products:`, err);
      setError('Failed to load products. Using offline data...');
      // Don't show alert - just continue with offline data
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  const handleBackToProducts = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard} 
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <OptimizedImage 
          product={item}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>
          {item.price || 'Contact for pricing'}
        </Text>
        <Text style={styles.productCategory}>
          {item.category_display_name || categoryDisplayName}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="inventory" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No Products Found</Text>
      <Text style={styles.emptySubtitle}>
        No products available in {categoryDisplayName} category.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadCategoryProducts}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="error-outline" size={80} color="#FF5722" />
      <Text style={styles.emptyTitle}>Error Loading Products</Text>
      <Text style={styles.emptySubtitle}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadCategoryProducts}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  // If a product is selected, show product detail screen
  if (selectedProduct) {
    return (
      <ProductDetailScreen 
        route={{ params: { productId: selectedProduct.id, product: selectedProduct } }}
        navigation={{ goBack: handleBackToProducts }}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{categoryDisplayName}</Text>
          <Text style={styles.headerSubtitle}>
            {products.length} products available
          </Text>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : error ? (
        renderErrorState()
      ) : products.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
        />
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#2c5530',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  productsList: {
    padding: 10,
  },
  productCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 8,
    lineHeight: 20,
  },
  productPrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CategoryProductsScreen;
