import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import SeedsDetailScreen from './SeedsDetailScreen';
import SimplePricingWidget from '../components/SimplePricingWidget';

const { width } = Dimensions.get('window');

const SeedsProductsScreen = ({ onBack }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pricingWidgetVisible, setPricingWidgetVisible] = useState(false);
  const [selectedProductForPricing, setSelectedProductForPricing] = useState(null);
  const { addToCart } = useCart();

  // Empty products array - store is currently empty
  const seedsProducts = [];
  
  console.log('🌱 SeedsProductsScreen: Rendering with', seedsProducts.length, 'products');

  // Helper function to check if product has multiple prices
  const hasMultiplePrices = (product) => {
    if (!product.packaging || typeof product.packaging !== 'string') {
      return false;
    }
    return product.packaging.includes(',') && product.packaging.includes('UGX');
  };

  // Helper function to get unit price for display
  const getUnitPrice = (product) => {
    if (!product.packaging || typeof product.packaging !== 'string') {
      return product.price || 'Price not available';
    }

    const priceRanges = product.packaging.split(',').map(item => item.trim());
    if (priceRanges.length > 0) {
      const firstPrice = priceRanges[0];
      const match = firstPrice.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+):\s*UGX\s*([\d,]+)/i);
      if (match) {
        const [, quantity, unit, price] = match;
        const pricePerUnit = parseInt(price.replace(/,/g, '')) / parseFloat(quantity);
        return `From UGX ${pricePerUnit.toFixed(0)} per ${unit}`;
      }
    }
    return product.price || 'Price not available';
  };

  // Handle pricing widget
  const handlePricingPress = (product) => {
    setSelectedProductForPricing(product);
    setPricingWidgetVisible(true);
  };

  // Optimized image loading handlers
  const handleImageLoad = useCallback((productId) => {
    setImageLoadingStates(prev => ({ ...prev, [productId]: false }));
  }, []);

  const handleImageLoadStart = useCallback((productId) => {
    setImageLoadingStates(prev => ({ ...prev, [productId]: true }));
  }, []);

  // Seeds images have been removed - using placeholder
  const seedsImages = {};
  // Optimized product rendering with memoization
  const renderProduct = useCallback(({ item: product }) => {
    const imageSource = seedsImages[product.name] || seedsImages['Sugar Baby Watermelon'];
    
    return (
      <TouchableOpacity 
        style={styles.productItem}
        onPress={() => {
          console.log('🌱 Product selected:', product.name);
          setSelectedProduct(product);
        }}
      >
        {imageLoadingStates[product.id] && (
          <View style={styles.imageLoader}>
            <ActivityIndicator size="small" color="#2c5530" />
          </View>
        )}
        <Image 
          source={imageSource}
          style={styles.productImage}
          resizeMode="cover"
          onLoadStart={() => handleImageLoadStart(product.id)}
          onLoad={() => handleImageLoad(product.id)}
          onError={(error) => {
            console.log('❌ Image load error for product', product.id, ':', error);
            handleImageLoad(product.id);
          }}
        />
        
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
          {product.name}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {hasMultiplePrices(product) ? getUnitPrice(product) : product.price}
          </Text>
          {product.availability === 'Out of stock' && (
            <Text style={styles.outOfStock}>Out of Stock</Text>
          )}
        </View>
        
        <Text style={styles.manufacturer} numberOfLines={1}>
          by {product.manufacturer}
        </Text>
      </TouchableOpacity>
    );
  }, [imageLoadingStates, handleImageLoad, handleImageLoadStart, hasMultiplePrices, getUnitPrice]);

  // Show detail screen if product is selected
  if (selectedProduct) {
    return (
      <SeedsDetailScreen 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)}
        onViewPackages={handlePricingPress}
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
          <Text style={styles.headerTitle}>Seed Products</Text>
        </View>
        <Text style={styles.headerSubtitle}>Complete range of agricultural seeds</Text>
      </View>

      {/* Products Grid - Optimized FlatList */}
      <FlatList
        data={seedsProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        numColumns={2}
        style={styles.productsContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={6}
        windowSize={10}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        getItemLayout={(data, index) => ({
          length: 320,
          offset: 320 * Math.floor(index / 2),
          index,
        })}
      />

      {/* Pricing Widget */}
      {selectedProductForPricing && (
        <SimplePricingWidget
          visible={pricingWidgetVisible}
          onClose={() => setPricingWidgetVisible(false)}
          product={selectedProductForPricing}
        />
      )}
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
    flex: 1,
    padding: 5,
    backgroundColor: 'white',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%',
    marginBottom: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 0,
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
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 0,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  imageLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    zIndex: 1,
  },
  outOfStock: {
    fontSize: 12,
    color: '#e74c3c',
    textAlign: 'center',
  },
  manufacturer: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
});

export default SeedsProductsScreen;
