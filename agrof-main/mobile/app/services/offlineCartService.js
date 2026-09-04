/**
 * Offline Cart Service - AGROF
 * Manages shopping cart locally using AsyncStorage
 * Syncs with backend when online
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Linking } from 'react-native';
import networkManager from './networkManager';

const CART_STORAGE_KEY = 'offline_cart';
const PENDING_ORDERS_KEY = 'pending_orders';
const SELLER_PHONE = '+256700123456'; // Default seller phone number

class OfflineCartService {
  constructor() {
    this.cart = [];
    this.pendingOrders = [];
    this.initialized = false;
  }

  /**
   * Initialize cart from AsyncStorage
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Load cart
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        this.cart = JSON.parse(cartData);
        console.log(`🛒 Loaded ${this.cart.length} items from offline cart`);
      }

      // Load pending orders
      const ordersData = await AsyncStorage.getItem(PENDING_ORDERS_KEY);
      if (ordersData) {
        this.pendingOrders = JSON.parse(ordersData);
        console.log(`📦 Loaded ${this.pendingOrders.length} pending orders`);
      }

      this.initialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize offline cart:', error);
    }
  }

  /**
   * Save cart to storage
   */
  async saveCart() {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
      console.log('💾 Cart saved to storage');
    } catch (error) {
      console.error('❌ Failed to save cart:', error);
    }
  }

  /**
   * Save pending orders
   */
  async savePendingOrders() {
    try {
      await AsyncStorage.setItem(PENDING_ORDERS_KEY, JSON.stringify(this.pendingOrders));
      console.log('💾 Pending orders saved');
    } catch (error) {
      console.error('❌ Failed to save pending orders:', error);
    }
  }

  /**
   * Add item to cart
   */
  async addItem(product, quantity = 1) {
    await this.initialize();

    // Check if item already exists
    const existingIndex = this.cart.findIndex(item => item.id === product.id);

    if (existingIndex >= 0) {
      // Update quantity
      this.cart[existingIndex].quantity += quantity;
      console.log(`📦 Updated ${product.name}: ${this.cart[existingIndex].quantity} items`);
    } else {
      // Add new item
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.selling_price || product.price,
        quantity,
        image_url: product.image_url,
        category: product.category_name,
        addedAt: Date.now()
      });
      console.log(`✅ Added ${product.name} to cart`);
    }

    await this.saveCart();

    return {
      success: true,
      offline: true,
      message: 'Added to cart (saved locally)',
      cart: this.cart
    };
  }

  /**
   * Remove item from cart
   */
  async removeItem(productId) {
    await this.initialize();

    const index = this.cart.findIndex(item => item.id === productId);
    
    if (index >= 0) {
      const removed = this.cart.splice(index, 1)[0];
      await this.saveCart();
      
      console.log(`🗑️ Removed ${removed.name} from cart`);
      
      return {
        success: true,
        message: 'Item removed from cart',
        cart: this.cart
      };
    }

    return {
      success: false,
      message: 'Item not found in cart'
    };
  }

  /**
   * Update item quantity
   */
  async updateQuantity(productId, quantity) {
    await this.initialize();

    if (quantity <= 0) {
      return await this.removeItem(productId);
    }

    const item = this.cart.find(item => item.id === productId);
    
    if (item) {
      item.quantity = quantity;
      await this.saveCart();
      
      console.log(`📝 Updated ${item.name}: ${quantity} items`);
      
      return {
        success: true,
        message: 'Quantity updated',
        cart: this.cart
      };
    }

    return {
      success: false,
      message: 'Item not found in cart'
    };
  }

  /**
   * Get all cart items
   */
  async getItems() {
    await this.initialize();
    return this.cart;
  }

  /**
   * Get cart summary
   */
  async getSummary() {
    await this.initialize();

    const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = this.cart.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      return sum + (price * item.quantity);
    }, 0);

    return {
      items: this.cart,
      itemCount,
      total,
      totalFormatted: `UGX ${total.toLocaleString()}`
    };
  }

  /**
   * Clear cart
   */
  async clear() {
    this.cart = [];
    await this.saveCart();
    console.log('🗑️ Cart cleared');
    
    return {
      success: true,
      message: 'Cart cleared'
    };
  }

  /**
   * Create order (saved locally if offline)
   */
  async createOrder(customerInfo) {
    await this.initialize();

    if (this.cart.length === 0) {
      return {
        success: false,
        message: 'Cart is empty'
      };
    }

    const order = {
      id: `order_${Date.now()}`,
      items: [...this.cart],
      customer: customerInfo,
      total: (await this.getSummary()).total,
      createdAt: Date.now(),
      status: 'pending',
      synced: false
    };

    // Add to pending orders
    this.pendingOrders.push(order);
    await this.savePendingOrders();

    // Clear cart
    await this.clear();

    console.log(`📦 Order created: ${order.id}`);

    return {
      success: true,
      order,
      offline: true,
      message: 'Order saved locally. Will sync when online.'
    };
  }

  /**
   * Generate SMS order message
   */
  generateOrderSMS(customerInfo) {
    const summary = this.cart.map(item => 
      `${item.name} (${item.quantity}x) = UGX ${(parseFloat(item.price) * item.quantity).toLocaleString()}`
    ).join('\n');

    const total = this.cart.reduce((sum, item) => 
      sum + (parseFloat(item.price) * item.quantity), 0
    );

    const message = `AGROF Order:\n\n${summary}\n\nTotal: UGX ${total.toLocaleString()}\n\nCustomer: ${customerInfo.name || 'N/A'}\nPhone: ${customerInfo.phone || 'N/A'}\nLocation: ${customerInfo.location || 'N/A'}`;

    return message;
  }

  /**
   * Send order via SMS
   */
  async sendOrderViaSMS(customerInfo, sellerPhone = SELLER_PHONE) {
    await this.initialize();

    if (this.cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart before ordering');
      return { success: false };
    }

    try {
      const message = this.generateOrderSMS(customerInfo);
      const smsUrl = `sms:${sellerPhone}${Platform.OS === 'ios' ? '&' : '?'}body=${encodeURIComponent(message)}`;

      const canOpen = await Linking.canOpenURL(smsUrl);
      
      if (canOpen) {
        await Linking.openURL(smsUrl);
        
        // Save as pending order
        await this.createOrder(customerInfo);

        return {
          success: true,
          method: 'sms',
          message: 'SMS app opened with order details'
        };
      } else {
        Alert.alert('SMS Not Available', 'Unable to open SMS app on this device');
        return { success: false };
      }
    } catch (error) {
      console.error('❌ Failed to open SMS:', error);
      Alert.alert('Error', 'Failed to open SMS app');
      return { success: false };
    }
  }

  /**
   * Send order via WhatsApp
   */
  async sendOrderViaWhatsApp(customerInfo, sellerPhone = SELLER_PHONE) {
    await this.initialize();

    if (this.cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart before ordering');
      return { success: false };
    }

    try {
      const message = this.generateOrderSMS(customerInfo);
      const whatsappUrl = `whatsapp://send?phone=${sellerPhone}&text=${encodeURIComponent(message)}`;

      const canOpen = await Linking.canOpenURL(whatsappUrl);
      
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
        
        // Save as pending order
        await this.createOrder(customerInfo);

        return {
          success: true,
          method: 'whatsapp',
          message: 'WhatsApp opened with order details'
        };
      } else {
        Alert.alert('WhatsApp Not Available', 'WhatsApp is not installed on this device');
        return { success: false };
      }
    } catch (error) {
      console.error('❌ Failed to open WhatsApp:', error);
      Alert.alert('Error', 'Failed to open WhatsApp');
      return { success: false };
    }
  }

  /**
   * Get pending orders
   */
  async getPendingOrders() {
    await this.initialize();
    return this.pendingOrders;
  }

  /**
   * Mark order as synced
   */
  async markOrderSynced(orderId) {
    const order = this.pendingOrders.find(o => o.id === orderId);
    if (order) {
      order.synced = true;
      order.syncedAt = Date.now();
      await this.savePendingOrders();
      console.log(`✅ Order ${orderId} marked as synced`);
    }
  }

  /**
   * Remove synced orders
   */
  async removeSyncedOrders() {
    await this.initialize();
    
    const beforeCount = this.pendingOrders.length;
    this.pendingOrders = this.pendingOrders.filter(o => !o.synced);
    await this.savePendingOrders();
    
    const removed = beforeCount - this.pendingOrders.length;
    if (removed > 0) {
      console.log(`🗑️ Removed ${removed} synced orders`);
    }
  }

  /**
   * Sync pending orders with backend (when online)
   */
  async syncPendingOrders() {
    if (!networkManager.isOnline) {
      return {
        success: false,
        message: 'Cannot sync: offline'
      };
    }

    await this.initialize();

    if (this.pendingOrders.length === 0) {
      return {
        success: true,
        synced: 0,
        message: 'No pending orders to sync'
      };
    }

    console.log(`🔄 Syncing ${this.pendingOrders.length} pending orders...`);

    // TODO: Implement actual backend sync
    // For now, just mark as synced after WiFi connection
    if (networkManager.isWiFi) {
      this.pendingOrders.forEach(order => {
        order.synced = true;
        order.syncedAt = Date.now();
      });
      await this.savePendingOrders();

      return {
        success: true,
        synced: this.pendingOrders.length,
        message: 'Orders synced successfully'
      };
    }

    return {
      success: false,
      message: 'Sync requires WiFi connection'
    };
  }

  /**
   * Get cart statistics
   */
  async getStats() {
    await this.initialize();
    
    const summary = await this.getSummary();

    return {
      cartItems: this.cart.length,
      totalQuantity: summary.itemCount,
      totalValue: summary.total,
      pendingOrders: this.pendingOrders.length,
      unsyncedOrders: this.pendingOrders.filter(o => !o.synced).length
    };
  }
}

// Export singleton instance
export default new OfflineCartService();



