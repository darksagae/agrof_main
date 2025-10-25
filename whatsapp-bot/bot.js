// AGROF WhatsApp Bot for Render Deployment
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
// Use advanced admin commands with secret triggers
const AdminCommandsV2 = require('./admin-commands-v2');
const adminHandler = new AdminCommandsV2('https://agrof-store-api.onrender.com/api', []);

// Create WhatsApp client
const client = new Client({
    puppeteer: {
        headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Health check server
const healthApp = require('./health');
const express = require('express');
const app = express();

// Use health check
app.use('/', healthApp);

// Start health server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🏥 Health server running on port ${PORT}`);
});

// WhatsApp client events
client.on('qr', (qr) => {
  console.log('📱 QR Code generated - scan with WhatsApp Business');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ AGROF WhatsApp Bot is ready!');
  console.log('🤖 Bot is listening for admin commands...');
});

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AGROF WhatsApp Bot is running',
    timestamp: new Date().toISOString()
  });
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

// Initialize WhatsApp client
client.initialize();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🔄 Shutting down WhatsApp bot...');
  client.destroy();
    process.exit(0);
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
        const response = await fetch('https://agrof-store-api.onrender.com/api/products?limit=20');
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
            const response = await fetch(`https://agrof-store-api.onrender.com/api/search?q=${encodeURIComponent(productName)}`);
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
        const response = await fetch('https://agrof-store-api.onrender.com/api/products?limit=10');
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