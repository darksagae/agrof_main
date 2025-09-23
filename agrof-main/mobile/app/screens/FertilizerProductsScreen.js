import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FertilizerDetailScreen from './FertilizerDetailScreen';
import { createProductData, getImageSource } from '../utils/productDataManager';
import { preloadImages } from '../utils/imageCache';

const FertilizerProductsScreen = ({ onBack }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Fertilizer images have been removed - using placeholder
  const fertilizerImages = {};
  // Get image source from static mapping
  const getImageSourceLocal = (imageName) => {
    return fertilizerImages[imageName] || require('../assets/fertilizers.png');
  };

  // Empty products array - store is currently empty
  const fertilizerProducts = useMemo(() => createProductData([], 'fertilizers'), []);

  // Preload images on component mount
  useEffect(() => {
    const imageSources = fertilizerProducts
      .map(product => getImageSourceLocal(product.imageName))
      .filter(Boolean);
    
    if (imageSources.length > 0) {
      preloadImages(imageSources).catch(console.warn);
    }
  }, [fertilizerProducts]);

  // Render item component with performance optimizations
  const renderProduct = useCallback(({ item }) => (
    <TouchableOpacity 
      key={item.id}
      style={styles.productItem}
      onPress={() => setSelectedProduct({ ...item, image: getImageSourceLocal(item.imageName) })}
    >
      <Image 
        source={getImageSourceLocal(item.imageName)}
        style={styles.productImage} 
        resizeMode="cover"
        fadeDuration={0}
      />
      <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </Text>
      <Text style={styles.productPrice} numberOfLines={1} ellipsizeMode="tail">
        {item.price || 'Contact for pricing'}
      </Text>
      <Text style={styles.productDescription} numberOfLines={2} ellipsizeMode="tail">
        {item.description}
      </Text>
    </TouchableOpacity>
  ), []);

  // Show detail screen if product is selected
  if (selectedProduct) {
    return (
      <FertilizerDetailScreen 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)}
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
        <View style={styles.headerTitleContainer}>
          <MaterialIcons name="eco" size={32} color="white" />
          <Text style={styles.headerTitle}>Fertilizer Products</Text>
        </View>
        <Text style={styles.headerSubtitle}>Complete range of agricultural fertilizers</Text>
      </View>

      {/* Products List with FlatList for better performance */}
      <FlatList
        data={fertilizerProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productsContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={6}
        windowSize={5}
        initialNumToRender={4}
        updateCellsBatchingPeriod={50}
        getItemLayout={(data, index) => ({
          length: 200,
          offset: 200 * Math.floor(index / 2),
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#2c5530',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    zIndex: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  productsContainer: {
    padding: 5,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  productItem: {
    width: '48%',
    marginBottom: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 0,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 1,
  },
  productImage: {
    width: '100%',
    height: 150,
  },
  productName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 2,
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 16,
  },
  productPrice: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 0,
  },
  productDescription: {
    fontSize: 10,
    color: '#666',
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 0,
  },
});

export default FertilizerProductsScreen;