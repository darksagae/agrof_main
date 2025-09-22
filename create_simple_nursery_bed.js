// Create a simple, working nursery bed screen
const fs = require('fs');

const nurserySimplePath = '/home/darksagae/Desktop/agrof-main/agrof-main/mobile/app/assets/NURSERY_BED_SIMPLE';
const files = fs.readdirSync(nurserySimplePath);

// Product names mapping
const productNames = [
  'Oregano Seedling',
  'Lemon Grass (Kisubi)', 
  'Strawberry Chandler Seedlings',
  'Musakala',
  'Kibuzi - Banana T.c Plantlet',
  'Coriander Seedlings',
  'Sweet Basil Seedling (Mujaaja)',
  'Parsley Seedling',
  'Celery Seedling',
  'Atwalira - Banana T.c Plantlet',
  'Pineapple Mint Seedling',
  'Lemon Balm Seedling',
  'M3 Banana Suckers',
  'Nakatansese - Banana T.c Plantlet',
  'Mbwazirume-banana T.c Plantlet',
  'Chocolate Mint Seedling',
  'Aloe Vera Seedling',
  'Mint Seedling',
  'Bogoya (Gros Michel) - Banana T.c Plantlet',
  'Cinnamon Seedling',
  'Kisansa - Banana T.c Plantlet',
  'Mpologoma-banana T.c Plantlet',
  'Rosemary Seedling'
];

console.log(`import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import NurseryBedDetailScreen from './NurseryBedDetailScreen';
import SimplePricingWidget from '../components/SimplePricingWidget';

const { width } = Dimensions.get('window');

const NurseryBedScreen = ({ onBack }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pricingWidgetVisible, setPricingWidgetVisible] = useState(false);
  const [selectedProductForPricing, setSelectedProductForPricing] = useState(null);
  const [imageLoadingStates, setImageLoadingStates] = useState({});

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
      const match = firstPrice.match(/(\\d+(?:\\.\\d+)?)\\s*([a-zA-Z]+):\\s*UGX\\s*([\\d,]+)/i);
      if (match) {
        const [, quantity, unit, price] = match;
        const pricePerUnit = parseInt(price.replace(/,/g, '')) / parseFloat(quantity);
        return \`From UGX \${pricePerUnit.toFixed(0)} per \${unit}\`;
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

  // Import all nursery bed images from simplified folder structure
  const nurseryImages = {`);

files.forEach((file, index) => {
  const nameWithoutExt = file.replace(/\.[^/.]+$/, "");
  console.log(`    '${nameWithoutExt}': require('../assets/NURSERY_BED_SIMPLE/${file}'),`);
});

console.log(`  };

  const nurseryProducts = [`);

files.forEach((file, index) => {
  const nameWithoutExt = file.replace(/\.[^/.]+$/, "");
  const productName = productNames[index] || `Nursery Product ${index + 1}`;
  
  console.log(`    {`);
  console.log(`      id: ${index + 1},`);
  console.log(`      name: '${productName}',`);
  console.log(`      image: nurseryImages['${nameWithoutExt}'],`);
  console.log(`      description: 'High-quality nursery bed product for agricultural use.',`);
  console.log(`      price: 'Contact for pricing',`);
  console.log(`      packaging: 'Contact for pricing',`);
  console.log(`      category: 'Nursery Bed',`);
  console.log(`      manufacturer: 'Contact for details',`);
  console.log(`      activeIngredient: 'Contact for details',`);
  console.log(`      formulation: 'Contact for details',`);
  console.log(`      targetCrops: 'Contact for details',`);
  console.log(`      targetWeeds: 'Contact for details',`);
  console.log(`      applicationMethod: 'Contact for details',`);
  console.log(`      preHarvestInterval: 'Contact for details'`);
  console.log(`    }${index === files.length - 1 ? '' : ','}`);
});

console.log(`  ];

  console.log('🌱 NurseryBedScreen: Rendering with', nurseryProducts.length, 'products');

  // Optimized product rendering with memoization
  const renderProduct = useCallback(({ item: product }) => (
    <View style={styles.productItem}>
      {imageLoadingStates[product.id] && (
        <ActivityIndicator
          size="small"
          color="#4CAF50"
          style={styles.imageLoader}
        />
      )}
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => setSelectedProduct(product)}
        activeOpacity={0.8}
      >
        <Image
          source={product.image}
          style={styles.productImage}
          resizeMode="cover"
          onLoadStart={() => handleImageLoadStart(product.id)}
          onLoad={() => handleImageLoad(product.id)}
          onError={() => {
            console.log('Image load error for product:', product.name);
            handleImageLoad(product.id);
          }}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {product.description}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>
              {hasMultiplePrices(product) ? getUnitPrice(product) : product.price}
            </Text>
            {hasMultiplePrices(product) && (
              <TouchableOpacity
                style={styles.pricingButton}
                onPress={() => handlePricingPress(product)}
              >
                <Text style={styles.pricingButtonText}>View Prices</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  ), [imageLoadingStates, handleImageLoad, handleImageLoadStart]);

  // Memoized key extractor
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // Memoized getItemLayout for better performance
  const getItemLayout = useCallback((data, index) => ({
    length: 200, // Approximate item height
    offset: 200 * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nursery Bed Products</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={nurseryProducts}
        renderItem={renderProduct}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={styles.productsGrid}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        getItemLayout={getItemLayout}
      />

      {selectedProduct && (
        <NurseryBedDetailScreen
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {pricingWidgetVisible && selectedProductForPricing && (
        <SimplePricingWidget
          product={selectedProductForPricing}
          onClose={() => {
            setPricingWidgetVisible(false);
            setSelectedProductForPricing(null);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  productsGrid: {
    padding: 16,
    paddingBottom: 100,
  },
  productItem: {
    flex: 1,
    margin: 8,
    maxWidth: (width - 48) / 2,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F5F5F5',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
    lineHeight: 18,
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
    flex: 1,
  },
  pricingButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pricingButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  imageLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    zIndex: 1,
  },
});

export default NurseryBedScreen;`);
