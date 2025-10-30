import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  Modal,
  TextInput,
  Image,
  SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeTranslation } from '../i18n';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';

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

const CheckoutScreen = ({ onBack, onOrderPlaced }) => {
  const { t } = useSafeTranslation();
  const { user } = useUser();
  const { 
    items, 
    getTotalItems,
    getDeliveryFee,
    getSubtotal,
    getGrandTotal,
    clearCart
  } = useCart();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock addresses - in real app, fetch from user profile
  const [addresses] = useState([
    {
      id: 1,
      name: 'Home',
      address: 'Kampala, Central Region',
      details: '123 Main Street, Nakawa',
      phone: '+256 700 123 456'
    },
    {
      id: 2,
      name: 'Office',
      address: 'Entebbe, Central Region',
      details: '456 Business Avenue, Ntinda',
      phone: '+256 700 789 012'
    }
  ]);

  const paymentMethods = [
    { id: 'prepay', name: 'Pre-pay Now', icon: 'credit-card', description: 'Pay immediately' },
    { id: 'card', name: 'Credit/Debit Card', icon: 'payment', description: 'Visa, Mastercard' },
    { id: 'airtel', name: 'Airtel Money', icon: 'phone-android', description: 'Mobile money' },
    { id: 'mtn', name: 'MTN Money', icon: 'phone-android', description: 'Mobile money' },
    { id: 'delivery', name: 'Pay on Delivery', icon: 'local-shipping', description: 'Cash on delivery' }
  ];

  useEffect(() => {
    // Set default address if available
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses, selectedAddress]);

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setShowPaymentModal(false);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
  };

  const handleConfirmOrder = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Payment Required', 'Please select a payment method');
      return;
    }

    if (!selectedAddress) {
      Alert.alert('Address Required', 'Please select a delivery address');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOrderConfirmed(true);
      
      // Clear cart after successful order
      await clearCart();
      
      Alert.alert(
        'Order Confirmed!',
        `Your order has been placed successfully. Order total: ${formatUGX(getGrandTotal())}`,
        [
          {
            text: 'OK',
            onPress: () => {
              if (onOrderPlaced) {
                onOrderPlaced();
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderOrderItem = (item, index) => (
    <View key={item.id || index} style={styles.orderItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
      </View>
      <Text style={styles.itemPrice}>
        {formatUGX(getItemPrice(item) * item.quantity)}
      </Text>
    </View>
  );

  const renderPaymentMethod = (method) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethod,
        selectedPaymentMethod?.id === method.id && styles.selectedPaymentMethod
      ]}
      onPress={() => handlePaymentMethodSelect(method)}
    >
      <MaterialIcons 
        name={method.icon} 
        size={24} 
        color={selectedPaymentMethod?.id === method.id ? '#4CAF50' : '#666'} 
      />
      <View style={styles.paymentInfo}>
        <Text style={[
          styles.paymentName,
          selectedPaymentMethod?.id === method.id && styles.selectedText
        ]}>
          {method.name}
        </Text>
        <Text style={styles.paymentDescription}>{method.description}</Text>
      </View>
      {selectedPaymentMethod?.id === method.id && (
        <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
      )}
    </TouchableOpacity>
  );

  const renderAddress = (address) => (
    <TouchableOpacity
      key={address.id}
      style={[
        styles.addressItem,
        selectedAddress?.id === address.id && styles.selectedAddress
      ]}
      onPress={() => handleAddressSelect(address)}
    >
      <MaterialIcons 
        name="location-on" 
        size={24} 
        color={selectedAddress?.id === address.id ? '#4CAF50' : '#666'} 
      />
      <View style={styles.addressInfo}>
        <Text style={[
          styles.addressName,
          selectedAddress?.id === address.id && styles.selectedText
        ]}>
          {address.name}
        </Text>
        <Text style={styles.addressDetails}>{address.details}</Text>
        <Text style={styles.addressLocation}>{address.address}</Text>
        <Text style={styles.addressPhone}>{address.phone}</Text>
      </View>
      {selectedAddress?.id === address.id && (
        <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
      )}
    </TouchableOpacity>
  );

  if (orderConfirmed) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Order Confirmed</Text>
        </View>
        <View style={styles.confirmedContainer}>
          <MaterialIcons name="check-circle" size={80} color="#4CAF50" />
          <Text style={styles.confirmedTitle}>Order Placed Successfully!</Text>
          <Text style={styles.confirmedSubtitle}>
            Your order has been confirmed and will be processed shortly.
          </Text>
          <TouchableOpacity style={styles.continueButton} onPress={onBack}>
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items ({getTotalItems()})</Text>
          {items.map(renderOrderItem)}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>{formatUGX(getSubtotal())}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee:</Text>
            <Text style={styles.summaryValue}>{formatUGX(getDeliveryFee())}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{formatUGX(getGrandTotal())}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity onPress={() => setShowPaymentModal(true)}>
              <Text style={styles.modifyText}>Modify</Text>
            </TouchableOpacity>
          </View>
          {selectedPaymentMethod ? (
            <View style={styles.selectedMethod}>
              <MaterialIcons name={selectedPaymentMethod.icon} size={24} color="#4CAF50" />
              <Text style={styles.selectedMethodText}>{selectedPaymentMethod.name}</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.selectButton} 
              onPress={() => setShowPaymentModal(true)}
            >
              <Text style={styles.selectButtonText}>Select Payment Method</Text>
              <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity onPress={() => setShowAddressModal(true)}>
              <Text style={styles.modifyText}>Modify</Text>
            </TouchableOpacity>
          </View>
          {selectedAddress ? (
            <View style={styles.selectedAddress}>
              <MaterialIcons name="location-on" size={24} color="#4CAF50" />
              <View style={styles.addressInfo}>
                <Text style={styles.selectedMethodText}>{selectedAddress.name}</Text>
                <Text style={styles.addressDetails}>{selectedAddress.details}</Text>
                <Text style={styles.addressLocation}>{selectedAddress.address}</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.selectButton} 
              onPress={() => setShowAddressModal(true)}
            >
              <Text style={styles.selectButtonText}>Select Address</Text>
              <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Confirm Order Button */}
        <TouchableOpacity 
          style={[styles.confirmButton, (!selectedPaymentMethod || !selectedAddress) && styles.disabledButton]}
          onPress={handleConfirmOrder}
          disabled={!selectedPaymentMethod || !selectedAddress || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <MaterialIcons name="check-circle" size={24} color="white" />
              <Text style={styles.confirmButtonText}>Confirm Order</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Payment Method Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Payment Method</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {paymentMethods.map(renderPaymentMethod)}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Address Modal */}
      <Modal
        visible={showAddressModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Address</Text>
              <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {addresses.map(renderAddress)}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c5530',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c5530',
  },
  modifyText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
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
  selectedMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f8f0',
    borderRadius: 8,
  },
  selectedMethodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 10,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  selectButtonText: {
    fontSize: 16,
    color: '#666',
  },
  selectedAddress: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    backgroundColor: '#f0f8f0',
    borderRadius: 8,
  },
  addressInfo: {
    flex: 1,
    marginLeft: 10,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
  },
  addressDetails: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  addressLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  addressPhone: {
    fontSize: 14,
    color: '#666',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  confirmedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  confirmedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  confirmedSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c5530',
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  selectedPaymentMethod: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0f8f0',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 15,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedText: {
    color: '#4CAF50',
  },
  paymentDescription: {
    fontSize: 14,
    color: '#666',
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  selectedAddress: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0f8f0',
  },
});

export default CheckoutScreen;
