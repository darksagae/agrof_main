/**
 * Professional Admin Commands Handler
 * Conversational admin portal with secret triggers
 */

const fetch = require('node-fetch');
const stateManager = require('./conversation-state-manager');
const triggerDefinitions = require('./trigger-definitions');
const ConversationFlowProcessor = require('./conversation-flow-processor');

class AdminCommandsV2 {
  constructor(storeApiUrl, adminNumbers) {
    this.storeApiUrl = storeApiUrl;
    this.adminNumbers = adminNumbers || [];
    this.flowProcessor = new ConversationFlowProcessor(storeApiUrl);
    
    // Secret trigger words
    this.triggers = ['godeye', 'void', 'destiny', 'oracle', 'guardian', 'phoenix', 'nexus', 'cloud'];
    
    console.log('🔧 Admin Portal initialized with triggers:', this.triggers);
  }

  /**
   * Check if sender is admin
   */
  isAdmin(phoneNumber) {
    const cleanNumber = phoneNumber.replace(/[@c.us]/g, '');
    return this.adminNumbers.some(admin => cleanNumber.includes(admin));
  }

  /**
   * Main entry point for admin messages
   */
  async handleAdminMessage(msg, text) {
    if (!this.isAdmin(msg.from)) {
      return false; // Not an admin
    }

    const phone = msg.from;
    const textLower = text.toLowerCase().trim();

    // Check for trigger words
    const detectedTrigger = this.triggers.find(t => textLower === t || textLower.startsWith(t + ' '));
    
    if (detectedTrigger) {
      return await this.handleTrigger(msg, detectedTrigger, text);
    }

    // Check for active session
    const session = stateManager.getSession(phone);
    
    if (session) {
      return await this.flowProcessor.processMessage(msg, text);
    }

    // Check for legacy commands (backward compatibility)
    if (textLower.startsWith('#addnews') || textLower.startsWith('admin')) {
      return await this.handleLegacyCommand(msg, text);
    }

    return false; // Not an admin command
  }

  /**
   * Handle trigger word
   */
  async handleTrigger(msg, triggerName, text) {
    const phone = msg.from;
    const trigger = triggerDefinitions[triggerName];

    if (!trigger) {
      return await msg.reply('❌ Unknown trigger. Type "admin help" for commands.');
    }

    // Check for quick command (e.g., "void price Urea 38000")
    const parts = text.trim().split(/\s+/);
    if (parts.length > 2) {
      return await this.handleQuickCommand(msg, triggerName, parts.slice(1));
    }

    // Start new session
    stateManager.startSession(phone, triggerName, {});

    // Show main menu
    return await this.showMainMenu(msg, trigger);
  }

  /**
   * Show main menu for a trigger
   */
  async showMainMenu(msg, trigger) {
    let menu = `${trigger.mainMenu.title}\n\n`;
    
    if (trigger.mainMenu.subtitle) {
      menu += `${trigger.mainMenu.subtitle}\n\n`;
    }
    
    menu += 'What would you like to do?\n\n';
    
    trigger.mainMenu.options.forEach((opt, index) => {
      menu += `${index + 1}️⃣ ${opt.label}\n`;
    });
    
    menu += `\nReply with number (1-${trigger.mainMenu.options.length})`;
    menu += '\n\n💡 Type CANCEL to exit';
    
    return await msg.reply(menu);
  }

  /**
   * Handle quick commands (power user shortcuts)
   */
  async handleQuickCommand(msg, triggerName, args) {
    // Quick command parsing
    // Example: "void price Urea 38000"
    // args = ['price', 'Urea', '38000']
    
    if (triggerName === 'void' && args[0] === 'price' && args.length >= 3) {
      const productName = args.slice(1, -1).join(' ');
      const newPrice = parseInt(args[args.length - 1]);
      
      if (isNaN(newPrice)) {
        return await msg.reply('❌ Invalid price. Format: void price <product> <price>');
      }

      // Search for product
      const products = await this.searchProducts(productName);
      
      if (products.length === 0) {
        return await msg.reply(`❌ Product "${productName}" not found.`);
      }

      if (products.length > 1) {
        return await msg.reply(`⚠️ Multiple products found. Please be more specific or use guided mode (type "void")`);
      }

      const product = products[0];
      
      // Confirm
      const oldPrice = parseInt(product.price.replace(/\D/g, ''));
      const change = newPrice - oldPrice;
      const changePercent = ((change / oldPrice) * 100).toFixed(1);
      
      const confirmation = `💰 *QUICK PRICE UPDATE*\n\nProduct: ${product.name}\nOld: UGX ${oldPrice.toLocaleString()}\nNew: UGX ${newPrice.toLocaleString()}\nChange: ${change > 0 ? '+' : ''}${changePercent}%\n\nConfirm? (YES/NO)`;
      
      // Store in temporary session for confirmation
      stateManager.startSession(msg.from, 'void', {
        quickCommand: true,
        product,
        newPrice,
        action: 'update_price'
      });
      stateManager.setStep(msg.from, 'quick_confirm');
      
      return await msg.reply(confirmation);
    }

    return await msg.reply('❌ Invalid quick command. Use guided mode for safety.');
  }

  /**
   * Handle legacy commands (backward compatibility)
   */
  async handleLegacyCommand(msg, text) {
    if (text.startsWith('#addnews')) {
      return await msg.reply(`💡 *NEW WAY TO ADD NEWS*\n\nInstead of:\n#addnews fraud urgent...\n\nJust type:\ngodeye\n\nThen I'll guide you step-by-step!\n\nTry it now: Type "godeye"`);
    }

    if (text.toLowerCase() === 'admin' || text.toLowerCase() === 'admin help') {
      return await this.sendTriggerHelp(msg);
    }

    return false;
  }

  /**
   * Send trigger help/welcome message
   */
  async sendTriggerHelp(msg) {
    const help = `🎯 *AGROF ADMIN PORTAL*\n\nSecret Control Triggers:\n\n👁️ *godeye* - News & Alerts\n   Manage news, fraud alerts, updates\n\n🌀 *void* - Store Management\n   Products, prices, inventory\n\n✨ *destiny* - Market Control\n   P2P marketplace, crops, deals\n\n🔮 *oracle* - Analytics\n   Sales, stats, reports\n\n🛡️ *guardian* - Customers\n   Customer management, orders\n\n🔥 *phoenix* - System Ops\n   Restart services, maintenance\n\n⚡ *nexus* - Automation\n   Workflows, triggers, tasks\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n💡 *HOW TO USE:*\nJust type any trigger word\nI'll guide you step-by-step!\n\nExample: Type "godeye" to manage news\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n🚀 Try now: Type "godeye" or "void"`;
    
    return await msg.reply(help);
  }

  /**
   * Search products
   */
  async searchProducts(query) {
    try {
      const response = await fetch(`${this.storeApiUrl}/products/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        // Fallback: search by name match
        const allProducts = await fetch(`${this.storeApiUrl}/products?limit=1000`);
        const products = await allProducts.json();
        return products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
}

module.exports = AdminCommandsV2;

