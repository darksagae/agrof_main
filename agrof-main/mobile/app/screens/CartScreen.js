import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  Alert, 
  ActivityIndicator,
  TextInput,
  Modal
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeTranslation } from '../i18n';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import storeImageService from '../services/storeImageService';
import CheckoutScreen from './CheckoutScreen';

const formatUGX = (amount) => {
  const value = typeof amount === 'number' ? amount : parseFloat((amount || '').toString().replace(/[^\d.]/g, '')) || 0;
  return `UGX ${Math.round(value).toLocaleString()}`;
};

const getItemPrice = (item) => {
  // Extract price from complex product structure
  if (item.price) {
    return parseFloat(item.price || 0);
  } else if (item.packages && item.packages.length > 0) {
    // Extract price from first package, first tier
    const firstPackage = item.packages[0];
    if (firstPackage.tiers && firstPackage.tiers.length > 0) {
      return firstPackage.tiers[0].price || 0;
    }
  } else if (item.selling_price) {
    return parseFloat(item.selling_price || 0);
  }
  return 0;
};

const CartScreen = ({ onBack }) => {
  const { t } = useSafeTranslation();
  const { user, isAuthenticated } = useUser();
  const { 
    items, 
    loading, 
    error, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice, 
    getTotalItems,
    getDeliveryFee,
    getSubtotal,
    getGrandTotal
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);

  const handleRemoveItem = async (itemId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            const result = await removeFromCart(itemId);
            if (!result.success) {
              Alert.alert('Error', result.error || 'Failed to remove item');
            }
          }
        }
      ]
    );
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    const result = await updateQuantity(itemId, newQuantity);
    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to update quantity');
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            const result = await clearCart();
            if (!result.success) {
              Alert.alert('Error', result.error || 'Failed to clear cart');
            }
          }
        }
      ]
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add some products first!');
      return;
    }
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to proceed with checkout.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => {
            // Navigate to sign in screen
            console.log('Navigate to sign in');
            // You can add navigation logic here
          }}
        ]
      );
      return;
    }
    
    setShowCheckout(true);
  };

  const handleOrderPlaced = () => {
    setShowCheckout(false);
    onBack();
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image 
        source={storeImageService.getProductImage(item)} 
        style={styles.itemImage} 
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemCategory}>{item.category_name}</Text>
        <Text style={styles.itemPrice}>{formatUGX(getItemPrice(item))}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
          >
            <MaterialIcons name="remove" size={20} color="#4CAF50" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
          >
            <MaterialIcons name="add" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.id)}
      >
        <MaterialIcons name="delete" size={24} color="#FF5722" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        {items.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
            <MaterialIcons name="clear-all" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={24} color="#FF5722" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="shopping-cart" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some products to get started</Text>
          <TouchableOpacity style={styles.continueShoppingButton} onPress={onBack}>
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Cart Items */}
          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          {/* Cart Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items ({getTotalItems()}):</Text>
              <Text style={styles.summaryValue}>{formatUGX(getSubtotal())}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery:</Text>
              <Text style={styles.summaryValue}>{formatUGX(getDeliveryFee())}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{formatUGX(getGrandTotal())}</Text>
            </View>
            
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <MaterialIcons name="payment" size={24} color="white" />
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Checkout Screen - Full Screen Overlay */}
      {showCheckout && (
        <View style={styles.checkoutOverlay}>
          <CheckoutScreen 
            onBack={() => setShowCheckout(false)}
            onOrderPlaced={handleOrderPlaced}
          />
        </View>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c5530',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  clearButton: {
    padding: 8,
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
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 15,
    margin: 15,
    borderRadius: 8,
  },
  errorText: {
    marginLeft: 10,
    color: '#C62828',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  continueShoppingButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  continueShoppingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartList: {
    flex: 1,
    padding: 15,
  },
  cartItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
    color: '#2c5530',
  },
  removeButton: {
    padding: 8,
    justifyContent: 'center',
  },
  summaryContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c5530',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5530',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  checkoutOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 1000,
  },
});

export default CartScreen;
