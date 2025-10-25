/**
 * WhatsApp Notification Service
 * Sends notifications to admin when users register as buyers/sellers
 */

const fetch = require('node-fetch');

class WhatsAppNotificationService {
  constructor() {
    this.adminNumber = '0743232441@c.us'; // Admin WhatsApp number
    this.botApiUrl = 'https://agrof-whatsapp-bot.onrender.com'; // WhatsApp bot API
  }

  /**
   * Send registration notification to admin
   * @param {string} userType - 'buyer' or 'seller'
   * @param {object} userData - User information
   * @param {object} registrationData - Registration details
   */
  async sendRegistrationNotification(userType, userData, registrationData) {
    try {
      console.log(`📱 Sending ${userType} registration notification to admin`);
      
      const message = this.formatRegistrationMessage(userType, userData, registrationData);
      
      // Send notification via WhatsApp bot API
      const response = await fetch(`${this.botApiUrl}/api/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: this.adminNumber,
          message: message
        })
      });

      if (response.ok) {
        console.log('✅ WhatsApp notification sent successfully');
        return { success: true };
      } else {
        console.error('❌ Failed to send WhatsApp notification:', response.statusText);
        return { success: false, error: response.statusText };
      }
    } catch (error) {
      console.error('❌ Error sending WhatsApp notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Format registration message for admin
   */
  formatRegistrationMessage(userType, userData, registrationData) {
    const timestamp = new Date().toLocaleString('en-UG', {
      timeZone: 'Africa/Kampala',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    let message = `🔔 *NEW ${userType.toUpperCase()} REGISTRATION*\n\n`;
    message += `👤 *User:* ${userData.fullName || userData.username}\n`;
    message += `📧 *Email:* ${userData.email}\n`;
    message += `📱 *Phone:* ${userData.phone || 'Not provided'}\n`;
    message += `🕐 *Time:* ${timestamp}\n\n`;

    if (userType === 'seller') {
      message += `🏢 *Business Details:*\n`;
      message += `• Business: ${registrationData.businessName}\n`;
      message += `• License: ${registrationData.businessLicense}\n`;
      message += `• Address: ${registrationData.businessAddress}\n`;
      message += `• Description: ${registrationData.businessDescription}\n\n`;
    } else if (userType === 'buyer') {
      message += `📍 *Shipping Address:*\n`;
      message += `• Address: ${registrationData.shippingAddress}\n`;
      message += `• City: ${registrationData.city}\n`;
      message += `• District: ${registrationData.district}\n`;
      message += `• Payment: ${registrationData.preferredPaymentMethod}\n\n`;
    }

    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `⚡ *Admin Actions:*\n`;
    message += `• Type \`cloud\` to view pending registrations\n`;
    message += `• Approve/Reject users from the list\n`;
    message += `• Users will be activated automatically\n\n`;
    message += `_AGROF Admin Portal_ 🔧`;

    return message;
  }

  /**
   * Send activation confirmation to user
   * @param {string} userPhone - User's phone number
   * @param {string} userType - 'buyer' or 'seller'
   * @param {boolean} approved - Whether user was approved
   */
  async sendActivationConfirmation(userPhone, userType, approved) {
    try {
      const message = approved 
        ? `🎉 *Welcome to AGROF!*\n\nYour ${userType} account has been *ACTIVATED*!\n\nYou can now:\n• Browse products\n• Place orders\n• Access all features\n\n_Thank you for joining AGROF!_ 🌾`
        : `❌ *Registration Update*\n\nYour ${userType} registration was not approved at this time.\n\nPlease contact support for more information:\n📞 +256 705 223 777\n\n_AGROF Support Team_`;

      const response = await fetch(`${this.botApiUrl}/api/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: `${userPhone}@c.us`,
          message: message
        })
      });

      return response.ok ? { success: true } : { success: false };
    } catch (error) {
      console.error('❌ Error sending activation confirmation:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new WhatsAppNotificationService();
