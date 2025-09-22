import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import OrganicChemicalDetailScreen from './OrganicChemicalDetailScreen';
import SimplePricingWidget from '../components/SimplePricingWidget';

const { width } = Dimensions.get('window');

const OrganicChemicalsScreen = ({ onBack }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pricingWidgetVisible, setPricingWidgetVisible] = useState(false);
  const [selectedProductForPricing, setSelectedProductForPricing] = useState(null);
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  // Import all organic chemicals images from simplified folder structure
  const organicImages = {
    'solum2soil': require('../assets/ORGANIC_CHEMICALS_SIMPLE/solum2soil.png'),
    'superagric_silage': require('../assets/ORGANIC_CHEMICALS_SIMPLE/superagric_silage.jpeg'),
    'vermichar': require('../assets/ORGANIC_CHEMICALS_SIMPLE/vermichar.png'),
    'sg1000': require('../assets/ORGANIC_CHEMICALS_SIMPLE/sg1000.png'),
    'humate': require('../assets/ORGANIC_CHEMICALS_SIMPLE/humate.jpg'),
    'orb_l': require('../assets/ORGANIC_CHEMICALS_SIMPLE/orb_l.jpg'),
    'vermicompost_100': require('../assets/ORGANIC_CHEMICALS_SIMPLE/vermicompost_100.png'),
    'oscars_primo': require('../assets/ORGANIC_CHEMICALS_SIMPLE/oscars_primo.jpg'),
    'oscars_oligo': require('../assets/ORGANIC_CHEMICALS_SIMPLE/oscars_oligo.jpg'),
    'superagric_germination_booster': require('../assets/ORGANIC_CHEMICALS_SIMPLE/superagric_germination_booster.jpeg'),
    'fungicide': require('../assets/ORGANIC_CHEMICALS_SIMPLE/fungicide.png'),
    'seek_bambo': require('../assets/ORGANIC_CHEMICALS_SIMPLE/seek_bambo.png'),
    'fertiplus': require('../assets/ORGANIC_CHEMICALS_SIMPLE/fertiplus.jpg')
  };

  // Define organicProducts array
  const organicProducts = [
    {
      id: 1,
      name: 'Organic Neem Oil',
      price: 'UGX 25,000',
      packaging: '500ml: UGX 25,000, 1L: UGX 45,000',
      description: 'Natural pest control and fungicide made from neem tree extracts.',
      image: organicImages['sg1000'],
      category: 'Organic Pest Control',
      benefits: [
        'Controls aphids, whiteflies, and spider mites',
        'Fungal disease prevention',
        'Safe for beneficial insects',
        'Organic and eco-friendly'
      ],
      application: 'Mix 2-3ml per liter of water. Apply every 7-10 days.',
      precautions: 'Avoid application during flowering. Test on small area first.'
    },
    {
      id: 2,
      name: 'Organic Compost Tea',
      price: 'UGX 15,000',
      packaging: '1kg: UGX 15,000, 5kg: UGX 65,000',
      description: 'Nutrient-rich liquid fertilizer made from composted organic matter.',
      image: organicImages['oscars_oligo'],
      category: 'Organic Fertilizer',
      benefits: [
        'Improves soil structure',
        'Enhances plant growth',
        'Increases beneficial microorganisms',
        '100% organic and natural'
      ],
      application: 'Dilute 1:10 with water. Apply to soil every 2 weeks.',
      precautions: 'Use within 24 hours of preparation. Store in cool place.'
    },
    {
      id: 3,
      name: 'Organic Garlic Spray',
      price: 'UGX 12,000',
      packaging: '250ml: UGX 12,000, 500ml: UGX 20,000',
      description: 'Natural insect repellent made from garlic extracts.',
      image: organicImages['vermicompost_100'],
      category: 'Organic Pest Control',
      benefits: [
        'Repels aphids and other insects',
        'Antifungal properties',
        'Safe for humans and pets',
        'Easy to make at home'
      ],
      application: 'Spray directly on affected plants. Reapply after rain.',
      precautions: 'May cause mild irritation. Avoid contact with eyes.'
    },
    {
      id: 4,
      name: 'Organic Seaweed Extract',
      price: 'UGX 18,000',
      packaging: '500ml: UGX 18,000, 1L: UGX 32,000',
      description: 'Natural plant growth stimulant derived from seaweed.',
      image: organicImages['superagric_silage'],
      category: 'Organic Growth Stimulant',
      benefits: [
        'Promotes root development',
        'Increases flowering and fruiting',
        'Improves stress tolerance',
        'Rich in micronutrients'
      ],
      application: 'Mix 5ml per liter of water. Apply every 2 weeks.',
      precautions: 'Do not exceed recommended dosage. Store in cool place.'
    },
    {
      id: 5,
      name: 'Organic Diatomaceous Earth',
      price: 'UGX 8,000',
      packaging: '1kg: UGX 8,000, 5kg: UGX 35,000',
      description: 'Natural insecticide made from fossilized algae.',
      image: organicImages['seek_bambo'],
      category: 'Organic Pest Control',
      benefits: [
        'Controls crawling insects',
        'Safe for humans and pets',
        'Long-lasting effectiveness',
        'Improves soil drainage'
      ],
      application: 'Dust lightly on soil surface. Reapply after rain.',
      precautions: 'Wear mask during application. Keep away from children.'
    },
    {
      id: 6,
      name: 'Organic Fish Emulsion',
      price: 'UGX 22,000',
      packaging: '1L: UGX 22,000, 5L: UGX 95,000',
      description: 'High-nitrogen organic fertilizer made from fish waste.',
      image: organicImages['oscars_primo'],
      category: 'Organic Fertilizer',
      benefits: [
        'High nitrogen content',
        'Fast-acting nutrient release',
        'Improves soil fertility',
        'Safe for all plants'
      ],
      application: 'Dilute 1:20 with water. Apply every 3-4 weeks.',
      precautions: 'Strong odor. Apply in well-ventilated area.'
    }
  ];

  console.log('🧪 OrganicChemicalsScreen: Rendering with', organicProducts.length, 'products');

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

  // Optimized product rendering with memoization
  const renderProduct = useCallback(({ item: product }) => (
    <TouchableOpacity 
      style={styles.productItem}
      onPress={() => {
        console.log('🧪 Product selected:', product.name);
        setSelectedProduct(product);
      }}
    >
      {imageLoadingStates[product.id] && (
        <View style={styles.imageLoader}>
          <ActivityIndicator size="small" color="#2c5530" />
        </View>
      )}
      <Image 
        source={product.image} 
        style={styles.productImage}
        resizeMode="cover"
        onLoadStart={() => handleImageLoadStart(product.id)}
        onLoad={() => handleImageLoad(product.id)}
        onError={(error) => {
          console.log('❌ Image load error for product', product.id, ':', error);
          handleImageLoad(product.id);
        }}
      />
      
      <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
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
      
      <Text style={styles.manufacturer}>by {product.manufacturer}</Text>
    </TouchableOpacity>
  ), [imageLoadingStates, handleImageLoad, handleImageLoadStart, hasMultiplePrices, getUnitPrice]);

  // Show detail screen if product is selected
  if (selectedProduct) {
    return (
      <OrganicChemicalDetailScreen 
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
          <Text style={styles.headerTitle}>Organic Chemicals</Text>
        </View>
        <Text style={styles.headerSubtitle}>Sustainable organic solutions for healthy farming</Text>
      </View>

      {/* Products Grid - Optimized FlatList */}
      <FlatList
        data={organicProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
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
    padding: 15,
    backgroundColor: 'transparent',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 5,
    marginTop: 8,
    textAlign: 'center',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'center',
  },
  outOfStock: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: 'bold',
    marginTop: 2,
  },
  manufacturer: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  imageLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    zIndex: 1,
  },
});

export default OrganicChemicalsScreen;
