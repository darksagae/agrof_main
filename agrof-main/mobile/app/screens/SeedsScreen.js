import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SeedsScreen = ({ onBack }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Simple seeds data with basic images
  const seedProducts = [
    {
      id: 1,
      name: 'Anita – Watermelon',
      image: require('../assets/SEEDS_SIMPLE/anita_watermelon.jpg'),
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      category: 'Seeds'
    },
    {
      id: 2,
      name: 'Arjani F1 - Eggplants',
      image: require('../assets/SEEDS_SIMPLE/arjani_f1_eggplants.jpeg'),
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      category: 'Seeds'
    },
    {
      id: 3,
      name: 'Arjuna F1 – Pumpkin',
      image: require('../assets/SEEDS_SIMPLE/arjuna_f1_pumpkin.jpg'),
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      category: 'Seeds'
    },
    {
      id: 4,
      name: 'Ashley – Open Pollinated Cucumber',
      image: require('../assets/SEEDS_SIMPLE/ashley_open_pollinated_cucumber_varirty_with_prolific_productivity.jpg'),
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      category: 'Seeds'
    },
    {
      id: 5,
      name: 'Bitter Gourd -Palee F1',
      image: require('../assets/SEEDS_SIMPLE/bitter_gourd_palee_f1.jpg'),
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      category: 'Seeds'
    },
    {
      id: 6,
      name: 'Black Beauty - Eggplants',
      image: require('../assets/SEEDS_SIMPLE/black_beauty_eggplants.jpeg'),
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      category: 'Seeds'
    },
    {
      id: 7,
      name: 'Cal-j Tomato',
      image: require('../assets/SEEDS_SIMPLE/cal_j_tomato_compact_and_determinate_variety_suitable_for_processing_and_fresh_market.jpg'),
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      category: 'Seeds'
    },
    {
      id: 8,
      name: 'California Wonder',
      image: require('../assets/SEEDS_SIMPLE/california_wonder.jpg'),
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      category: 'Seeds'
    },
    {
      id: 9,
      name: 'California Wonder "Bamba" - Pepper',
      image: require('../assets/SEEDS_SIMPLE/california_wonder_bamba_pepper.png'),
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      category: 'Seeds'
    },
    {
      id: 10,
      name: 'California Wonder – Sweet Pepper',
      image: require('../assets/SEEDS_SIMPLE/california_wonder_sweet_pepper_variety_suitable_for_home_and_market_gardens.jpg'),
      description: 'High-quality seed variety for agricultural use.',
      price: 'Contact for pricing',
      category: 'Seeds'
    }
  ];

  console.log('🌱 SeedsScreen: Rendering with', seedProducts.length, 'products');

  const renderProduct = ({ item: product }) => (
    <View style={styles.productItem}>
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => setSelectedProduct(product)}
        activeOpacity={0.8}
      >
        <Image
          source={product.image}
          style={styles.productImage}
          resizeMode="cover"
          onError={(error) => {
            console.log('Image load error for product:', product.name, error);
          }}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {product.description}
          </Text>
            <Text style={styles.productPrice}>
            {product.price}
            </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seeds Products</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={seedProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productsGrid}
        showsVerticalScrollIndicator={false}
      />

      {selectedProduct && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
            <Text style={styles.modalDescription}>{selectedProduct.description}</Text>
            <Text style={styles.modalPrice}>{selectedProduct.price}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedProduct(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  productPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxWidth: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SeedsScreen;