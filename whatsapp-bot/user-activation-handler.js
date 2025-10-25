/**
 * User Activation Handler
 * Handles user activation/deactivation via WhatsApp bot
 */

const fetch = require('node-fetch');

class UserActivationHandler {
  constructor(storeApiUrl) {
    this.storeApiUrl = storeApiUrl;
  }

  /**
   * Fetch pending buyer registrations
   */
  async fetchPendingBuyers() {
    try {
      // This would typically fetch from your database
      // For now, we'll simulate with mock data
      const mockBuyers = [
        {
          id: 'buyer_001',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+256700123456',
          registrationDate: '2024-01-15',
          status: 'pending'
        },
        {
          id: 'buyer_002', 
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+256700789012',
          registrationDate: '2024-01-16',
          status: 'pending'
        }
      ];

      return {
        success: true,
        buyers: mockBuyers,
        count: mockBuyers.length
      };
    } catch (error) {
      console.error('❌ Error fetching pending buyers:', error);
      return { success: false, error: error.message, buyers: [] };
    }
  }

  /**
   * Fetch pending seller registrations
   */
  async fetchPendingSellers() {
    try {
      // This would typically fetch from your database
      // For now, we'll simulate with mock data
      const mockSellers = [
        {
          id: 'seller_001',
          name: 'Farm Supply Co.',
          email: 'contact@farmsupply.com',
          phone: '+256700345678',
          businessName: 'Farm Supply Co.',
          businessLicense: 'LIC123456',
          registrationDate: '2024-01-14',
          status: 'pending'
        },
        {
          id: 'seller_002',
          name: 'Green Thumb Seeds',
          email: 'info@greenthumb.com', 
          phone: '+256700901234',
          businessName: 'Green Thumb Seeds',
          businessLicense: 'LIC789012',
          registrationDate: '2024-01-17',
          status: 'pending'
        }
      ];

      return {
        success: true,
        sellers: mockSellers,
        count: mockSellers.length
      };
    } catch (error) {
      console.error('❌ Error fetching pending sellers:', error);
      return { success: false, error: error.message, sellers: [] };
    }
  }

  /**
   * Format buyers list for WhatsApp
   */
  formatBuyersList(buyers) {
    if (buyers.length === 0) {
      return `*PENDING BUYERS*\n\n✅ No pending buyer registrations\n\n_All buyers are up to date!_`;
    }

    let message = `*PENDING BUYER REGISTRATIONS*\n\n`;
    buyers.forEach((buyer, index) => {
      message += `${index + 1}️⃣ *${buyer.name}*\n`;
      message += `   📧 ${buyer.email}\n`;
      message += `   📱 ${buyer.phone}\n`;
      message += `   🆔 ID: \`${buyer.id}\`\n`;
      message += `   📅 ${buyer.registrationDate}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `*Total: ${buyers.length} pending buyers*\n\n`;
    message += `To activate: Type \`cloud\` → Activate user → Enter ID\n`;
    message += `To reject: Type \`cloud\` → Reject user → Enter ID`;

    return message;
  }

  /**
   * Format sellers list for WhatsApp
   */
  formatSellersList(sellers) {
    if (sellers.length === 0) {
      return `*PENDING SELLERS*\n\n✅ No pending seller registrations\n\n_All sellers are up to date!_`;
    }

    let message = `*PENDING SELLER REGISTRATIONS*\n\n`;
    sellers.forEach((seller, index) => {
      message += `${index + 1}️⃣ *${seller.businessName}*\n`;
      message += `   👤 ${seller.name}\n`;
      message += `   📧 ${seller.email}\n`;
      message += `   📱 ${seller.phone}\n`;
      message += `   🆔 ID: \`${seller.id}\`\n`;
      message += `   📄 License: ${seller.businessLicense}\n`;
      message += `   📅 ${seller.registrationDate}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `*Total: ${sellers.length} pending sellers*\n\n`;
    message += `To activate: Type \`cloud\` → Activate user → Enter ID\n`;
    message += `To reject: Type \`cloud\` → Reject user → Enter ID`;

    return message;
  }

  /**
   * Activate user (buyer or seller)
   */
  async activateUser(userId, userType) {
    try {
      console.log(`🔓 Activating ${userType} user: ${userId}`);
      
      // Here you would update the user's status in your database
      // For now, we'll simulate success
      
      // Send confirmation to user
      await this.sendActivationConfirmation(userId, userType, true);
      
      return {
        success: true,
        message: `✅ ${userType.toUpperCase()} user activated successfully!\n\nUser has been notified via WhatsApp.`
      };
    } catch (error) {
      console.error('❌ Error activating user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Reject user registration
   */
  async rejectUser(userId, userType, reason = '') {
    try {
      console.log(`❌ Rejecting ${userType} user: ${userId}`);
      
      // Here you would update the user's status in your database
      // For now, we'll simulate success
      
      // Send rejection notification to user
      await this.sendActivationConfirmation(userId, userType, false);
      
      return {
        success: true,
        message: `❌ ${userType.toUpperCase()} user rejected successfully!\n\nUser has been notified via WhatsApp.`
      };
    } catch (error) {
      console.error('❌ Error rejecting user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send activation confirmation to user
   */
  async sendActivationConfirmation(userId, userType, approved) {
    try {
      // This would send a WhatsApp message to the user
      // For now, we'll just log it
      console.log(`📱 Sending ${approved ? 'approval' : 'rejection'} to ${userType} user: ${userId}`);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error sending confirmation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user statistics
   */
  async getUserStatistics() {
    try {
      const buyersResult = await this.fetchPendingBuyers();
      const sellersResult = await this.fetchPendingSellers();
      
      const stats = {
        pendingBuyers: buyersResult.count || 0,
        pendingSellers: sellersResult.count || 0,
        totalPending: (buyersResult.count || 0) + (sellersResult.count || 0)
      };

      let message = `*USER REGISTRATION STATISTICS*\n\n`;
      message += `📊 *Pending Registrations:*\n`;
      message += `• Buyers: ${stats.pendingBuyers}\n`;
      message += `• Sellers: ${stats.pendingSellers}\n`;
      message += `• Total: ${stats.totalPending}\n\n`;
      
      if (stats.totalPending > 0) {
        message += `⚡ *Action Required:*\n`;
        message += `• Review pending registrations\n`;
        message += `• Activate approved users\n`;
        message += `• Reject if necessary\n\n`;
      } else {
        message += `✅ *All Clear!*\n`;
        message += `No pending registrations\n\n`;
      }
      
      message += `_AGROF Admin Dashboard_`;

      return {
        success: true,
        message: message,
        stats: stats
      };
    } catch (error) {
      console.error('❌ Error fetching user statistics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = UserActivationHandler;
