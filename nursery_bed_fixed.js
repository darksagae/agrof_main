import React, { useState, useCallback } from 'react';
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

  // Import all nursery bed images from simplified folder structure
  const nurseryImages = {
    'aloe_vera_seedling': require('../assets/NURSERY_BED_SIMPLE/aloe_vera_seedling.jpg'),
    'atwalira_banana_t_c_plantlet': require('../assets/NURSERY_BED_SIMPLE/atwalira_banana_t_c_plantlet.jpg'),
    'bogoya_gros_michel_banana_t_c_plantlet': require('../assets/NURSERY_BED_SIMPLE/bogoya_gros_michel_banana_t_c_plantlet.jpg'),
    'celery_seedling': require('../assets/NURSERY_BED_SIMPLE/celery_seedling.jpg'),
    'chocolate_mint_seedling': require('../assets/NURSERY_BED_SIMPLE/chocolate_mint_seedling.jpg'),
    'cinnamon_seedling': require('../assets/NURSERY_BED_SIMPLE/cinnamon_seedling.jpg'),
    'coriander_seedlings': require('../assets/NURSERY_BED_SIMPLE/coriander_seedlings.jpg'),
    'kibuzi_banana_t_c_plantlet': require('../assets/NURSERY_BED_SIMPLE/kibuzi_banana_t_c_plantlet.jpg'),
    'kisansa_banana_t_c_plantlet': require('../assets/NURSERY_BED_SIMPLE/kisansa_banana_t_c_plantlet.jpg'),
    'lemon_balm_seedling': require('../assets/NURSERY_BED_SIMPLE/lemon_balm_seedling.jpg'),
    'lemon_grass_kisubi': require('../assets/NURSERY_BED_SIMPLE/lemon_grass_kisubi.jpg'),
    'm3_banana_suckers': require('../assets/NURSERY_BED_SIMPLE/m3_banana_suckers.jpg'),
    'mbwazirume_banana_t_c_plantlet': require('../assets/NURSERY_BED_SIMPLE/mbwazirume_banana_t_c_plantlet.jpg'),
    'mint_seedling': require('../assets/NURSERY_BED_SIMPLE/mint_seedling.jpg'),
    'mpologoma_banana_t_c_plantlet': require('../assets/NURSERY_BED_SIMPLE/mpologoma_banana_t_c_plantlet.jpg'),
    'musakala': require('../assets/NURSERY_BED_SIMPLE/musakala.jpg'),
    'nakatansese_banana_t_c_plantlet': require('../assets/NURSERY_BED_SIMPLE/nakatansese_banana_t_c_plantlet.jpg'),
    'oregano_seedling': require('../assets/NURSERY_BED_SIMPLE/oregano_seedling.jpg'),
    'parsley_seedling': require('../assets/NURSERY_BED_SIMPLE/parsley_seedling.jpg'),
    'pineapple_mint_seedling': require('../assets/NURSERY_BED_SIMPLE/pineapple_mint_seedling.jpg'),
    'rosemary_seedling': require('../assets/NURSERY_BED_SIMPLE/rosemary_seedling.jpg'),
    'strawberry_chandler_seedlings': require('../assets/NURSERY_BED_SIMPLE/strawberry_chandler_seedlings.jpg'),
    'sweet_basil_seedling_mujaaja': require('../assets/NURSERY_BED_SIMPLE/sweet_basil_seedling_mujaaja.jpg'),
  };

  const nurseryProducts = [
    {
      id: 1,
      name: 'Oregano Seedling',
      image: nurseryImages['aloe_vera_seedling'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 2,
      name: 'Lemon Grass (Kisubi)',
      image: nurseryImages['atwalira_banana_t_c_plantlet'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 3,
      name: 'Strawberry Chandler Seedlings',
      image: nurseryImages['bogoya_gros_michel_banana_t_c_plantlet'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 4,
      name: 'Musakala',
      image: nurseryImages['celery_seedling'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 5,
      name: 'Kibuzi - Banana T.c Plantlet',
      image: nurseryImages['chocolate_mint_seedling'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 6,
      name: 'Coriander Seedlings',
      image: nurseryImages['cinnamon_seedling'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 7,
      name: 'Sweet Basil Seedling (Mujaaja)',
      image: nurseryImages['coriander_seedlings'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 8,
      name: 'Parsley Seedling',
      image: nurseryImages['kibuzi_banana_t_c_plantlet'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 9,
      name: 'Celery Seedling',
      image: nurseryImages['kisansa_banana_t_c_plantlet'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 10,
      name: 'Atwalira - Banana T.c Plantlet',
      image: nurseryImages['lemon_balm_seedling'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 11,
      name: 'Pineapple Mint Seedling',
      image: nurseryImages['lemon_grass_kisubi'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 12,
      name: 'Lemon Balm Seedling',
      image: nurseryImages['m3_banana_suckers'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 13,
      name: 'M3 Banana Suckers',
      image: nurseryImages['mbwazirume_banana_t_c_plantlet'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 14,
      name: 'Nakatansese - Banana T.c Plantlet',
      image: nurseryImages['mint_seedling'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 15,
      name: 'Mbwazirume-banana T.c Plantlet',
      image: nurseryImages['mpologoma_banana_t_c_plantlet'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 16,
      name: 'Chocolate Mint Seedling',
      image: nurseryImages['musakala'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 17,
      name: 'Aloe Vera Seedling',
      image: nurseryImages['nakatansese_banana_t_c_plantlet'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 18,
      name: 'Mint Seedling',
      image: nurseryImages['oregano_seedling'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 19,
      name: 'Bogoya (Gros Michel) - Banana T.c Plantlet',
      image: nurseryImages['parsley_seedling'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 20,
      name: 'Cinnamon Seedling',
      image: nurseryImages['pineapple_mint_seedling'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 21,
      name: 'Kisansa - Banana T.c Plantlet',
      image: nurseryImages['rosemary_seedling'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 22,
      name: 'Mpologoma-banana T.c Plantlet',
      image: nurseryImages['strawberry_chandler_seedlings'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    },
    {
      id: 23,
      name: 'Rosemary Seedling',
      image: nurseryImages['sweet_basil_seedling_mujaaja'],
      description: 'High-quality nursery bed product for agricultural use.',
      price: 'Contact for pricing',
      packaging: 'Contact for pricing',
      category: 'Nursery Bed',
      manufacturer: 'Contact for details',
      activeIngredient: 'Contact for details',
      formulation: 'Contact for details',
      targetCrops: 'Contact for details',
      targetWeeds: 'Contact for details',
      applicationMethod: 'Contact for details',
      preHarvestInterval: 'Contact for details'
    }
  ];

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

export default NurseryBedScreen;
