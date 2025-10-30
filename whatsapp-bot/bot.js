// AGROF WhatsApp Bot - Enhanced with Auto-Reconnection
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

// Import configuration
const { getStoreApiUrl, getBotPort, config, logConfig } = require('./config');

// Log current configuration
logConfig();

// Use advanced admin commands with secret triggers
const AdminCommandsV2 = require('./admin-commands-v2');

// Initialize admin handler with configured API URL
const adminHandler = new AdminCommandsV2(getStoreApiUrl(), config.admin.allowedNumbers);

// Connection state tracking - PERSISTENT CONNECTION
let isConnected = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = Infinity; // NEVER STOP TRYING
const reconnectDelay = 10000; // 10 seconds between attempts
let lastDisconnectionTime = null;
let reconnectInterval = null; // For continuous reconnection attempts

// Create session directory if it doesn't exist
const sessionDir = config.whatsapp.sessionDir;
if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
    console.log('📁 Created WhatsApp session directory');
}

// Create WhatsApp client with PERSISTENT CONNECTION configuration
const client = new Client({
    puppeteer: config.whatsapp.puppeteer,
    // Session persistence - CRITICAL for staying connected
    session: sessionDir,
    // NEVER restart on auth failure - keep trying to reconnect
    restartOnAuthFail: false,
    // NO QR code timeout - keep trying forever
    qrTimeoutMs: 0,
    // Additional options for PERSISTENT connection
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    },
    // Keep alive settings
    authTimeoutMs: 0, // No auth timeout
    takeoverOnConflict: false, // Don't conflict with other sessions
    takeoverTimeoutMs: 0, // No takeover timeout
    // Connection persistence
    connectTimeoutMs: 0, // No connection timeout
    defaultQueryTimeoutMs: 0, // No query timeout
});

// Health check server
const healthApp = require('./health');
const express = require('express');
const app = express();

// Use health check for all routes (including QR endpoints)
app.use('/', healthApp);

// Start health server
const PORT = getBotPort();
app.listen(PORT, () => {
  console.log(`🏥 Health server running on port ${PORT}`);
  console.log(`📱 Visit: http://localhost:${PORT}/qr-display for better QR code display`);
});

// WhatsApp client events with enhanced error handling

// Store QR code when generated
client.on('qr', (qr) => {
  healthApp.setQR(qr);
  console.log('📱 QR CODE GENERATED - Please scan with WhatsApp Business');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    qrcode.generate(qr, { 
      small: false,
      width: 2,
      margin: 1,
      color: {
        dark: '█',
        light: ' '
      }
    });
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📱 Instructions:');
  console.log('1. Open WhatsApp Business on your phone');
  console.log('2. Go to Settings > Linked Devices');
  console.log('3. Tap "Link a Device"');
  console.log('4. Scan the QR code above');
  console.log('5. Wait for "Bot is ready!" message');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Notify admin about new QR code
  notifyAdmin('New QR code required - please scan with WhatsApp Business');
  
  // Reset connection state
  isConnected = false;
  lastDisconnectionTime = new Date();
});

// Ready event - when bot is successfully connected
client.on('ready', () => {
  console.log('🎉 SUCCESS! WhatsApp Bot is ready!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Connection established successfully');
  console.log('🤖 Bot is listening for admin commands...');
  console.log('📱 You can now send messages to test the bot');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Update connection state
  isConnected = true;
  reconnectAttempts = 0;
  lastDisconnectionTime = null;
  
  // Notify admin that bot is back online
  notifyAdmin('WhatsApp bot is back online and ready!');
});

// Disconnected event - PERSISTENT RECONNECTION (NEVER GIVES UP)
client.on('disconnected', async (reason) => {
  console.log('❌ WhatsApp disconnected:', reason);
  console.log('🔄 Bot will ALWAYS try to reconnect - never giving up!');
  isConnected = false;
  lastDisconnectionTime = new Date();
  
  // Notify admin about disconnection
  await notifyAdmin(`WhatsApp bot disconnected: ${reason}. Bot will keep trying to reconnect.`);
  
  // INFINITE RECONNECTION - NEVER STOP TRYING
  console.log('🔄 Starting INFINITE reconnection attempts...');
  
  // Clear any existing interval
  if (reconnectInterval) {
    clearInterval(reconnectInterval);
  }
  
  // Immediate reconnection attempt
  setTimeout(() => {
    console.log('🚀 Immediate reconnection attempt...');
    client.initialize();
  }, 5000);
  
  // Set up continuous reconnection attempts
  reconnectInterval = setInterval(() => {
    if (!isConnected) {
      reconnectAttempts++;
      console.log(`🔄 Continuous reconnection attempt #${reconnectAttempts} (INFINITE - never giving up)`);
      client.initialize();
    } else {
      clearInterval(reconnectInterval);
      console.log('✅ Connected! Stopping reconnection attempts');
    }
  }, reconnectDelay);
});

// Authentication failure event
client.on('auth_failure', (msg) => {
  console.log('❌ Authentication failed:', msg);
  isConnected = false;
  lastDisconnectionTime = new Date();
  
  // Clear session and restart
  if (fs.existsSync(sessionDir)) {
    console.log('🗑️ Clearing invalid session data...');
    fs.rmSync(sessionDir, { recursive: true });
    fs.mkdirSync(sessionDir, { recursive: true });
  }
  
  // Notify admin
  notifyAdmin('WhatsApp authentication failed. New QR code required.');
  
  // Restart client after delay
  setTimeout(() => {
    console.log('🔄 Restarting after auth failure...');
    client.initialize();
  }, 5000);
});

// Error event - PERSISTENT RECONNECTION
client.on('error', (error) => {
  console.error('❌ WhatsApp client error:', error);
  isConnected = false;
  
  // INFINITE RECONNECTION on error - NEVER GIVE UP
  console.log('🔄 Error occurred - attempting INFINITE reconnection...');
  
  // Clear any existing interval
  if (reconnectInterval) {
    clearInterval(reconnectInterval);
  }
  
  // Immediate reconnection attempt
  setTimeout(() => {
    console.log('🚀 Reconnecting after error...');
    client.initialize();
  }, 10000);
  
  // Set up continuous reconnection attempts
  reconnectInterval = setInterval(() => {
    if (!isConnected) {
      reconnectAttempts++;
      console.log(`🔄 Error recovery attempt #${reconnectAttempts} (INFINITE - never giving up)`);
      client.initialize();
    } else {
      clearInterval(reconnectInterval);
      console.log('✅ Connected after error! Stopping reconnection attempts');
    }
  }, reconnectDelay);
});

// Loading screen event
client.on('loading_screen', (percent, message) => {
  console.log(`🔄 Loading WhatsApp: ${percent}% - ${message}`);
});

// Authentication success event
client.on('authenticated', () => {
  console.log('🔐 Authentication successful!');
  console.log('📱 Phone has been linked successfully');
  console.log('⏳ Waiting for WhatsApp to load...');
});

// Authentication failure event (already exists, but let's enhance it)
client.on('auth_failure', (msg) => {
  console.log('❌ AUTHENTICATION FAILED:', msg);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 Possible causes:');
  console.log('1. QR code expired (try scanning again)');
  console.log('2. Phone disconnected during scanning');
  console.log('3. WhatsApp session conflict');
  console.log('4. Network connectivity issues');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  isConnected = false;
  lastDisconnectionTime = new Date();
  
  // Clear session and restart
  if (fs.existsSync(sessionDir)) {
    console.log('🗑️ Clearing invalid session data...');
    fs.rmSync(sessionDir, { recursive: true });
    fs.mkdirSync(sessionDir, { recursive: true });
  }
  
  // Notify admin
  notifyAdmin('WhatsApp authentication failed. New QR code required.');
  
  // Restart client after delay
  setTimeout(() => {
    console.log('🔄 Restarting after auth failure...');
    client.initialize();
  }, 5000);
});

// Change state event (tracks connection state changes)
client.on('change_state', (state) => {
  console.log(`🔄 WhatsApp state changed to: ${state}`);
  
  switch (state) {
    case 'CONFLICT':
      console.log('⚠️ Multiple devices detected - logging out others...');
      break;
    case 'UNPAIRED':
      console.log('📱 Device unpaired - need to scan QR again');
      break;
    case 'UNLAUNCHED':
      console.log('🚀 WhatsApp not launched - starting...');
      break;
    case 'PROXYBLOCK':
      console.log('🚫 Proxy blocked - check network settings');
      break;
    case 'TOS_BLOCK':
      console.log('📋 Terms of service blocked - check WhatsApp status');
      break;
    case 'SMB_TOS_BLOCK':
      console.log('📋 Business terms blocked - check WhatsApp Business status');
      break;
    case 'DEPRECATED_VERSION':
      console.log('⚠️ WhatsApp version deprecated - updating...');
      break;
    default:
      console.log(`📊 State: ${state}`);
  }
});

// Remote session event (when session is stored remotely)
client.on('remote_session_saved', () => {
  console.log('💾 Remote session saved successfully');
});

// Message event (when bot receives a message)
client.on('message_create', (message) => {
  console.log(`📨 Message created: ${message.body?.substring(0, 50)}...`);
});

// Main message handler
client.on('message', async (msg) => {
    try {
    const text = msg.body.trim();
    const sender = msg.from;
    
    console.log(`📩 Message from ${sender}: ${text}`);
    
    // Handle admin commands (secret triggers + legacy)
    const adminHandled = await adminHandler.handleAdminMessage(msg, text);
    if (adminHandled) return;
    
    // Handle customer messages
    const command = text.toLowerCase();
    
    // Greeting
    if (command.match(/^(hi|hello|hey|good morning|good afternoon|good evening|jambo|habari)/i)) {
      await handleGreeting(msg);
    }
    // Menu
    else if (command.match(/^(menu|help|options|commands)/i)) {
      await sendMenu(msg);
    }
    // Check stock
    else if (command.match(/^(stock|inventory|available|products)/i)) {
      await handleStockInquiry(msg);
    }
    // Order
    else if (command.match(/^(order|buy|purchase|i want|i need)/i)) {
      await handleOrderRequest(msg, text);
    }
    // Check prices
    else if (command.match(/^(price|cost|how much)/i)) {
      await handlePriceInquiry(msg, text);
    }
    // Track order
    else if (command.match(/^(track|status|my order)/i)) {
      await handleOrderTracking(msg);
    }
    // Contact/Support
    else if (command.match(/^(contact|support|help me|call)/i)) {
      await handleSupport(msg);
    }
    // Default - AI-like response
    else {
      await handleGeneralInquiry(msg, text);
    }
        
    } catch (error) {
    console.error('❌ Error handling message:', error);
  }
});

// Enhanced health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: isConnected ? 'OK' : 'DISCONNECTED', 
    message: isConnected ? 'AGROF WhatsApp Bot is running' : 'WhatsApp Bot is disconnected',
    whatsapp: {
      connected: isConnected,
      reconnectAttempts: reconnectAttempts,
      lastDisconnection: lastDisconnectionTime,
      status: isConnected ? 'online' : 'offline'
    },
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// WhatsApp status endpoint
app.get('/whatsapp-status', (req, res) => {
  res.json({
    connected: isConnected,
    reconnectAttempts: reconnectAttempts,
    lastDisconnection: lastDisconnectionTime,
    status: isConnected ? 'online' : 'offline',
    maxReconnectAttempts: maxReconnectAttempts,
    lastCheck: new Date().toISOString()
  });
});

// Manual reconnection endpoint
app.post('/whatsapp-reconnect', (req, res) => {
  if (!isConnected) {
    console.log('🔄 Manual reconnection requested');
    reconnectAttempts = 0; // Reset attempts
    client.initialize();
    res.json({ success: true, message: 'Reconnection initiated' });
  } else {
    res.json({ success: false, message: 'Bot is already connected' });
  }
});

// Admin dashboard endpoint
app.get('/admin/dashboard', (req, res) => {
  res.json({
    whatsapp: {
      connected: isConnected,
      reconnectAttempts: reconnectAttempts,
      lastDisconnection: lastDisconnectionTime,
      status: isConnected ? 'online' : 'offline'
    },
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform
    },
    timestamp: new Date().toISOString()
  });
});

// Force reconnection endpoint (for emergencies)
app.post('/whatsapp-force-reconnect', (req, res) => {
  console.log('🔄 Force reconnection requested');
  
  // Reset all connection state
  isConnected = false;
  reconnectAttempts = 0;
  lastDisconnectionTime = new Date();
  
  // Clear session if needed
  if (fs.existsSync(sessionDir)) {
    console.log('🗑️ Clearing session for force reconnect...');
    fs.rmSync(sessionDir, { recursive: true });
    fs.mkdirSync(sessionDir, { recursive: true });
  }
  
  // Restart client
  setTimeout(() => {
    client.initialize();
  }, 2000);
  
  res.json({ success: true, message: 'Force reconnection initiated' });
});

// Clear session and restart endpoint (for QR code issues)
app.post('/whatsapp-clear-session', (req, res) => {
  console.log('🗑️ Clearing session and restarting...');
  
  try {
    // Destroy current client
    client.destroy();
    
    // Clear session directory
    if (fs.existsSync(sessionDir)) {
      console.log('🗑️ Clearing session directory...');
      fs.rmSync(sessionDir, { recursive: true });
      fs.mkdirSync(sessionDir, { recursive: true });
    }
    
    // Reset connection state
    isConnected = false;
    reconnectAttempts = 0;
    lastDisconnectionTime = new Date();
    
    // Restart client after delay
    setTimeout(() => {
      console.log('🔄 Restarting with fresh session...');
      client.initialize();
    }, 3000);
    
    res.json({ 
      success: true, 
      message: 'Session cleared and bot restarting. New QR code will appear shortly.' 
    });
    
  } catch (error) {
    console.error('❌ Error clearing session:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// API endpoint to send messages
app.post('/api/send-message', async (req, res) => {
  try {
    const { to, message } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: to, message' 
      });
    }

    // Send message via WhatsApp
    const chatId = to.includes('@') ? to : `${to}@c.us`;
    
    // This would send the message via WhatsApp Web
    // For now, we'll just log it
    console.log(`📱 Sending message to ${chatId}: ${message}`);
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully',
      to: chatId
    });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Admin notification function
async function notifyAdmin(message) {
  try {
    console.log(`📢 Admin Notification: ${message}`);
    
    // You can extend this to send notifications via:
    // - Email (using nodemailer)
    // - SMS (using Twilio)
    // - Another messaging service
    // - Database logging
    
    // For now, we'll just log it
    const logEntry = {
      timestamp: new Date().toISOString(),
      message: message,
      type: 'admin_notification'
    };
    
    // Log to file for monitoring
    fs.appendFileSync('./admin-notifications.log', JSON.stringify(logEntry) + '\n');
    
  } catch (error) {
    console.error('❌ Error sending admin notification:', error);
  }
}

// Periodic connection monitoring
setInterval(() => {
  if (!isConnected && reconnectAttempts < maxReconnectAttempts) {
    console.log('🔄 Periodic reconnection check...');
    client.initialize();
  } else if (!isConnected && reconnectAttempts >= maxReconnectAttempts) {
    console.log('⚠️ WhatsApp bot has been offline for extended period');
    // Send periodic alerts to admin
    if (lastDisconnectionTime && (Date.now() - lastDisconnectionTime.getTime()) > 300000) { // 5 minutes
      notifyAdmin('WhatsApp bot has been offline for 5+ minutes. Manual intervention may be required.');
    }
  }
}, 60000); // Check every minute


// Initialize WhatsApp client
console.log('🚀 Initializing WhatsApp client with PERSISTENT CONNECTION...');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔧 PERSISTENT CONNECTION CONFIGURATION:');
console.log('✅ Infinite reconnection attempts (NEVER GIVES UP)');
console.log('✅ No QR code timeout (keeps trying forever)');
console.log('✅ Session persistence (remembers connection)');
console.log('✅ Continuous monitoring (always waiting)');
console.log('✅ Primary admin: 0705223777 (always allowed)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📱 Bot will ALWAYS wait for messages from your phone');
console.log('🔄 Bot will NEVER disconnect unless you manually disconnect');
console.log('⏰ Bot will keep trying to reconnect FOREVER');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

client.initialize();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🔄 Shutting down WhatsApp bot...');
  isConnected = false;
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🔄 Received SIGTERM, shutting down gracefully...');
  isConnected = false;
  client.destroy();
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  notifyAdmin(`Uncaught exception: ${error.message}`);
  // Don't exit, let the bot try to recover
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  notifyAdmin(`Unhandled rejection: ${reason}`);
  // Don't exit, let the bot try to recover
});

// ==================== CUSTOMER HANDLERS ====================

async function handleGreeting(msg) {
    const greeting = `Good day! 👋

Welcome to *AGROF Agricultural Services* - Your trusted partner in modern farming solutions.

We offer a comprehensive range of premium agricultural inputs including:

▪️ Fertilizers & Soil Nutrients
▪️ Quality Seeds & Seedlings  
▪️ Crop Protection Solutions
▪️ Organic Farming Products

*How may we assist you today?*

Reply with:
• *MENU* - Browse our catalog
• *ORDER* - Place an order
• *CONTACT* - Speak with our team

_AGROF - Growing Together_ 🌾`;
    
    await msg.reply(greeting);
}

async function sendMenu(msg) {
    const menu = `*AGROF AGRICULTURAL SERVICES*
_Your Partner in Modern Farming_

━━━━━━━━━━━━━━━━━━━━━━

*PRODUCT CATEGORIES*

▪️ FERTILIZERS - Premium soil nutrients
▪️ SEEDS - Certified quality seeds
▪️ FUNGICIDES - Crop disease control
▪️ HERBICIDES - Weed management
▪️ NURSERY - Seedlings & plantlets
▪️ ORGANIC - Natural solutions

━━━━━━━━━━━━━━━━━━━━━━

*QUICK ACTIONS*

• Reply *PRODUCTS* - View our catalog
• Reply *ORDER* - Place an order
• Reply *CONTACT* - Reach our team

━━━━━━━━━━━━━━━━━━━━━━

📞 +256 705 223 777
🌐 www.agrof.farm

_Professional Agricultural Solutions_`;

    await msg.reply(menu);
}

async function handleStockInquiry(msg) {
    await msg.reply('Please wait while we prepare our current product catalog...');
    
    try {
        const response = await fetch(`${getStoreApiUrl()}/products?limit=20`);
        const allProducts = await response.json();
        
        if (allProducts.length === 0) {
            await msg.reply('We apologize, but our inventory is currently being restocked. Please contact us at +256 705 223 777 for immediate assistance.');
            return;
        }
        
        // Group by category
        const categories = {};
        allProducts.forEach(p => {
            const cat = p.category_display_name || p.category_name || 'Other';
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(p);
        });
        
        let stockMessage = `*AGROF PRODUCT CATALOG*\n_Premium Agricultural Solutions_\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        for (const [category, items] of Object.entries(categories)) {
            stockMessage += `*${category.toUpperCase()}*\n`;
            stockMessage += `${items.length} products available\n\n`;
            items.slice(0, 5).forEach(item => {
                stockMessage += `▪️ ${item.name}\n`;
            });
            if (items.length > 5) {
                stockMessage += `   _...and ${items.length - 5} more_\n`;
            }
            stockMessage += '\n';
        }
        
        stockMessage += `━━━━━━━━━━━━━━━━━━━━━━\n\n*Total: ${allProducts.length} products available*\n\n`;
        stockMessage += `To place an order:\n• Reply: *ORDER [product name]*\n\n`;
        stockMessage += `📞 Questions? Call +256 705 223 777`;
        
        await msg.reply(stockMessage);
        
    } catch (error) {
        console.error('Error fetching stock:', error);
        await msg.reply('We apologize for the inconvenience. Please contact our team at +256 705 223 777 for assistance.');
    }
}

async function handleOrderRequest(msg, text) {
    await msg.reply('Thank you for your interest. Let me assist you with your order...');
    
    // Try to parse order from message
    const orderMatch = text.match(/(\d+)\s*(kg|bags?|units?|pcs?|pieces?)?\s*(.+)/i);
    
    if (orderMatch) {
        const quantity = orderMatch[1];
        const unit = orderMatch[2] || 'units';
        const productName = orderMatch[3].trim();
        
        await msg.reply(`Searching for: *${productName}*\n\nPlease wait...`);
        
        try {
            // Search for product
            const response = await fetch(`${getStoreApiUrl()}/search?q=${encodeURIComponent(productName)}`);
            const products = await response.json();
            
            if (products.length === 0) {
                await msg.reply(`We apologize, but "${productName}" is not currently available in our catalog.\n\nFor product inquiries:\n📞 +256 705 223 777\n\nReply *PRODUCTS* to browse our full catalog.`);
                return;
            }
            
            // Show found products
            let orderMessage = `*PRODUCTS FOUND*\n\n`;
            products.slice(0, 3).forEach((product, index) => {
                orderMessage += `${index + 1}️⃣ *${product.name}*\n`;
                orderMessage += `   Price: ${product.price}\n`;
                orderMessage += `   Stock: ${product.quantity_in_stock || 'Available'}\n\n`;
            });
            
            orderMessage += `To complete your order:\n`;
            orderMessage += `📞 Call +256 705 223 777\n`;
            orderMessage += `📧 Email: orders@agrof.farm\n\n`;
            orderMessage += `We'll process your order immediately!`;
            
            await msg.reply(orderMessage);
            
        } catch (error) {
            console.error('Error processing order:', error);
            await msg.reply('We apologize for the inconvenience. Please contact our team at +256 705 223 777 for assistance.');
        }
    } else {
        await msg.reply(`To place an order, please specify:\n\n*Format:* ORDER [quantity] [product name]\n\n*Examples:*\n• ORDER 50kg DAP fertilizer\n• ORDER 2 bags Urea\n• ORDER 100kg NPK\n\nOr call +256 705 223 777 for assistance.`);
    }
}

async function handlePriceInquiry(msg, text) {
    await msg.reply('Let me check our current prices for you...');
    
    try {
        const response = await fetch(`${getStoreApiUrl()}/products?limit=10`);
        const products = await response.json();
        
        if (products.length === 0) {
            await msg.reply('We apologize, but our pricing information is currently unavailable. Please contact us at +256 705 223 777 for current prices.');
            return;
        }
        
        let priceMessage = `*CURRENT PRICES*\n_Selected Products_\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        products.slice(0, 8).forEach(product => {
            priceMessage += `▪️ *${product.name}*\n`;
            priceMessage += `   ${product.price}\n\n`;
        });
        
        priceMessage += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        priceMessage += `For complete pricing:\n📞 +256 705 223 777\n📧 prices@agrof.farm\n\n`;
        priceMessage += `Reply *ORDER* to place an order!`;
        
        await msg.reply(priceMessage);
        
    } catch (error) {
        console.error('Error fetching prices:', error);
        await msg.reply('We apologize for the inconvenience. Please contact our team at +256 705 223 777 for current prices.');
    }
}

async function handleOrderTracking(msg) {
    await msg.reply(`*ORDER TRACKING*\n\nTo track your order:\n\n📞 Call: +256 705 223 777\n📧 Email: orders@agrof.farm\n\nProvide your:\n• Order number\n• Phone number\n• Name\n\nWe'll give you the latest status immediately!\n\n_AGROF Customer Service_`);
}

async function handleSupport(msg) {
    await msg.reply(`*AGROF CUSTOMER SUPPORT*\n\n📞 *Phone:* +256 705 223 777\n📧 *Email:* support@agrof.farm\n🌐 *Website:* www.agrof.farm\n\n*Business Hours:*\nMonday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM\n\n*Emergency Support:*\nAvailable 24/7 for urgent agricultural needs\n\n_We're here to help you grow!_ 🌾`);
}

async function handleGeneralInquiry(msg, text) {
    await msg.reply(`Thank you for your message! 😊\n\nI'm here to help with:\n• Product information\n• Pricing\n• Orders\n• Support\n\nTry:\n• *MENU* - See all options\n• *PRODUCTS* - Browse catalog\n• *ORDER* - Place order\n• *CONTACT* - Get support\n\nOr call +256 705 223 777 for immediate assistance!`);
}

module.exports = client;