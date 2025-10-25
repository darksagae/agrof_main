/**
 * Store Backend Integration
 * Connect automation workflows with the store backend
 */

const fetch = require('node-fetch');

class StoreIntegration {
  constructor(storeBackendUrl) {
    // Use environment variable or default to localhost
    this.baseUrl = storeBackendUrl || process.env.STORE_BACKEND_URL || 'http://192.168.0.105:3001';
    console.log('🔗 Store Integration connected to:', this.baseUrl);
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts() {
    try {
      const response = await fetch(`${this.baseUrl}/api/inventory/status`);
      const products = await response.json();
      
      return products.filter(p => p.stock_status === 'LOW_STOCK' || p.stock_status === 'OUT_OF_STOCK');
    } catch (error) {
      console.error('Error getting low stock products:', error);
      throw error;
    }
  }

  /**
   * Update product inventory
   */
  async updateInventory(productId, quantity, transactionType, notes = '') {
    try {
      const response = await fetch(`${this.baseUrl}/api/inventory/update-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity,
          transactionType,
          notes
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  }

  /**
   * Get stock alerts
   */
  async getStockAlerts() {
    try {
      const response = await fetch(`${this.baseUrl}/api/inventory/alerts`);
      return await response.json();
    } catch (error) {
      console.error('Error getting stock alerts:', error);
      throw error;
    }
  }

  /**
   * Get product by ID
   */
  async getProduct(productId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/products/${productId}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  }

  /**
   * Update product
   */
  async updateProduct(productId, updates) {
    try {
      const response = await fetch(`${this.baseUrl}/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      return await response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  /**
   * Send notification to store backend
   */
  async sendNotification(type, message, data = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          message,
          data,
          timestamp: new Date().toISOString()
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Trigger event on automation engine from store backend
   */
  static createEventTrigger(automationEngineUrl) {
    return async (eventType, eventData) => {
      try {
        const response = await fetch(`${automationEngineUrl}/api/events/${eventType}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData)
        });

        return await response.json();
      } catch (error) {
        console.error('Error triggering automation event:', error);
        throw error;
      }
    };
  }
}

module.exports = StoreIntegration;


