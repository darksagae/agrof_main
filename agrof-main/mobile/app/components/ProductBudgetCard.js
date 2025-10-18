import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import storeImageService from '../services/storeImageService';

const ProductBudgetCard = ({ product, onViewDetails, onAddToCart, showActions = true }) => {
  const formatUGX = (amount) => {
    if (!amount || amount === 0) return 'Contact for pricing';
    return `UGX ${Math.round(amount).toLocaleString()}`;
  };

  const getProductImage = () => {
    if (product.image_url) {
      return storeImageService.getProductImage(product);
    }
    return storeImageService.getFallbackImage(product.category || 'fertilizers');
  };

  return (
    <View style={styles.card}>
      {/* Product Image */}
      {product.can_buy && (
        <Image
          source={getProductImage()}
          style={styles.productImage}
          resizeMode="cover"
        />
      )}
      
      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        
        {/* Quantity & Unit */}
        <View style={styles.quantityRow}>
          <MaterialIcons name="shopping-cart" size={14} color="#666" />
          <Text style={styles.quantityText}>
            {product.quantity} {product.unit}
          </Text>
        </View>

        {/* Timing (if applicable) */}
        {product.timing && (
          <View style={styles.timingRow}>
            <MaterialIcons name="schedule" size={14} color="#4CAF50" />
            <Text style={styles.timingText}>{product.timing}</Text>
          </View>
        )}

        {/* Price */}
        <View style={styles.priceRow}>
          <View>
            {product.price && (
              <Text style={styles.unitPrice}>
                {typeof product.price === 'string' ? product.price : formatUGX(product.unit_cost || 0)} each
              </Text>
            )}
            <Text style={styles.totalPrice}>
              Total: {formatUGX(product.total_cost)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        {showActions && product.can_buy && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => onViewDetails && onViewDetails(product)}
            >
              <MaterialIcons name="info" size={16} color="#2196F3" />
              <Text style={styles.viewButtonText}>Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => onAddToCart && onAddToCart(product)}
            >
              <MaterialIcons name="add-shopping-cart" size={16} color="white" />
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  quantityText: {
    fontSize: 12,
    color: '#666',
  },
  timingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  timingText: {
    fontSize: 11,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  priceRow: {
    marginTop: 4,
    marginBottom: 8,
  },
  unitPrice: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2196F3',
    gap: 4,
  },
  viewButtonText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    gap: 4,
  },
  buyButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
});

export default ProductBudgetCard;

